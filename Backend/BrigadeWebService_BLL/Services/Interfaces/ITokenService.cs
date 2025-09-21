using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Services.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
