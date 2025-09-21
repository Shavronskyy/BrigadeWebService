using BrigadeWebService_DAL.Entities.Base;

namespace BrigadeWebService_DAL.Entities
{
    public class Vacancy : IBaseEntity
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime PostedDate { get; set; } = DateTime.UtcNow;
        public string ContactPhone { get; set; } = string.Empty;
        public IEnumerable<string>? Requirements { get; set; }
        public string Salary { get; set; } = string.Empty;
        public string EmploymentType { get; set; } = string.Empty;
        public string EducationLevel { get; set; } = string.Empty;
    }
}
