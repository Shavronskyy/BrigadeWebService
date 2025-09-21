using AutoMapper;
using BrigadeWebService_BLL.Dto.Vacancies;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations.Base;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Vacancies;

namespace BrigadeWebService_BLL.Services.Realizations
{
    public class VacanciesService : BaseCrudService<Vacancy, VacancyCreateModel, VacancyUpdateModel>, IVacanciesService
    {
        private readonly IVacancyRepository _vacancyRepository;
        private readonly IMapper _mapper;

        public VacanciesService(IVacancyRepository vacancyRepository, IMapper mapper) : base(vacancyRepository, mapper)
        {
            _vacancyRepository = vacancyRepository;
            _mapper = mapper;
        }
    }
}
