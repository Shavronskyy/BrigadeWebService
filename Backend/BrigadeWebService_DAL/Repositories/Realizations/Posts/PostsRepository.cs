using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Posts;
using BrigadeWebService_DAL.Repositories.Realizations.Base;

namespace BrigadeWebService_DAL.Repositories.Realizations.Posts;

public class PostsRepository : RepositoryBase<Post>, IPostsRepository
{
    public PostsRepository(AppDbContext dbContext) : base(dbContext)
    {
    }
}