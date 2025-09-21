using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Entities.Base;
using BrigadeWebService_DAL.Repositories.Interfaces.Base;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BrigadeWebService_DAL.Repositories.Realizations.Base
{
    public class RepositoryBase<T> : IRepositoryBase<T>
    where T : class, IBaseEntity
    {
        private readonly AppDbContext _dbContext;

        public RepositoryBase(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        #region Get
        /// inheritdoc />
        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }
        /// inheritdoc />
        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbContext.Set<T>().FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<T?> GetByCondition(Expression<Func<T, bool>> predicate)
        {
            return await _dbContext.Set<T>().FirstOrDefaultAsync(predicate);
        }

        public async Task<IEnumerable<T>> GetAllByCondition(Expression<Func<T, bool>> predicate)
        {
            return await _dbContext.Set<T>().Where(predicate).ToListAsync();
        }
        #endregion Get

        #region CRUD
        public async Task<T> CreateAsync(T entity)
        {
            var tmp = await _dbContext.Set<T>().AddAsync(entity);
            return tmp.Entity;
        }

        public T Update(T entity)
        {
            return _dbContext.Set<T>().Update(entity).Entity;
        }

        public void Delete(T entity)
        {
            _dbContext.Set<T>().Remove(entity);
        }
        #endregion CRUD

        public async Task<int> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }
    }
}
