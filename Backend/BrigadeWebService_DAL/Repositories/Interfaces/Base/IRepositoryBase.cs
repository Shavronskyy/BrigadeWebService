using BrigadeWebService_DAL.Entities.Base;
using System.Linq.Expressions;

namespace BrigadeWebService_DAL.Repositories.Interfaces.Base
{
    public interface IRepositoryBase<T> where T : IBaseEntity
    {
        /// <summary>
        /// Returns all entities of type T from the database.
        /// </summary>
        /// <returns></returns>
        Task<IEnumerable<T>> GetAllAsync();
        /// <summary>
        /// Returns an entity of type T by its ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<T?> GetByIdAsync(int id);
        /// <summary>
        /// Get database entity by a specific condition.
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        Task<T?> GetByCondition(Expression<Func<T, bool>> predicate);
        /// <summary>
        /// Create entity of type T in the database.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        Task<T> CreateAsync(T entity);

        /// <summary>
        /// Update entity of type T in the database.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        T Update(T entity);
        /// <summary>
        /// RemoveEntity from database
        /// </summary>
        /// <param name="entity"></param>
        void Delete(T entity);
        /// <summary>
        /// Save changes to the database.
        /// </summary>
        /// <returns></returns>
        Task<int> SaveChangesAsync();
    }
}
