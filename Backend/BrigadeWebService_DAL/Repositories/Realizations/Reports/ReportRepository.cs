using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Reports;
using BrigadeWebService_DAL.Repositories.Realizations.Base;
using Microsoft.EntityFrameworkCore;

namespace BrigadeWebService_DAL.Repositories.Realizations.Vacancies
{
    public class ReportRepository : RepositoryBase<Report>, IReportRepository
    {
        private AppDbContext _db;
        public ReportRepository(AppDbContext dbContext) : base(dbContext)
        {
            _db = dbContext;
        }

        public async Task<IEnumerable<Report>> GetReportsByDonationIdAsync(int donationId)
        {
            return await _db.Reports.AsNoTracking()
            .Where(r => r.DonationId == donationId)
            .Include(r => r.Images)
            .ToListAsync();
        }

        public async Task<IEnumerable<Report>> GetAllWithImagesAsync(CancellationToken ct = default) =>
        await _db.Reports
            .AsNoTracking()
            .Include(r => r.Images)
            .ToListAsync(ct);
    }
}
