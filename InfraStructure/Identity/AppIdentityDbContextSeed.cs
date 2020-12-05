using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace InfraStructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task
        SeedUserAsync(
            UserManager<AppUser> userManager,
            ILoggerFactory loggerFactoru
        )
        {
            try
            {
                if (!userManager.Users.Any())
                {
                    var user =
                        new AppUser {
                            DisplayName = "Bob",
                            Email = "bob@test.com",
                            UserName = "bob@test.com",
                            Address =
                                new Address {
                                    FirstName = "Bob",
                                    LastName = "Bobbidee",
                                    Street = "29th Street",
                                    State = "NY",
                                    City = "New York",
                                    ZipCode = "18000"
                                }
                        };
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }
            catch (System.Exception e)
            {
                var logger =
                    loggerFactoru.CreateLogger<AppIdentityDbContextSeed>();
                logger.LogError(e.Message);
            }
        }
    }
}
