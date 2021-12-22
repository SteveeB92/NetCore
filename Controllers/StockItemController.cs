namespace NetCore
{
    using ImageMagick;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;
    using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using System.Threading;
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
        public async Task<IEnumerable<StockItem>> UploadReceiptAsync([FromForm] IFormFile input1)
        {
            List<StockItem> stockItems = new List<StockItem>();

            string endpoint = System.Environment.GetEnvironmentVariable("AZURE_COMPUTERVISION_ENDPOINT", EnvironmentVariableTarget.Process);
            string apiKey = System.Environment.GetEnvironmentVariable("AZURE_COMPUTERVISION_MASTER_KEY", EnvironmentVariableTarget.Process);
            ComputerVisionClient client = Authenticate(endpoint, apiKey);
            
            ReadInStreamHeaders textHeaders;

            using (Stream fileStream = input1.OpenReadStream())
            using (MagickImage image = new MagickImage(fileStream))
            {
                image.Quality = 50;

                using (Stream stream = new MemoryStream())
                {
                    image.Write(stream);
                    stream.Position = 0;

                    try 
                    {
                        textHeaders = await client.ReadInStreamAsync(stream);
                    }
                    catch (ComputerVisionOcrErrorException e)
                    {
                        Console.WriteLine(e.Response.Content);
                        throw;
                    }
                }
            }

            string operationLocation = textHeaders.OperationLocation;

            const int numberOfCharsInOperationId = 36;
            string operationId = operationLocation.Substring(operationLocation.Length - numberOfCharsInOperationId);

            ReadOperationResult results;
            do
            {
                results = await client.GetReadResultAsync(Guid.Parse(operationId));
            }
            while ((results.Status == OperationStatusCodes.Running || results.Status == OperationStatusCodes.NotStarted));

            IList<ReadResult> textFileResults = results.AnalyzeResult.ReadResults;
            foreach (ReadResult page in textFileResults)
            {
                // Between the Marina word and the Total work we have what was actually purchased
                for (int i = GetLineWithMarinaText(page.Lines) + 1; i < GetLineWithTotalText(page.Lines); i++)
                {
                    string productName = GetProductNameFromLine(page.Lines[i].Text);

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
            
            return stockItems;
        }

        public static ComputerVisionClient Authenticate(string endpoint, string key)
        {
            return new ComputerVisionClient(new ApiKeyServiceClientCredentials(key)) { Endpoint = endpoint };
        }

        private byte[] GetByteArrayFromStream(Stream stream)
        {
            using (MemoryStream memoryStream = new MemoryStream())
            {
                stream.CopyTo(memoryStream);
                return memoryStream.ToArray();
            }
        }

        private int GetLineWithMarinaText(IList<Line> linesOnPage)
        {         
            // Find the line that's most similar to Brighton Marina as our starting point. Marina is a unique word it'll do as our starting point
            Regex regexExpression = new Regex("((m|n)(a|4)r(i|1|l)(n|m)(a|4))", RegexOptions.Compiled | RegexOptions.IgnoreCase);
            return GetLineWithText(linesOnPage, regexExpression) ??  throw new ArgumentException("Unable to find a line with text [Marina]");
        }

        private int GetLineWithTotalText(IList<Line> linesOnPage)
        {         
            Regex regexExpression = new Regex("(t(o|0)t(a|4)(l|1|i))", RegexOptions.Compiled | RegexOptions.IgnoreCase);
            return GetLineWithText(linesOnPage, regexExpression) ??  throw new ArgumentException("Unable to find a line with text [Total]");
        }

        private int? GetLineWithText(IList<Line> linesOnPage, Regex regexExpression)
        {            
            for (int i = 0; i < linesOnPage.Count; i++)
            {
                if (regexExpression.IsMatch(linesOnPage[i].Text)) 
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