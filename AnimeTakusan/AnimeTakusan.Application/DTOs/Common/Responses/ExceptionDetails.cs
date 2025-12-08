using System.Net;

namespace AnimeTakusan.Application.DTOs.Common.Responses;

public record ExceptionDetails
{
    public HttpStatusCode StatusCode { get; init; }
    public string Message { get; init; } = string.Empty;
}
