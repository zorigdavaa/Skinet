using System;
using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace InfraStructure.Data.Config
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.OwnsOne(o => o.ShipToAddress, a => a.WithOwner());

            // OrderStatus enum aas toon utga bish string bolgoj horwuuldeg horwuulegch
            var converter =
                new ValueConverter<OrderStatus, string>(v => v.ToString(),
                    v => (OrderStatus) Enum.Parse(typeof (OrderStatus), v));
            builder.Property(s => s.Status).HasConversion(converter);


            builder
                //Order ni olon OrderItemtai baina
                .HasMany(o => o.OrderItems)
                .WithOne()
                //Orderiig usrgasan tohioldol itemuug mun adil ustana
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
