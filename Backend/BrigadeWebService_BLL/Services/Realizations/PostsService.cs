using AutoMapper;
using BrigadeWebService_BLL.Dto.Posts;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations.Base;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Posts;

namespace BrigadeWebService_BLL.Services.Realizations;

public class PostsService : BaseCrudService<Post, PostCreateModel, PostUpdateModel>, IPostsService
{
    private IPostsRepository _postRepository;
    private IMapper _mapper;
    public PostsService(IPostsRepository postRepository, IMapper mapper) : base(postRepository, mapper)
    {
        _postRepository = postRepository;
        _mapper = mapper;
    }
}