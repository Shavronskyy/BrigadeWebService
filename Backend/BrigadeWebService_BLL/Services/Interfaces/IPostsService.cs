using BrigadeWebService_BLL.Dto.Posts;
using BrigadeWebService_BLL.Services.Interfaces.Base;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Services.Interfaces;

public interface IPostsService : IBaseCrudService<Post, PostCreateModel, PostUpdateModel>
{
    
}