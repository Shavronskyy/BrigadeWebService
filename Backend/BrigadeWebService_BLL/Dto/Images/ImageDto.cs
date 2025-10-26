namespace BrigadeWebService_BLL.Dto.Images
{
    public class ImageDto
    {
        public int Id { get; set; }
        public string Url { get; set; } = "";
        public int? Width { get; set; }
        public int? Height { get; set; }
    }
}
