using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace InfraStructure.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {
        }
        public DbSet<Product> Products { get; set; }
    }
}