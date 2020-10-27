using API.Errors;
using InfraStructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiExplorerSettings(IgnoreApi=true)]
    public class BuggyController : BaseController
    {
        private readonly StoreContext _context;
        public BuggyController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet("notFound")]
        public ActionResult GetNotFoundRequest()
        {
            var thing = _context.Products.Find(44);
            if (thing == null)
            {
                return NotFound(new ApiResponse(404,"Not Found"));
            }
            return Ok(thing);
        }
        [HttpGet("servererror")]
        public ActionResult GetServerError()
        {
            var thing = _context.Products.Find(44);
            var thingToReturn = thing.ToString();


            return Ok(thingToReturn);
        }
        [HttpGet("maths")]
        public ActionResult GetDividedByZero()
        {
            int i=5;
            int t=0;
            return Ok(i/t);
        }
        [HttpGet("badrequest")]
        public ActionResult GetBadRequest()
        {
            return BadRequest(new ApiResponse(400));
        }
        [HttpGet("badrequest/{id}")]
        public ActionResult GetBadRequest(int id)
        {
            return BadRequest();
        }
    }
}