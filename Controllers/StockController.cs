using System;
using System.Collections.Generic;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace NetCore.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StockController : ControllerBase
    {
        private readonly ILogger<StockController> _logger;

        public StockController(ILogger<StockController> logger)
        {
            _logger = logger;
        }

        private IEnumerable<StockItem> GetContents()
        {
            StockItem[] stockItems = new StockItem[] {
                new StockItem { ProductName = "Product 1", Quantity = 13, Unit = "Pieces", PurchasedDT = DateTime.Now },
                new StockItem { ProductName = "Product 2", Quantity = 1.6M, Unit = "KGs", PurchasedDT = DateTime.Now },
                new StockItem { ProductName = "Product 3", Quantity = 2, Unit = "Pieces", PurchasedDT = DateTime.Now },
                new StockItem { ProductName = "Product 4", Quantity = 1, Unit = "KGs", PurchasedDT = DateTime.Now },
            };

            return stockItems;
        }

        [HttpGet]
        public IEnumerable<StockItem> Get()
        {
            Thread.Sleep(1000);
            return GetContents();
        }
    }
}