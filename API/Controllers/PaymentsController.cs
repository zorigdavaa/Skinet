using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Errors;
using System.IO;
using Stripe;
using Order = Core.Entities.OrderAggregate.Order;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class PaymentsController : BaseController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentsController> _logger;
        private const string WhSecret = "whsec_cAOrg0zJa2G5PEQzWT2uV7HK08C09rCa";


        public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger)
        {
            _logger = logger;
            _paymentService = paymentService;
        }
        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);
            if (basket == null) return BadRequest(new ApiResponse(400, "basket null"));
            return basket;
        }
        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebHooks()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], WhSecret);
            PaymentIntent intent;
            Order order;
            switch (stripeEvent.Type)
            {
                case Events.PaymentIntentSucceeded:
                    intent = stripeEvent.Data.Object as PaymentIntent;
                    _logger.LogInformation("Payment Succeeded: ", intent.Id);
                    order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);
                    _logger.LogInformation("Order's status updated to payment-success", order.Id);
                    //Todo Update the order with new status
                    break;
                case Events.PaymentIntentPaymentFailed:
                    intent = stripeEvent.Data.Object as PaymentIntent;
                    _logger.LogInformation("Payment Failed: ", intent.Id);
                    order = await _paymentService.UpdateOrderPaymentFailed(intent.Id);
                    _logger.LogInformation("Order's status updated to payment-failed", order.Id);
                    //Todo Update the order with new status
                    break;

            }
            return new EmptyResult();
        }
    }
}