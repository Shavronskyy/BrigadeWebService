using BrigadeWebService_DAL.Entities.Base;
using System.ComponentModel.DataAnnotations;

namespace BrigadeWebService_DAL.Entities
{
    public class Donation : IBaseEntity
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public long Goal { get; set; }
        public DateTime CreationDate { get; set; }
        public string DonationLink { get; set; }
        public bool IsCompleted { get; set; } = false;
        public ICollection<Report> Reports { get; set; } = new List<Report>();
        public int? ImageId { get; set; }
        public Image? Image { get; set; }
    }
}
