using System.Linq;
using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string RetrieveEmailFromClaimsPrincipal(this ClaimsPrincipal user)
        {
            return user?.Claims?.FirstOrDefault(x=>x.Type == ClaimTypes.Email)?.Value;
        }
    }
}