using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Base;

namespace BrigadeWebService_DAL.Repositories.Interfaces.Posts;

public interface IPostsRepository : IRepositoryBase<Post>
{
    Task<IEnumerable<Post>> GetAllAsync(CancellationToken ct = default);
    Task<Post?> GetByIdAsync(int id, CancellationToken ct = default);
}