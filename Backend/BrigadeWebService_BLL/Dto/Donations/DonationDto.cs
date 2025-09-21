using BrigadeWebService_BLL.Dto.Reports;

namespace BrigadeWebService_BLL.Dto.Donations
{
    public class DonationDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public long Goal { get; set; }
        public DateTime CreationDate { get; set; }
        public string DonationLink { get; set; } = "";
        public bool IsCompleted { get; set; }

        public int? ImageId { get; set; }
        public string? ImageUrl { get; set; } 
    }
}
