using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Domain.Entities.Common;
using AnimeTakusan.Infrastructure.Contexts;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace AnimeTakusan.Infrastructure.DataPersistence;

public class BaseService<TEntity, TDto> : IBaseService<TEntity, TDto> where TEntity : Entity, IInjectable
{
    private readonly BaseContext _context;
    private readonly DbSet<TEntity> _dbSet;

    public BaseService(BaseContext context)
    {
        _context = context;
        _dbSet = _context.Set<TEntity>();
    }

    public virtual async Task<TDto?> GetByIdAsync(int id)
    {
        TEntity? entity = await _dbSet.FindAsync(id);
        return entity.Adapt<TDto>();
    }

    public virtual async Task<IEnumerable<TDto>> GetAllAsync()
    {
        List<TEntity> entities = await _dbSet.ToListAsync();
        return entities.Adapt<List<TDto>>();
    }

    public virtual async Task<TDto> CreateAsync(TDto dto)
    {
        TEntity entity = dto.Adapt<TEntity>();
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity.Adapt<TDto>();
    }

    public virtual async Task<TDto> UpdateAsync(int id, TDto dto)
    {
        TEntity entity = dto.Adapt<TEntity>();
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
        return entity.Adapt<TDto>();
    }

    public virtual async Task DeleteAsync(int id)
    {
        await _dbSet.Where(e => e.Id == id).ExecuteDeleteAsync();
    }
}
