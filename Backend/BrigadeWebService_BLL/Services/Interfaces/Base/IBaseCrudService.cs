using BrigadeWebService_BLL.Dto.Base;
using BrigadeWebService_DAL.Entities.Base;

namespace BrigadeWebService_BLL.Services.Interfaces.Base
{
    public interface IBaseCrudService<TEntity, TCreateModel, TUpdateModel> 
        where TEntity : IBaseEntity
        where TCreateModel : ICreateModel
        where TUpdateModel : IUpdateModel
    {
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task<TEntity?> GetByIdAsync(int id);
        Task<TEntity?> CreateAsync(TCreateModel model);
        Task<TEntity?> UpdateAsync(TUpdateModel model);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}
