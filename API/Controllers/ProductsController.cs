using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTO;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using InfraStructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Errors;
using API.Helper;

namespace API.Controllers
{
    [Cached(600)]
    public class ProductsController : BaseController
    {
        private readonly IGenericRepository<Product> _productRepo;
        
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IMapper _mapper;

        public ProductsController(IGenericRepository<Product> productRepo,
                                  IGenericRepository<ProductBrand> productBrandRepo,
                                  IGenericRepository<ProductType> productTypeRepo,
                                  IMapper mapper )
        {
            _productTypeRepo = productTypeRepo;
            _mapper = mapper;
            _productBrandRepo = productBrandRepo;
            _productRepo = productRepo;
        }

        [HttpGet()]
        public async Task<ActionResult<Pagination<ProductToReturnDTO>>> GetProducts([FromQuery] ProductSpecParams productParams)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(productParams);
            var countSpec= new ProductWithFiltersForCountSpecification(productParams);
            var totalItem=await _productRepo.CountAsync(countSpec);
            var products = await _productRepo.ListAsync(spec);
            var data=_mapper.Map<IReadOnlyList<Product>,IReadOnlyList<ProductToReturnDTO>>(products);
            return Ok(new Pagination<ProductToReturnDTO>(productParams.PageIndex,productParams.PageSize,totalItem,data));
        }
        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(ApiResponse),404)]
        public async Task<ActionResult<ProductToReturnDTO>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            var product = await _productRepo.GetEnitityWithSpec(spec);
            if (product==null)
            {
                return NotFound(new ApiResponse(404));
            }
            return _mapper.Map<Product,ProductToReturnDTO>(product);
        }
        [HttpGet("brands")]
        public async Task<ActionResult<List<ProductBrand>>> GetBrands()
        {
            var brands = await _productBrandRepo.GetAllListAsync();
            return Ok(brands);
        }
        [HttpGet("types")]
        public async Task<ActionResult<List<ProductType>>> GetTypes()
        {
            var Types = await _productTypeRepo.GetAllListAsync();
            return Ok(Types);
        }
    }
}