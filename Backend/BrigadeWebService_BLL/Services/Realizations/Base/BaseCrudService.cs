using AutoMapper;
using BrigadeWebService_BLL.Dto.Base;
using BrigadeWebService_BLL.Services.Interfaces.Base;
using BrigadeWebService_DAL.Entities.Base;
using BrigadeWebService_DAL.Repositories.Interfaces.Base;

namespace BrigadeWebService_BLL.Services.Realizations.Base
{
    public class BaseCrudService<TEntity, TCreateModel, TUpdateModel>
    : IBaseCrudService<TEntity, TCreateModel, TUpdateModel>
    where TEntity : IBaseEntity
    where TCreateModel : ICreateModel
    where TUpdateModel : IUpdateModel
    {
        private readonly IRepositoryBase<TEntity> _repository;
        private readonly IMapper _mapper;

        public BaseCrudService(IRepositoryBase<TEntity> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public virtual async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<TEntity?> CreateAsync(TCreateModel model)
        {
            var entity = _mapper.Map<TEntity>(model);
            var vacancy = await _repository.CreateAsync(entity);
            if (vacancy != null)
            {
                await _repository.SaveChangesAsync();
                return vacancy;
            }
            throw new InvalidOperationException($"Exception with creating of object type of {model}");
        }

        public async Task<TEntity?> UpdateAsync(TUpdateModel model)
        {
            var vacancy = await _repository.GetByIdAsync(model.Id);
            if (vacancy == null)
            {
                throw new InvalidOperationException($"Вакансія {model.Title} не знайдена!");
            }
            _mapper.Map(model, vacancy);

            return await _repository.SaveChangesAsync() == 1 ? vacancy : throw new InvalidOperationException($"Exception with updating of object type of {model}"); ;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var vacancy = await _repository.GetByIdAsync(id);
            if (vacancy != null)
            {
                try
                {
                    _repository.Delete(vacancy);
                }
                catch (Exception)
                {
                    return false;
                }
                await _repository.SaveChangesAsync();
            }
            return true;
        }

        public async Task<TEntity?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }
    }
}
