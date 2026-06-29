using System;

namespace AnimeTakusan.MAL.Application.Interfaces;

public interface IMessageHandler
{
    Task HandleMessageAsync(string message);
}
