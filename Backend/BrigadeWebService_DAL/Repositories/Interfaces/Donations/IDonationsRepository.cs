using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Base;

namespace BrigadeWebService_DAL.Repositories.Interfaces.Donations
{
    public interface IDonationsRepository : IRepositoryBase<Donation>
    {
        Task<IEnumerable<Donation>> GetAllWithImageAsync(CancellationToken ct = default);
        Task<Donation?> GetByIdWithImageAsync(int id, CancellationToken ct = default);
    }
}
