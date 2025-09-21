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

        [HttpPost("create-with-images")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateWithImages([FromForm] string Title,
                                                      [FromForm] string Description,
                                                      [FromForm] string Category,
                                                      [FromForm] int DonationId,
                                                      [FromForm] List<IFormFile> Photos,
                                                      CancellationToken ct)
        {
            var model = new ReportCreateModel
            {
                Title = Title,
                Description  = Description,
                Category = Category,
                DonationId = DonationId,
                CreatedAt = DateTime.UtcNow
            };

            var (reportId, images) = await _reportService.CreateWithImagesAsync(model, Photos, ct);

            return reportId > 0 ? Created() : BadRequest();
        }
    }
}
