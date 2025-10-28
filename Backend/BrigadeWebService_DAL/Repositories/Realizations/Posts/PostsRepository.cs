using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Posts;
using BrigadeWebService_DAL.Repositories.Realizations.Base;
using Microsoft.EntityFrameworkCore;

namespace BrigadeWebService_DAL.Repositories.Realizations.Posts;

public class PostsRepository : RepositoryBase<Post>, IPostsRepository
{
    public readonly AppDbContext _db;
    public PostsRepository(AppDbContext dbContext) : base(dbContext)
    {
        _db = dbContext;
    }

    public async Task<IEnumerable<Post>> GetAllAsync(CancellationToken ct = default) =>
        await _db.Posts
            .Include(d => d.Images)
            .ToListAsync(ct);
    public Task<Post?> GetByIdAsync(int id, CancellationToken ct = default) =>
        _db.Posts
           .Include(d => d.Images)
           .FirstOrDefaultAsync(d => d.Id == id, ct);
}