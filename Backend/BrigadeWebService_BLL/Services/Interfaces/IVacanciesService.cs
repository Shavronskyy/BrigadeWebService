using BrigadeWebService_BLL.Dto.Vacancies;
using BrigadeWebService_BLL.Services.Interfaces.Base;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Services.Interfaces
{
    public interface IVacanciesService : IBaseCrudService<Vacancy, VacancyCreateModel, VacancyUpdateModel>
    {
    }
}
