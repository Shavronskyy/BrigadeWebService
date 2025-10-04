using AutoMapper;
using BrigadeWebService_BLL.Dto.Images;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations.AWS;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Images;

namespace BrigadeWebService_BLL.Services.Realizations
{
    public class ImageService : IImageService
    {
        private IImagesRepository _imagesRepository;
        private readonly S3ImageService _s3Service;
        private IMapper _mapper;

        public ImageService(IImagesRepository imagesRepository, S3ImageService s3Service, IMapper mapper)
        {
            _imagesRepository = imagesRepository;
            _s3Service = s3Service;
            _mapper = mapper;
        }

        public async Task RemoveImage(Image image, CancellationToken ct)
        {
            if(image == null) throw new InvalidOperationException($"Image for removing can not be null");
            await _s3Service.DeleteImageAsync(image.ObjectKey, ct);
            _imagesRepository.Remove(image);
            await _imagesRepository.SaveChangesAsync(ct);
        }

        public async Task CreateImage(ImageCreateDto image, CancellationToken ct)
        {
            var img = _mapper.Map<Image>(image);

            await _imagesRepository.AddAsync(img, ct);
            await _imagesRepository.SaveChangesAsync(ct);
        }
    }
}
