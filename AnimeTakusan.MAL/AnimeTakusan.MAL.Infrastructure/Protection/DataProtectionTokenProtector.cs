using AnimeTakusan.MAL.Application.Interfaces;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Configuration;

namespace AnimeTakusan.MAL.Infrastructure.Protection;

public class DataProtectionTokenProtector : ITokenProtector
{
    private readonly IDataProtectionProvider _dataProtectionProvider;
    private readonly IConfiguration _configuration;

    public DataProtectionTokenProtector(IDataProtectionProvider dataProtectionProvider, IConfiguration configuration)
    {
        _dataProtectionProvider = dataProtectionProvider;
        _configuration = configuration;
    }

    public string Protect(string token)
    {
        ValidatePurpose();

        var purpose = _configuration["Protector:Purpose"];
        var protector = _dataProtectionProvider.CreateProtector(purpose!);
        return protector.Protect(token);
    }

    public string Unprotect(string protectedToken)
    {
        ValidatePurpose();

        var purpose = _configuration["Protector:Purpose"];
        var protector = _dataProtectionProvider.CreateProtector(purpose!);
        return protector.Unprotect(protectedToken);
    }

    private void ValidatePurpose()
    {
        if (string.IsNullOrWhiteSpace(_configuration["Protector:Purpose"]))
        {
            throw new ArgumentException("Purpose cannot be null or empty.", nameof(_configuration));
        }
    }
}
