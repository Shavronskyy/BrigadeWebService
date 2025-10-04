using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Donations;
using BrigadeWebService_DAL.Repositories.Realizations.Base;
using Microsoft.EntityFrameworkCore;

namespace BrigadeWebService_DAL.Repositories.Realizations.Donations
{
    public class DonationsRepository : RepositoryBase<Donation>, IDonationsRepository
    {
        private AppDbContext _db;
        public DonationsRepository(AppDbContext dbContext) : base(dbContext)
        {
            _db = dbContext;
        }

        public async Task<IEnumerable<Donation>> GetAllAsync(CancellationToken ct = default) =>
        await _db.Donations
            .AsNoTracking()
            .Include(d => d.Image)
            .ToListAsync(ct);
        public Task<Donation?> GetByIdAsync(int id, CancellationToken ct = default) =>
        _db.Donations
           .AsNoTracking()
           .Include(d => d.Image)
           .FirstOrDefaultAsync(d => d.Id == id, ct);
    }
}
