using AutoMapper;
using BrigadeWebService_BLL.Dto.Images;
using BrigadeWebService_BLL.Services.Realizations.AWS;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Mapper.Resolvers
{
    public class ImageUrlResolver : IValueResolver<Image, ImageDto, string>
    {
        private readonly S3ImageService _s3;
        public ImageUrlResolver(S3ImageService s3) { _s3 = s3; }

        public string Resolve(Image src, ImageDto dest, string destMember, ResolutionContext context)
            => _s3.CreatePresignedGet(src.ObjectKey); // TTL з сервісу/конфіга
    }
}
