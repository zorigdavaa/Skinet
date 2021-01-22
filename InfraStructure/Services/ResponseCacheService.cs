using System;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Interfaces;
using StackExchange.Redis;

namespace InfraStructure.Services
{
    public class ResponseCacheService : IResponseCacheService
    {
        private IDatabase _database;
        public ResponseCacheService(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }

        public async Task CacheResponseAsync(string cacheKey, object response, TimeSpan timeToLive)
        {
            if (response == null)
            {
                return;
            }
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(response, options);
            await _database.StringSetAsync(cacheKey,json,timeToLive);
        }

        public async Task<string> GetCachedResponseAsync(string cacheKey)
        {
            return await _database.StringGetAsync(cacheKey);
        }
    }
}