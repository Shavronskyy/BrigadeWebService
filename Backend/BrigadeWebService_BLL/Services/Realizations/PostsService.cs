using AutoMapper;
using BrigadeWebService_BLL.Dto.Posts;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations.Base;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Base;

namespace BrigadeWebService_BLL.Services.Realizations;

public class PostsService : BaseCrudService<Post, PostCreateModel, PostUpdateModel>, IPostsService
{
    public PostsService(IRepositoryBase<Post> repository, IMapper mapper) : base(repository, mapper)
    {
    }
}