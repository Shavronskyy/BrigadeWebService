using BrigadeWebService_BLL.Dto.Base;
using BrigadeWebService_BLL.Services.Interfaces.Base;
using BrigadeWebService_DAL.Entities.Base;
using Microsoft.AspNetCore.Mvc;

namespace BrigadeWebService_API.Controllers.Base
{
    public class BaseCRUDController<TEntity, TCreateModel, TUpdateModel> : Controller
        where TEntity : IBaseEntity
        where TCreateModel : ICreateModel
        where TUpdateModel : IUpdateModel
    {
        IBaseCrudService<TEntity, TCreateModel, TUpdateModel> _service;

        public BaseCRUDController(IBaseCrudService<TEntity, TCreateModel, TUpdateModel> service)
        {
            _service = service;
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
            return data.Any() ? Ok(data) : NoContent();
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] TCreateModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid model");
            }
            var donation = await _service.CreateAsync(model);
            return donation != null ? Ok(donation) : BadRequest("Failed to create donation");
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] TUpdateModel model)
        {
            if (model == null || model.Id <= 0)
            {
                return BadRequest("Invalid model");
            }
            var updated = await _service.UpdateAsync(model);
            return updated != null ? Ok(updated) : NotFound("Donation not found");
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid ID");
            }
            var result = await _service.DeleteAsync(id);
            return result ? Ok("Donation deleted successfully") : NotFound("Donation not found");
        }
    }
}
