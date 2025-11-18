using System;
using System.Runtime.CompilerServices;
using AnimeTakusan.Data.Contexts;

namespace AnimeTakusan.Core.Authentication;

public class AuthService
{
    private readonly BaseContext _context;

    public AuthService(BaseContext context)
    {
        _context = context;
    }

    public void SomeAuthMethod()
    {
        // Authentication logic goes here
    }
}
