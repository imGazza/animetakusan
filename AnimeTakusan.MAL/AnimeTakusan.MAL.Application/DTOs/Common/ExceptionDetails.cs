using System.Net;

namespace AnimeTakusan.MAL.Application.DTOs.Common;

public class ExceptionDetails
{
    public HttpStatusCode StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
}
