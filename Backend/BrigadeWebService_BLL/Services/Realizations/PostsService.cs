using AutoMapper;
using BrigadeWebService_BLL.Dto.Images;
using BrigadeWebService_BLL.Dto.Posts;
using BrigadeWebService_BLL.Enums;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations.AWS;
using BrigadeWebService_BLL.Services.Realizations.Base;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Posts;
using Microsoft.AspNetCore.Http;

namespace BrigadeWebService_BLL.Services.Realizations;

public class PostsService : BaseCrudService<Post, PostCreateModel, PostUpdateModel>, IPostsService
{
    private IPostsRepository _postRepository;
    private IMapper _mapper;
    private IImageService _imageService;
    private S3ImageService _s3;
    public PostsService(IPostsRepository postRepository, IMapper mapper, S3ImageService s3, IImageService imageService) : base(postRepository, mapper)
    {
        _postRepository = postRepository;
        _mapper = mapper;
        _s3 = s3;
        _imageService = imageService;
    }

    public async Task<IEnumerable<PostDto>> GetAllDtoAsync(CancellationToken ct = default)
    {
        var posts = await _postRepository.GetAllAsync(ct);
        return _mapper.Map<IEnumerable<PostDto>>(posts);
    }

    public async Task<PostDto?> GetByIdDtoAsync(int id, CancellationToken ct = default)
    {
        var posts = await _postRepository.GetByIdAsync(id, ct);
        return posts is null ? null : _mapper.Map<PostDto>(posts);
    }

    public async Task<int> CreateAsync(PostCreateModel model, IEnumerable<IFormFile> photos, CancellationToken ct)
    {
        var created = await CreateAsync(model);
        if (created == null) throw new InvalidOperationException("Failed to create post");

        var result = new List<(int, string)>();
        foreach (var f in photos ?? Enumerable.Empty<IFormFile>())
        {
            var (key, etag) = await _s3.UploadImagesAsync(created.Id, f, Content.Posts, ct);
            var img = new ImageCreateDto
            {
                PostId = created.Id,
                ObjectKey = key,
                ContentType = f.ContentType,
                SizeBytes = f.Length,
                ETag = etag?.Trim('"'),
                Status = ImageStatus.Active,
                CreatedAt = DateTime.UtcNow
            };
            await _imageService.CreateImage(img, ct);
        }
        return created.Id;
    }
}