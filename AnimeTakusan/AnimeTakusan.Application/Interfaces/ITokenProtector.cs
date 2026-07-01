namespace AnimeTakusan.Application.Interfaces;

public interface ITokenProtector
{
    string Protect(string token);
    string Unprotect(string protectedToken);
}
