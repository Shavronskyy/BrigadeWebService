using BrigadeWebService_DAL.Entities.Base;

namespace BrigadeWebService_DAL.Entities;

public class Post : IBaseEntity
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string ShortText { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<Image> Images { get; set; } = new List<Image>();
}