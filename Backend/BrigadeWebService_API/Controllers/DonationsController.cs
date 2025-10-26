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
        public async Task<ActionResult<IEnumerable<DonationDto>>> GetAllAsync(CancellationToken ct)
        {
            var list = await _donationService.GetAllDtoAsync(ct);
            return (list?.Any() ?? null) != null ? Ok(list) : NotFound();
        }

        [HttpGet("getDtoById/{id:int}")]
        public async Task<ActionResult<DonationDto>> GetDtoByIdAsync(int id, CancellationToken ct)
        {
            var dto = await _donationService.GetByIdDtoAsync(id, ct);
            return dto != null ? Ok(dto) : NotFound();
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
            return await _donationService.ChangeDonationStateAsync(id) ? Ok() : BadRequest("Failed to complete donation");
        }

        [HttpGet("getReportsByDonationId/{id}")]
        public async Task<IActionResult> GetReportsDtoByDonationId([FromRoute] int id)
        {
            var report = await _donationService.GetReportsDtoByDonationIdAsync(id);
            return Ok(report);
        }

        [HttpPost("create")]
        [Consumes("multipart/form-data")]
        public override async Task<IActionResult> Create([FromForm] DonationCreateModel model, CancellationToken ct)
        {
            var donationId = await _donationService.CreateAsync(model, model.Photo, ct);

            return donationId > 0 ? Created() : BadRequest();
        }
    }
}
