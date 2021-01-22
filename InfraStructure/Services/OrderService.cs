using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace InfraStructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBasketRepository _basketRepo;
        private readonly IPaymentService _paymentService;

        public OrderService(
            IUnitOfWork unitOfWork,
            IBasketRepository basketRepo,
            IPaymentService paymentService
        )
        {
            _unitOfWork = unitOfWork;
            _basketRepo = basketRepo;
            _paymentService = paymentService;
        }

        public async Task<Order> CreateOrderAsync(
            string buyerEmail,
            int DeliveryMethodID,
            string BasketId,
            Address shippingAddress
        )
        {
            //get basket from basketRepo
            var basket = await _basketRepo.GetBasketAsync(BasketId);
            if (basket == null)
            {
                return null;
            }
            //get items from productRepo
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id,productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }
            //get DeliveryMethod from repo
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(DeliveryMethodID);
            //calc Subtotals
            var subtotals = items.Sum(x=> x.Price * x.Quantity);
            //to check see if an order already exists
            var spec = new OrderByPaymentIntentIdSpecification(basket.PaymentIntentId);
            var existingOrder = await _unitOfWork.Repository<Order>().GetEnitityWithSpec(spec);
            if (existingOrder != null)
            {
                _unitOfWork.Repository<Order>().Delete(existingOrder);
                await _paymentService.CreateOrUpdatePaymentIntent(basket.PaymentIntentId);
            }

            //create order
            var order = new Order(items,buyerEmail,shippingAddress, deliveryMethod, subtotals, basket.PaymentIntentId);
            //TODO: save to db
            _unitOfWork.Repository<Order>().Add(order);
            var result = await _unitOfWork.Complete();
            if (result <=0)
            {
                return null;
            }
            // //delete Basket since it is ordered
            // await _basketRepo.DeleteBasketAsync(BasketId);
            //return the order
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().GetAllListAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id,buyerEmail);
            var order = await _unitOfWork.Repository<Order>().GetEnitityWithSpec(spec);
            return order;
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            var order = await _unitOfWork.Repository<Order>().ListAsync(spec);
            return order;
        }
    }
}
