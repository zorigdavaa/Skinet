using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTO;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        public OrdersController(IOrderService orderService, IMapper mapper)
        {
            _mapper = mapper;
            _orderService = orderService;
        }
        [HttpPost]
        public async Task<ActionResult<OrderToReturnDto>> CreateOrder(OrderDto orderDto)
        {
            var email = HttpContext.User?.RetrieveEmailFromClaimsPrincipal();
            var address = _mapper.Map<AddressDto,Address>(orderDto.ShiptoAddress);
            var order = await _orderService.CreateOrderAsync(email,orderDto.DeliveryMethodId,orderDto.BasketId ,address);
            if (order == null) return BadRequest(new ApiResponse(400,"Problem with Creating Order or Reading Basket"));
            return Ok(_mapper.Map<Order,OrderToReturnDto>(order));
        }
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetUserOrder()
        {
            var email = HttpContext.User.RetrieveEmailFromClaimsPrincipal();
            var orders = await _orderService.GetOrdersForUserAsync(email);
            if (orders == null)
            {
                return NotFound(new ApiResponse(404,"Order Not Found"));
            }
            return Ok(_mapper.Map<IReadOnlyList<Order>,IReadOnlyList<OrderToReturnDto>>(orders));
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderbyId(int id)
        {
            var email = HttpContext.User.RetrieveEmailFromClaimsPrincipal();
            var order = await _orderService.GetOrderByIdAsync(id,email);
            if (order == null)
            {
                return NotFound(new ApiResponse(404,"Order Not Found"));
            }
            return Ok(_mapper.Map<Order,OrderToReturnDto>(order));
        }
        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<DeliveryMethod>> GetDeliveryMethods()
        {
            var deliveryMethods = await _orderService.GetDeliveryMethodsAsync();
            if (deliveryMethods == null)
            {
                return NotFound(new ApiResponse(404));
            }
            return Ok(deliveryMethods);
        }
    }
}