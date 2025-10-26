using BrigadeWebService_API.Controllers.Base;
using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BrigadeWebService_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : BaseCRUDController<Report, ReportCreateModel, ReportUpdateModel>
    {
        private IReportsService _reportService;

        public ReportsController(IReportsService reportService) : base(reportService)
        {
            _reportService = reportService;
        }

        [HttpPost("create")]
        [Consumes("multipart/form-data")]
        public override async Task<IActionResult> Create([FromForm] ReportCreateModel model, CancellationToken ct)
        {
            if (!ModelState.IsValid || model == null)
                return BadRequest(ModelState);
            
            var reportId = await _reportService.CreateAsync(model, model.Photos, ct);

            return reportId > 0 ? Created() : BadRequest();
        }
    }
}
