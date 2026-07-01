using System;
using AnimeTakusan.MAL.Application.DTOs.Common;

namespace AnimeTakusan.MAL.Application.Interfaces;

public interface IExceptionMapper
{
    bool CanHandle(Exception exception);
    ExceptionDetails MapException(Exception exception);
}
