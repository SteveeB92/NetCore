namespace NetCore
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface ICosmosDbService
    {
        Task<IEnumerable<StockItem>> GetItemsAsync(string query);
        Task<StockItem> GetItemAsync(string id);
        Task AddItemAsync(StockItem item);
        Task UpdateItemAsync(string id, StockItem item);
        Task DeleteItemAsync(string id);
    }
}