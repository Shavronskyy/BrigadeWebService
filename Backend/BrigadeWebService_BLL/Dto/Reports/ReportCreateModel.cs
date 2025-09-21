using BrigadeWebService_BLL.Dto.Base;

namespace BrigadeWebService_BLL.Dto.Reports
{
    public class ReportCreateModel : ICreateModel
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int DonationId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
