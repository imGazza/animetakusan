using System.Collections.Concurrent;
using System.Text.Json;
using AnimeTakusan.Application.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace AnimeTakusan.Infrastructure.Caching;

public class RedisCacheService : ICacheService, IInjectable
{
    private readonly IDistributedCache _distributedCache;
    private readonly ILogger<RedisCacheService> _logger;

    // Static because all the instances needs to share the same locks, otherwise they wouldn't
    // "see" each other and would create multiple locks for the same key.
    private static readonly ConcurrentDictionary<string, SemaphoreSlim> Locks = new();

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public RedisCacheService(IDistributedCache distributedCache, ILogger<RedisCacheService> logger)
    {
        _distributedCache = distributedCache;
        _logger = logger;
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        byte[]? bytes;
        try
        {
            bytes = await _distributedCache.GetAsync(key, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving cache for key {Key}", key);
            return default;
        }

        if (bytes is null)
            return default;

        try
        {
            return JsonSerializer.Deserialize<T>(bytes, JsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deserializing cache for key {Key}", key);
            return default;
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan ttl, CancellationToken cancellationToken = default)
    {
        var bytes = JsonSerializer.SerializeToUtf8Bytes(value, JsonOptions);
        try
        {
            await _distributedCache.SetAsync(key, bytes, new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = ttl
            }, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cache for key {Key}", key);
        }
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        try
        {
            await _distributedCache.RemoveAsync(key, cancellationToken);
            _logger.LogDebug("Cache removed for key {Key}", key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache for key {Key}", key);
        }
    }

    public async Task<T> GetOrSetAsync<T>(string key, TimeSpan ttl, Func<Task<T>> factory, CancellationToken cancellationToken = default)
    {
        var cachedValue = await GetAsync<T>(key, cancellationToken);
        if (cachedValue is not null)
        {
            _logger.LogDebug("Cache hit for key {Key}", key);
            return cachedValue;
        }            

        var semaphore = Locks.GetOrAdd(key, _ => new SemaphoreSlim(1, 1));
        await semaphore.WaitAsync(cancellationToken);
        try
        {
            // Double-check if the value was set while waiting for the lock
            cachedValue = await GetAsync<T>(key, cancellationToken);
            if (cachedValue is not null)
                return cachedValue;

            var value = await factory();
            await SetAsync(key, value, ttl, cancellationToken);
            _logger.LogDebug("Cache miss for key {Key}. Value set in cache.", key);
            return value;
        }
        finally
        {
            semaphore.Release();
            if (semaphore.CurrentCount == 1)
                Locks.TryRemove(new KeyValuePair<string, SemaphoreSlim>(key, semaphore));
        }
    }
}
