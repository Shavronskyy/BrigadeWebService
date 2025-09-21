using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Base;

namespace BrigadeWebService_DAL.Repositories.Interfaces.Reports
{
    public interface IReportRepository : IRepositoryBase<Report>
    {
        Task<IEnumerable<Report>> GetReportsByDonationIdAsync(int donationId);
        Task<IEnumerable<Report>> GetAllWithImagesAsync(CancellationToken ct = default);
    }
}
