using BrigadeWebService_BLL.Dto.Base;
using BrigadeWebService_DAL.Entities;
using Microsoft.AspNetCore.Http;

namespace BrigadeWebService_BLL.Dto.Posts
{
    public class PostCreateModel : ICreateModel
    {
        public string Title { get; set; }
        public string ShortText { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<IFormFile> Images { get; set; } = new List<IFormFile>();
    }
}