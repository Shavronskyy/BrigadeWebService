using BrigadeWebService_BLL.Dto.Base;

namespace BrigadeWebService_BLL.Dto.Donations
{
    public class DonationUpdateModel : DonationCreateModel, IUpdateModel
    {
        public int Id { get; set; }
        public bool IsCompleted { get; set; }
    }
}
