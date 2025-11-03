using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace AnimeTakusan.API.Controllers
{
 [ApiController]
 [Route("api/[controller]")]
 [EnableCors("Public")]
 public class PublicController : ControllerBase
 {
 // GET: api/public/message
 [HttpGet("message")]
 public IActionResult GetMessage()
 {
 return Ok("Hello from Public API!");
 }
 }
}
