namespace NetCore
{
    using System;
    using Newtonsoft.Json;
    
    public class StockItem 
    {
        [JsonProperty(PropertyName="id")]
        public string Id { get; set; }
        
        [JsonProperty(PropertyName="productName")]
        public string ProductName { get; set; }

        [JsonProperty(PropertyName="quantity")]
        public decimal Quantity { get; set; }

        [JsonProperty(PropertyName="unit")]
        public string Unit { get; set; }

        [JsonProperty(PropertyName="purchasedDT")]
        public DateTime PurchasedDT { get; set; }
        
        [JsonProperty(PropertyName="purchasedDTPretty")]
        public string PurchasedDTPretty => PurchasedDT.ToShortDateString();

        [JsonProperty(PropertyName="purchasedDTFormatted")]
        public string PurchasedDTFormatted => PurchasedDT.ToString("yyyy-MM-dd");
    }
}