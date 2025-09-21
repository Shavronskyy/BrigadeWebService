using BrigadeWebService_DAL.Entities.Base;
using System.ComponentModel.DataAnnotations;

namespace BrigadeWebService_DAL.Entities
{
    public class Report : IBaseEntity
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public int DonationId { get; set; }
        public Donation Donation { get; set; } = null!;
        public ICollection<Image> Images { get; set; } = new List<Image>();
    }
}
