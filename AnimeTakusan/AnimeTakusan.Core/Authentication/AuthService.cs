using System;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using AnimeTakusan.Data.Contexts;

namespace AnimeTakusan.Core.Authentication;

public interface IAuthService
{
    void AuthenticateWithGoogle(ClaimsPrincipal claimsPrincipal);
}

public class AuthService : IAuthService
{
    private readonly BaseContext _context;

    public AuthService(BaseContext context)
    {
        _context = context;
    }

    public void AuthenticateWithGoogle(ClaimsPrincipal claimsPrincipal)
    {
        // Recupera dati dal ClaimsPrincipal

        // Valida dati

        // Controlla se l'utente esiste già, se no lo crea a DB

        // Genera i tokens
    }
}
