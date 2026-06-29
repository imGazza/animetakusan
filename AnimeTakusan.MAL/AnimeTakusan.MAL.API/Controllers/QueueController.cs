using AnimeTakusan.MAL.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AnimeTakusan.MAL.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class QueueController : ControllerBase
    {
        private readonly IMessagePublisher _messagePublisher;

        public QueueController(IMessagePublisher messagePublisher)
        {
            _messagePublisher = messagePublisher;
        }

        [HttpPost("send-hello-world")]
        public async Task<IActionResult> SendHelloWorldMessage(CancellationToken cancellationToken)
        {
            await _messagePublisher.PublishAsync(new { Message = "Mal Auth Event" }, cancellationToken: cancellationToken);
            return Ok();
        }
    }
}
