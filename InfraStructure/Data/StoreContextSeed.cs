using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Logging;

namespace InfraStructure.Data
{
    public class StoreContextSeed
    {
        public StoreContextSeed()
        {
        }

        public static async Task
        SeedAsync(StoreContext context, ILoggerFactory loggerFactory)
        {
            try
            {
                if (!context.ProductBrands.Any())
                {
                    var brandsData =
                        File
                            .ReadAllText("../InfraStructure/Data/SeedData/brands.json");
                    var brands =
                        JsonSerializer
                            .Deserialize<List<ProductBrand>>(brandsData);
                    foreach (var brand in brands)
                    {
                        context.ProductBrands.Add (brand);
                    }
                    await context.SaveChangesAsync();
                }
                if (!context.ProductTypes.Any())
                {
                    var TypesData =
                        File
                            .ReadAllText("../InfraStructure/Data/SeedData/types.json");
                    var Types =
                        JsonSerializer
                            .Deserialize<List<ProductType>>(TypesData);
                    foreach (var type in Types)
                    {
                        context.ProductTypes.Add (type);
                    }
                    await context.SaveChangesAsync();
                }
                if (!context.Products.Any())
                {
                    var ProductData =
                        File
                            .ReadAllText("../InfraStructure/Data/SeedData/products.json");
                    var Products =
                        JsonSerializer.Deserialize<List<Product>>(ProductData);
                    foreach (var product in Products)
                    {
                        context.Products.Add (product);
                    }
                    await context.SaveChangesAsync();
                }
                if (!context.DeliveryMethods.Any())
                {
                    var dmData =
                        File
                            .ReadAllText("../InfraStructure/Data/SeedData/delivery.json");
                    var dmMethods =
                        JsonSerializer.Deserialize<List<DeliveryMethod>>(dmData);
                    foreach (var data in dmMethods)
                    {
                        context.DeliveryMethods.Add (data);
                    }
                    await context.SaveChangesAsync();
                }
            }
            catch (System.Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContext>();
                logger.LogError(ex.Message);
            }
        }
    }
}
