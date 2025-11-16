using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using AnimeTakusan.Data.Model;
using System.Runtime.CompilerServices;
using AnimeTakusan.Data.Contexts;

namespace AnimeTakusan.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("Public")]
    public class PublicController : ControllerBase
    {
        private readonly BaseContext _context;

        public PublicController(BaseContext context)
        {
            _context = context;
        }

        // GET: api/public/message
        [HttpGet("message")]
        public IActionResult GetMessage()
        {
            return Ok("Hello from Public API!");
        }

        [HttpGet("create/gazza")]
        public IActionResult CreateGazza()
        {
            var gazza = new User
            {
                Id = Guid.NewGuid(),
                Username = "gazza",
                FirstName = "Luca",
                LastName = "Gazzardi",
                Email = "gazzardi.luca@gmail.com",
                ProfilePicture = ""
            };

            _context.Users.Add(gazza);
            _context.SaveChanges();
            return Ok("Hello from Public API!");
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            var users = new List<string>();
            foreach (var user in _context.Users)
            {
                users.Add(user.Username);
            }
            return Ok(users);
        }
    }
}
