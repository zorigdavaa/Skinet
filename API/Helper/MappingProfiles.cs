using API.DTO;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;

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
        }
    }
}