using AutoMapper;
using BrigadeWebService_BLL.Dto.Vacancies;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Mapper.Vacancies
{
    public class VacancyProfile : Profile
    {
        public VacancyProfile()
        {
            CreateMap<Vacancy, VacancyCreateModel>().ReverseMap();
        }
    }
}
