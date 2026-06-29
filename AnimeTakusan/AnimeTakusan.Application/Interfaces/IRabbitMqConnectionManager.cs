using RabbitMQ.Client;

namespace AnimeTakusan.Application.Interfaces;

public interface IRabbitMqConnectionManager
{
    Task<IConnection> GetConnectionAsync(CancellationToken cancellationToken);
}
