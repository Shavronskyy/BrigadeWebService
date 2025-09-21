using BrigadeWebService_BLL.Dto.Base;

namespace BrigadeWebService_BLL.Dto.Donations
{
    public class DonationCreateModel : ICreateModel
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public long Goal { get; set; }
        public DateTime CreationDate { get; set; }
        public string DonationLink { get; set; }
    }
}
