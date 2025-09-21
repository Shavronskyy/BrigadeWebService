using BrigadeWebService_BLL.Dto.Base;

namespace BrigadeWebService_BLL.Dto.Vacancies
{
    public class VacancyUpdateModel : VacancyCreateModel, IUpdateModel
    {
        public int Id { get; set; }
    }
}
