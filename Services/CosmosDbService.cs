namespace NetCore
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Azure.Cosmos;

    public class CosmosDbService : ICosmosDbService
    {
        private Container _container;

        public CosmosDbService(CosmosClient dbClient, string databaseName, string containerName)
        {
            this._container = dbClient.GetContainer(databaseName, containerName);
        }
        
        public async Task AddItemAsync(StockItem item)
        {
            await this._container.CreateItemAsync<StockItem>(item, new PartitionKey(item.Id));
        }

        public async Task DeleteItemAsync(string id)
        {
            await this._container.DeleteItemAsync<StockItem>(id, new PartitionKey(id));
        }

        public async Task<StockItem> GetItemAsync(string id)
        {
            try
            {
                ItemResponse<StockItem> response = await this._container.ReadItemAsync<StockItem>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch(CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            { 
                return null;
            }
        }

        public async Task<IEnumerable<StockItem>> GetItemsAsync(string queryString)
        {
            var query = this._container.GetItemQueryIterator<StockItem>(new QueryDefinition(queryString));
            List<StockItem> results = new List<StockItem>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                
                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task UpdateItemAsync(string id, StockItem item)
        {
            await this._container.UpsertItemAsync<StockItem>(item, new PartitionKey(id));
        }
    }
}