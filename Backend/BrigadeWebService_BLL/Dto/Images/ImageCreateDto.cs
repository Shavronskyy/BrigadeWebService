using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Dto.Images
{
    public class ImageCreateDto
    {
        public string ObjectKey { get; set; } = null!;
        public string? ContentType { get; set; }
        public long SizeBytes { get; set; }
        public string? ETag { get; set; }
        public ImageStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? ReportId { get; set; }
        public Report? Report { get; set; }
        public Donation? Donation { get; set; }
    }
}
