using API.DTO;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;
using Address = Core.Entities.Identity.Address;

namespace API.Helper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product,ProductToReturnDTO>()
                .ForMember(dest=>dest.ProductBrand,opt=>opt.MapFrom(src=>src.ProductBrand.Name))
                .ForMember(dest=>dest.ProductType,opt=>opt.MapFrom(src=>src.ProductType.Name))
                .ForMember(dest=>dest.PictureUrl,opt=>opt.MapFrom<ProductUrlResolver>());
            CreateMap<Address,AddressDto>().ReverseMap();
            CreateMap<CustomerBasketDto,CustomerBasket>();
            CreateMap<BasketItemDto,BasketItem>();
            CreateMap<AddressDto,Core.Entities.OrderAggregate.Address>();
            CreateMap<Order,OrderToReturnDto>()
                .ForMember(d=>d.DeliveryMethod, o=>o.MapFrom(s=>s.DeliveryMethod.ShortName))
                .ForMember(d=>d.ShippingPrice, o=>o.MapFrom(s=>s.DeliveryMethod.Price));

            CreateMap<OrderItem,OrderItemDto>()
                .ForMember(d=>d.ProductId, o=>o.MapFrom(s=>s.Id))
                .ForMember(d=>d.ProductName, o=>o.MapFrom(s=>s.ItemOrdered.ProductName))
                .ForMember(d=>d.ProductUrl, o=>o.MapFrom(s=>s.ItemOrdered.ProductUrl))
                .ForMember(d=>d.ProductUrl, o=>o.MapFrom<OrderItemUrlResolver>());
        }
    }
}