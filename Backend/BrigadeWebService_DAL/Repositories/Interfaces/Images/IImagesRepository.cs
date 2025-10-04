using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_DAL.Repositories.Interfaces.Images
{
    public interface IImagesRepository
    {
        Task AddAsync(Image image, CancellationToken ct = default);
        Task SaveChangesAsync(CancellationToken ct = default);
        Task<Image?> GetByIdAsync(int id, CancellationToken ct = default);
        void Remove(Image image);
    }
}
