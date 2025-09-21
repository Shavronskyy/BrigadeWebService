using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_DAL.Repositories.Interfaces.Images
{
    public interface IImagesRepository
    {
        Task AddAsync(Image image, CancellationToken ct = default);
        Task SaveAsync(CancellationToken ct = default);
    }
}
