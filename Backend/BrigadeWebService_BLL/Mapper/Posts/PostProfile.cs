using AutoMapper;
using BrigadeWebService_BLL.Dto.Posts;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Mapper.Posts
{
    public class PostProfile : Profile
    {
        public PostProfile()
        {
            CreateMap<Post, PostCreateModel>().ReverseMap();
            CreateMap<Post, PostDto>()
            .ForMember(d => d.Images, o => o.MapFrom(s => s.Images));
        }
    }
}
