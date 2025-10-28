using BrigadeWebService_BLL.Dto.Donations;
using BrigadeWebService_BLL.Dto.Posts;
using BrigadeWebService_BLL.Services.Interfaces.Base;
using BrigadeWebService_DAL.Entities;
using Microsoft.AspNetCore.Http;

namespace BrigadeWebService_BLL.Services.Interfaces;

public interface IPostsService : IBaseCrudService<Post, PostCreateModel, PostUpdateModel>
{
    Task<int> CreateAsync(PostCreateModel model, IEnumerable<IFormFile> photos, CancellationToken ct);
    Task<IEnumerable<PostDto>> GetAllDtoAsync(CancellationToken ct);
    Task<PostDto?> GetByIdDtoAsync(int id, CancellationToken ct = default);
}