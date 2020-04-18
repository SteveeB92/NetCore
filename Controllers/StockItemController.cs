namespace NetCore
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Threading;
    using Microsoft.AspNetCore.Mvc;

    [ApiController]
    [Route("[controller]")]
    public class StockItemController : Controller
    {
        private readonly ICosmosDbService _cosmosDbService;
        private static List<StockItem> _stockItems = null;

        public StockItemController(ICosmosDbService cosmosDbService)
        {
            _cosmosDbService = cosmosDbService;
        }
        
        [HttpGet("Index")]
        public IEnumerable<StockItem> Get()
        {
            // If we have not previously looked these up, look them up now
            if (_stockItems == null)
            {
                Thread.Sleep(2000);
            
                IEnumerable<StockItem> items = _cosmosDbService.GetItemsAsync("SELECT * FROM c").GetAwaiter().GetResult();

                _stockItems = items.ToList();
            }

            return _stockItems;
        }

        [HttpPost("Create")]
        public IEnumerable<StockItem> CreateAsync([FromBody] StockItem item)
        {
            item.Id = Guid.NewGuid().ToString();
            _cosmosDbService.AddItemAsync(item).GetAwaiter().GetResult();

            _stockItems.Add(item);

            return Get();
        }

        [HttpPost("Edit")]
        public IEnumerable<StockItem> EditAsync([FromBody] StockItem item)
        {
            _cosmosDbService.UpdateItemAsync(item.Id, item).GetAwaiter().GetResult();

            _stockItems.Remove(_stockItems.First(existingItem => existingItem.Id == item.Id));
            _stockItems.Add(item);

            return Get();
        }

        [HttpPost("Delete")]
        public IEnumerable<StockItem> DeleteConfirmedAsync([FromBody] string id)
        {
            _cosmosDbService.DeleteItemAsync(id).GetAwaiter().GetResult();
            _stockItems.Remove(_stockItems.First(existingItem => existingItem.Id == id));
            return Get();
        }

        [ActionName("Details")]
        public async Task<ActionResult> DetailsAsync(string id)
        {
            return View(await _cosmosDbService.GetItemAsync(id));
        }
    }
}