using BrigadeWebService_API.Controllers.Base;
using BrigadeWebService_BLL.Dto.Posts;
using BrigadeWebService_BLL.Services.Interfaces.Base;
using BrigadeWebService_DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BrigadeWebService_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : BaseCRUDController<Post, PostCreateModel, PostUpdateModel>
    {
        public PostsController(IBaseCrudService<Post, PostCreateModel, PostUpdateModel> service) : base(service)
        {
        }
    }
}