using BrigadeWebService_BLL.Dto.Images;

namespace BrigadeWebService_BLL.Dto.Reports
{
    public class ReportDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string Category { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public int DonationId { get; set; }

        public List<ImageDto> Images { get; set; } = new();
    }
}
