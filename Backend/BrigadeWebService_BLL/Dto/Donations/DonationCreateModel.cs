using BrigadeWebService_BLL.Dto.Base;
using Microsoft.AspNetCore.Http;

namespace BrigadeWebService_BLL.Dto.Donations
{
    public class DonationCreateModel : ICreateModel
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public long Goal { get; set; }
        public DateTime CreationAt { get; set; } = DateTime.UtcNow;
        public string DonationLink { get; set; }
        public IFormFile? Photo { get; set; }
    }
}
