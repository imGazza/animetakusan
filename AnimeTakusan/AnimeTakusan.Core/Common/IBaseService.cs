using System;

namespace AnimeTakusan.Core.Common;

public interface IBaseService<TEntity, TDto>
{
    Task<TDto?> GetByIdAsync(int id);
    Task<IEnumerable<TDto>> GetAllAsync();
    Task<TDto> CreateAsync(TDto dto);
    Task<TDto> UpdateAsync(int id, TDto dto);
    Task DeleteAsync(int id);
}
