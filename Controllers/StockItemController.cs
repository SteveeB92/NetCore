namespace NetCore
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using System.Threading;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Tesseract;
    using System.IO;

    [ApiController]
    [Route("[controller]")]
    public class StockItemController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ICosmosDbService _cosmosDbService;
        private static List<StockItem> _stockItems = null;

        public StockItemController(ICosmosDbService cosmosDbService, IWebHostEnvironment webHostEnvironment)
        {
            _cosmosDbService = cosmosDbService;
            _webHostEnvironment = webHostEnvironment;
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

        [HttpPost("UploadReceipt")]
        public IEnumerable<StockItem> UploadReceiptAsync([FromForm] IFormFile input1)
        {
            List<StockItem> stockItems = new List<StockItem>();

            string pathToTesseractTessData = Path.Combine(_webHostEnvironment.ContentRootPath, "tessdata");
            using (TesseractEngine engine = new TesseractEngine(pathToTesseractTessData, "eng", EngineMode.Default))
            {
                using (Pix pix = Pix.LoadFromMemory(GetByteArrayFromStream(input1.OpenReadStream())))
                {
                    using (Page page = engine.Process(pix))
                    {
                        string meanCofidence = String.Format("{0:P}", page.GetMeanConfidence());
                        string text = page.GetText();

                        string[] linesOnPage = text.Split("\n");

                        // Between the Marina word and the Total work we have what was actually purchased
                        for (int i = GetLineWithMarinaText(linesOnPage) + 1; i < GetLineWithTotalText(linesOnPage); i++)
                        {
                            string productName = GetProductNameFromLine(linesOnPage[i]);

                            if (!String.IsNullOrWhiteSpace(productName))
                            {
                                stockItems.Add(new StockItem()
                                {
                                    ProductName = Thread.CurrentThread.CurrentCulture.TextInfo.ToTitleCase(productName.ToLower()),
                                    PurchasedDT = DateTime.Now,
                                    Quantity = 1,
                                    TempId = Guid.NewGuid().ToString()
                                });
                            }
                        }
                    }
                }
            }

            return stockItems;
        }

        private byte[] GetByteArrayFromStream(Stream stream)
        {
            using (MemoryStream memoryStream = new MemoryStream())
            {
                stream.CopyTo(memoryStream);
                return memoryStream.ToArray();
            }
        }

        private int GetLineWithMarinaText(string[] linesOnPage)
        {         
            Regex regexExpression = new Regex("((m|n)(a|4)r(i|1|l)(n|m)(a|4))", RegexOptions.Compiled | RegexOptions.IgnoreCase);
            return GetLineWithText(linesOnPage, regexExpression) ??  throw new ArgumentException("Unable to find a line with text [Marina]");
        }

        private int GetLineWithTotalText(string[] linesOnPage)
        {         
            Regex regexExpression = new Regex("(t(o|0)t(a|4)(l|1|i))", RegexOptions.Compiled | RegexOptions.IgnoreCase);
            return GetLineWithText(linesOnPage, regexExpression) ??  throw new ArgumentException("Unable to find a line with text [Total]");
        }

        private int? GetLineWithText(string[] linesOnPage, Regex regexExpression)
        {            
            // Find the line that's most similar to Brighton Marina as our starting point. Marina is a unique word it'll do as our starting point
            for (int i = 0; i < linesOnPage.Length; i++)
            {
                if (regexExpression.IsMatch(linesOnPage[i])) 
                {
                    return i;
                }
            }

            return null;
        }

        private string GetProductNameFromLine(string productName) 
        {
            string productNameFound = "";

            Regex regexExpression = new Regex("[A-Z][^\n]|([^0-9][0-9] )", RegexOptions.Compiled | RegexOptions.IgnoreCase);
            foreach(Match match in regexExpression.Matches(productName))
            {
                productNameFound += match.Value;
            }

            return productNameFound;
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