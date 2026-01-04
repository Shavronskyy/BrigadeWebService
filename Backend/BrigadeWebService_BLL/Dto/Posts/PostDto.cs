using BrigadeWebService_BLL.Dto.Images;

namespace BrigadeWebService_BLL.Dto.Posts;

public class PostDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string ShortText { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<ImageDto> Images { get; set; } = new List<ImageDto>();
}