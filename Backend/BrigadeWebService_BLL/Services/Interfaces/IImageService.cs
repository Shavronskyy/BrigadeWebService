using BrigadeWebService_BLL.Dto.Images;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Services.Interfaces
{
    public interface IImageService
    {
        Task RemoveImage(Image image, CancellationToken ct);
        Task CreateImage(ImageCreateDto image, CancellationToken ct);
    }
}
