using System.Reflection;
using Microsoft.Extensions.Logging;

namespace AnimeTakusan.AnimeProviders.Helpers;

public class QueryLoader
{
    private static readonly Dictionary<string, string> _cache = new();
    private readonly ILogger<QueryLoader> _logger;

    public QueryLoader(ILogger<QueryLoader> logger)
    {
        _logger = logger;
    }

    public async Task<string> LoadQueryAsync(string queryFileName)
    {
        if (_cache.ContainsKey(queryFileName))
        {
            return _cache[queryFileName];
        }

        var assembly = Assembly.GetExecutingAssembly();
        var resourceName = $"AnimeTakusan.AnimeProviders.Queries.{queryFileName}.graphql";
        
        using var stream = assembly.GetManifestResourceStream(resourceName);
        if (stream == null)
            throw new FileNotFoundException($"Query file {queryFileName} not found");
            
        using var reader = new StreamReader(stream);

        string query = await reader.ReadToEndAsync();
        _cache[queryFileName] = query;

        return query;
    }
}
