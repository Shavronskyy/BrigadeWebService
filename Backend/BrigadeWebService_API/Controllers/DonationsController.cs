using BrigadeWebService_API.Controllers.Base;
using BrigadeWebService_BLL.Dto.Donations;
using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BrigadeWebService_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonationsController : BaseCRUDController<Donation, DonationCreateModel, DonationUpdateModel>
    {
        private IDonationService _donationService;

        public DonationsController(IDonationService donationService) : base(donationService)
        {
            _donationService = donationService;
        }

        [HttpGet("getAllDto")]
        public async Task<ActionResult<IEnumerable<DonationDto>>> GetAll(CancellationToken ct)
        {
            var list = await _donationService.GetAllDtoAsync(ct);
            return Ok(list);
        }

        [HttpGet("getDtoById/{id:int}")]
        public async Task<ActionResult<DonationDto>> GetOne(int id, CancellationToken ct)
        {
            var dto = await _donationService.GetByIdDtoAsync(id, ct);
            return dto is null ? NotFound() : Ok(dto);
        }

        [HttpPost("{id}/createReport")]
        public async Task<IActionResult> AddReport([FromRoute] int id, [FromBody] ReportCreateModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            return await _donationService.CreateReportAsync(id, model) ? Ok() : BadRequest("Failed to create report for donation");
        }

        [HttpPatch("{id}/completeDonation")]
        public async Task<IActionResult> CompleteDonation([FromRoute] int id)
        {
            return await _donationService.ChangeDonationStateAsync(id) ? Ok() : BadRequest("Failed to create report for donation");
        }

        [HttpGet("getReportsByDonationId/{id}")]
        public async Task<IActionResult> GetReportsDtoByDonationId([FromRoute] int id)
        {
            var report = await _donationService.GetReportsDtoByDonationIdAsync(id);
            return report.Any() ? Ok(report) : BadRequest("Failed to create report for donation");
        }

        [HttpPost("create-with-image")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateWithImage(
        [FromForm] string Title,
        [FromForm] string Description,
        [FromForm] long Goal,
        [FromForm] string DonationLink,
        [FromForm] IFormFile? Photo, // необов’язково
        CancellationToken ct)
        {
            var model = new DonationCreateModel
            {
                Title = Title,
                Description = Description,
                Goal = Goal,
                CreationDate = DateTime.UtcNow,
                DonationLink = DonationLink
            };

            var (id, imageUrl) = await _donationService.CreateWithImageAsync(model, Photo, ct);

            return id > 0 ? Created() : BadRequest();
        }
    }
}
