using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Vacancies;
using BrigadeWebService_DAL.Repositories.Realizations.Base;

namespace BrigadeWebService_DAL.Repositories.Realizations.Vacancies
{
    public class VacancyRepository : RepositoryBase<Vacancy>, IVacancyRepository
    {
        public VacancyRepository(AppDbContext dbContext) : base(dbContext)
        {
        }
    }
}
