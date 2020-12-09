using System.Threading.Tasks;
using API.DTO;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseController
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IMapper _mapper;
        public BasketController(IBasketRepository basketRepository, IMapper mapper)
        {
            _mapper = mapper;
            _basketRepository = basketRepository;
        }
        [HttpGet()]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id)
        {
            var basket = await _basketRepository.GetBasketAsync(id);
            return Ok(basket ?? new CustomerBasket(id));
        }
        [HttpPost()]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket([FromBody]CustomerBasketDto basketdto)
        {
            var basket = _mapper.Map<CustomerBasketDto,CustomerBasket>(basketdto);
            var UpdateBasket = await _basketRepository.UpdateBasketAsync(basket);
            return Ok(UpdateBasket);
        }
        [HttpDelete()]
        public async Task<bool> DeleteBasket(string id)
        {
            return await _basketRepository.DeleteBasketAsync(id);
        }
    }
}