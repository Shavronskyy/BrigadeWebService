using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Images;

namespace BrigadeWebService_DAL.Repositories.Realizations.Images
{
    public class ImagesRepository : IImagesRepository
    {
        private readonly AppDbContext _db;
        public ImagesRepository(AppDbContext db) { _db = db; }
        public Task SaveAsync(CancellationToken ct = default) => _db.SaveChangesAsync(ct);
        public async Task AddAsync(Image image, CancellationToken ct = default) => await _db.Images.AddAsync(image, ct);
    }
}
