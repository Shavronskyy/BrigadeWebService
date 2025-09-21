using BrigadeWebService_DAL.Entities.Base;
using System.ComponentModel.DataAnnotations;

namespace BrigadeWebService_DAL.Entities
{
    public class User : IBaseEntity
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Role { get; set; } = "User";
    }
}
