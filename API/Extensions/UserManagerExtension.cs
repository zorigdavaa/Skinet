using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class UserManagerExtension
    {
        public static async Task<AppUser> FindByClaimsWihAddressAsync(this UserManager<AppUser> usermanager, ClaimsPrincipal user)
        {
            var email = user?.Claims?.FirstOrDefault(x=>x.Type == ClaimTypes.Email)?.Value;
            return await usermanager.Users.Include(x=> x.Address).SingleOrDefaultAsync(x=>x.Email == email);

        }
        public static async Task<AppUser> FindByClaimsAsync(this UserManager<AppUser> usermanager, ClaimsPrincipal user)
        {
            var email = user?.Claims?.FirstOrDefault(x=>x.Type == ClaimTypes.Email)?.Value;
            return await usermanager.Users.SingleOrDefaultAsync(x=>x.Email == email);
        }
    }
}