using AutoMapper;
using BrigadeWebService_BLL.Dto.Donations;
using BrigadeWebService_BLL.Services.Realizations.AWS;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Mapper.Resolvers
{
    public class DonationImageUrlResolver : IValueResolver<Donation, DonationDto, string?>
    {
        private readonly S3ImageService _s3;
        public DonationImageUrlResolver(S3ImageService s3) { _s3 = s3; }

        public string? Resolve(Donation src, DonationDto dest, string? destMember, ResolutionContext context)
            => src.Image?.ObjectKey is string key ? _s3.CreatePresignedGet(key) : null;
    }
}
