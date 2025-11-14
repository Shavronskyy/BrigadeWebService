using BrigadeWebService_API.Controllers.Base;
using BrigadeWebService_BLL.Dto.Donations;
using BrigadeWebService_BLL.Dto.Posts;
using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Interfaces.Base;
using BrigadeWebService_BLL.Services.Realizations;
using BrigadeWebService_DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BrigadeWebService_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : BaseCRUDController<Post, PostCreateModel, PostUpdateModel>
    {
        private IPostsService _postService;
        public PostsController(IPostsService service) : base(service)
        {
            _postService = service;
        }

        [HttpGet("getAllDto")]
        public async Task<ActionResult<IEnumerable<PostDto>>> GetAllAsync(CancellationToken ct)
        {
            var list = await _postService.GetAllDtoAsync(ct);
            return (list?.Any() ?? null) != null ? Ok(list) : NotFound();
        }

        [HttpPost("create")]
        [Consumes("multipart/form-data")]
        public override async Task<IActionResult> Create([FromForm] PostCreateModel model, CancellationToken ct)
        {
            if (!ModelState.IsValid || model == null)
                return BadRequest(ModelState);

            var reportId = await _postService.CreateAsync(model, model.Photos, ct);

            return reportId > 0 ? Created() : BadRequest();
        }
    }
}