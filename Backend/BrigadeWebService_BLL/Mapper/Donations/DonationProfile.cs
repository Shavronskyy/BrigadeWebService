using AutoMapper;
using BrigadeWebService_BLL.Dto.Donations;
using BrigadeWebService_BLL.Mapper.Resolvers;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Mapper.Vacancies
{
    public class DonationProfile : Profile
    {
        public DonationProfile()
        {
            CreateMap<Donation, DonationCreateModel>().ReverseMap();
            CreateMap<Donation, DonationDto>()
            .ForMember(d => d.ImageUrl, o => o.MapFrom<DonationImageUrlResolver>());
        }
    }
}
