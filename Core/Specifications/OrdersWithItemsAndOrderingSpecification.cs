using System;
using System.Linq.Expressions;
using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class OrdersWithItemsAndOrderingSpecification : BaseSpecification<Order>
    {
        public OrdersWithItemsAndOrderingSpecification(string buyerEmail):base(x=>x.BuyerEmail==buyerEmail)
        {
            AddInclude(o=>o.DeliveryMethod);
            AddInclude(o=>o.OrderItems);
            AddOrderByDescending(o=>o.OrderDate);
        }

        public OrdersWithItemsAndOrderingSpecification(int id, string email) : base(o => o.Id == id && o.BuyerEmail == email)
        {
            AddInclude(o=>o.DeliveryMethod);
            AddInclude(o=>o.OrderItems);
        }
    }
}