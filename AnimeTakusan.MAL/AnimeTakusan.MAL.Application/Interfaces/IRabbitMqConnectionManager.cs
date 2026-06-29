using RabbitMQ.Client;

namespace AnimeTakusan.MAL.Application.Interfaces;

public interface IRabbitMqConnectionManager
{
    Task<IConnection> GetConnectionAsync(CancellationToken cancellationToken);
}
