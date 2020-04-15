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
        public StockItemController(ICosmosDbService cosmosDbService)
        {
            _cosmosDbService = cosmosDbService;
        }
        
        [HttpGet("Index")]
        public IEnumerable<StockItem> Get()
        {
            Thread.Sleep(1000);
            IEnumerable<StockItem> items = _cosmosDbService.GetItemsAsync("SELECT * FROM c").GetAwaiter().GetResult();

            if(!items.Any())
                yield break;

            foreach(StockItem item in items)
                yield return item;
        }

        [HttpPost("Create")]
        public IEnumerable<StockItem> CreateAsync([FromBody] StockItem item)
        {
            if (ModelState.IsValid)
            {
                item.Id = Guid.NewGuid().ToString();
                _cosmosDbService.AddItemAsync(item).GetAwaiter().GetResult();
            }

            return Get();
        }

        [HttpPost("Edit")]
        public IEnumerable<StockItem> EditAsync([FromBody] StockItem item)
        {
            if (ModelState.IsValid)
            {
                _cosmosDbService.UpdateItemAsync(item.Id, item).GetAwaiter().GetResult();
            }

            return Get();
        }

        [ActionName("Edit")]
        public async Task<ActionResult> EditAsync(string id)
        {
            if (id == null)
            {
                return BadRequest();
            }

            StockItem item = await _cosmosDbService.GetItemAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            return View(item);
        }

        [ActionName("Delete")]
        public async Task<ActionResult> DeleteAsync(string id)
        {
            if (id == null)
            {
                return BadRequest();
            }

            StockItem item = await _cosmosDbService.GetItemAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            return View(item);
        }

        [HttpPost("Delete")]
        public IEnumerable<StockItem> DeleteConfirmedAsync([FromBody] string id)
        {
            _cosmosDbService.DeleteItemAsync(id).GetAwaiter().GetResult();
            return Get();
        }

        [ActionName("Details")]
        public async Task<ActionResult> DetailsAsync(string id)
        {
            return View(await _cosmosDbService.GetItemAsync(id));
        }
    }
}