using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Base;

namespace BrigadeWebService_DAL.Repositories.Interfaces.Donations
{
    public interface IDonationsRepository : IRepositoryBase<Donation>
    {
        Task<IEnumerable<Donation>> GetAllAsync(CancellationToken ct = default);
        Task<Donation?> GetByIdAsync(int id, CancellationToken ct = default);
    }
}
