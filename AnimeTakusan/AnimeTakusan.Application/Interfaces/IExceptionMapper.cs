using System;
using AnimeTakusan.Application.DTOs.Common.Responses;

namespace AnimeTakusan.Application.Interfaces;

public interface IExceptionMapper
{
    bool CanHandle(Exception exception);
    ExceptionDetails MapException(Exception exception);
}
