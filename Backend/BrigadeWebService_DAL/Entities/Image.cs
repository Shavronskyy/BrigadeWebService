namespace BrigadeWebService_DAL.Entities
{
    public enum ImageStatus { Pending = 0, Active = 1, Deleted = 2 }
    public class Image
    {
        public int Id { get; set; }
        public string ObjectKey { get; set; } = null!;
        public string? ContentType { get; set; }
        public long SizeBytes { get; set; }
        public string? ETag { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }
        public ImageStatus Status { get; set; } = ImageStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? ReportId { get; set; }
        public int? PostId { get; set; }
        public Report? Report { get; set; }
        public Donation? Donation { get; set; }
        public Post? Post { get; set; }
    }
}
