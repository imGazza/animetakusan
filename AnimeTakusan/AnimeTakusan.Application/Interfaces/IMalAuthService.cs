using System;

namespace AnimeTakusan.Application.Interfaces;

public interface IMalAuthService
{
    string GeneratePKCECodeVerifier();
    Task<string> GenerateStateParameterAsync();    
}
