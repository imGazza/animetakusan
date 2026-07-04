namespace AnimeTakusan.Application.Interfaces;

public interface IMessageHandler
{
    Task HandleMessageAsync(string message, string messageId);
}
