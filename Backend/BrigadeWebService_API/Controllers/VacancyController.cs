using BrigadeWebService_API.Controllers.Base;
using BrigadeWebService_BLL.Dto.Vacancies;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BrigadeWebService_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VacancyController : BaseCRUDController<Vacancy, VacancyCreateModel, VacancyUpdateModel>
    {
        private IVacanciesService _vacancyService;

        public VacancyController(IVacanciesService vacancyService) : base(vacancyService)
        {
            _vacancyService = vacancyService;
        }
    }
}
