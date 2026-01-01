using System.Collections.Concurrent;
using System.Reflection;

namespace AnimeTakusan.AnimeProviders.Helpers;

public interface IQueryLoader
{
    Task<string> LoadQueryAsync(string queryFileName);
}

public class QueryLoader : IQueryLoader
{
    // Concurrent dictionary to grant thread-safe caching and avoid race conditions
    private static readonly ConcurrentDictionary<string, string> _cache = new();

    public async Task<string> LoadQueryAsync(string queryFileName)
    {
        if (_cache.TryGetValue(queryFileName, out var cachedQuery))
        {
            return cachedQuery;
        }

        var assembly = Assembly.GetExecutingAssembly();
        var resourceName = $"AnimeTakusan.AnimeProviders.Queries.{queryFileName}.graphql";
        
        using var stream = assembly.GetManifestResourceStream(resourceName);
        if (stream == null)
            throw new FileNotFoundException($"Query file {queryFileName} not found");
            
        using var reader = new StreamReader(stream);

        string query = await reader.ReadToEndAsync();
        _cache.TryAdd(queryFileName, query);

        return query;
    }
}
