using BrigadeWebService_BLL.Dto.Base;

namespace BrigadeWebService_BLL.Dto.Posts;

public class PostUpdateModel : IUpdateModel
{
    public int Id { get; set; }
    public string Title { get; set; }
}