using Cinema.DTO.DtoAccount;

namespace Cinema.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AccountDto account);
    }
}
