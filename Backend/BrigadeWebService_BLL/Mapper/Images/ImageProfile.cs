using AutoMapper;
using BrigadeWebService_BLL.Dto.Images;
using BrigadeWebService_BLL.Mapper.Resolvers;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Mapper.Images
{
    public class ImageProfile : Profile
    {
        public ImageProfile()
        {
            CreateMap<Image, ImageDto>()
            .ForMember(d => d.Url, o => o.MapFrom<ImageUrlResolver>()).ReverseMap();
            CreateMap<ImageCreateDto, Image>().ReverseMap();
        }
    }
}
