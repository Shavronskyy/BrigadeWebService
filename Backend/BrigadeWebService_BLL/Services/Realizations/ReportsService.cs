using AutoMapper;
using BrigadeWebService_BLL.Dto.Images;
using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Enums;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations.AWS;
using BrigadeWebService_BLL.Services.Realizations.Base;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Reports;
using Microsoft.AspNetCore.Http;

namespace BrigadeWebService_BLL.Services.Realizations
{
    public class ReportsService : BaseCrudService<Report, ReportCreateModel, ReportUpdateModel>, IReportsService
    {
        private readonly IReportRepository _reportRepository;
        private readonly IImageService _imageService;
        private IMapper _mapper;
        private readonly S3ImageService _s3;

        public ReportsService(IReportRepository reportRepository, IMapper mapper, S3ImageService s3, IImageService imageService)
            : base(reportRepository, mapper)
        {
            _reportRepository = reportRepository;
            _s3 = s3;
            _mapper = mapper;
            _imageService = imageService;
        }

        public override async Task<bool> DeleteAsync(int id, CancellationToken ct)
        {
            var report = await _reportRepository.GetByIdAsync(id);
            if (report == null || report.Images == null) throw new InvalidOperationException($"Report with Id: {id} doesnt exist!");

            foreach (var image in report.Images)
            {
                // remove images
                if (image != null)
                    await _imageService.RemoveImage(image, ct);
            }

            return await base.DeleteAsync(id, ct);
        }

        public async Task<IEnumerable<ReportDto>> GetAllDtoAsync(CancellationToken ct = default)
        {
            var reports = await _reportRepository.GetAllWithImagesAsync(ct); // .Include(r => r.Images)
            return _mapper.Map<IEnumerable<ReportDto>>(reports);
        }

        public async Task<IEnumerable<Report>> GetReportsByDonationIdAsync(int donationId)
            => await _reportRepository.GetReportsByDonationIdAsync(donationId);

        public async Task<int> CreateAsync(ReportCreateModel model, IEnumerable<IFormFile> photos, CancellationToken ct)
        {
            var created = await CreateAsync(model);
            if (created == null) throw new InvalidOperationException("Failed to create report");

            var result = new List<(int, string)>();
            foreach (var f in photos ?? Enumerable.Empty<IFormFile>())
            {
                var (key, etag) = await _s3.UploadImagesAsync(created.Id, f, Content.Reports, ct);
                var img = new ImageCreateDto
                {
                    ReportId = created.Id,
                    ObjectKey = key,
                    ContentType = f.ContentType,
                    SizeBytes = f.Length,
                    ETag = etag?.Trim('"'),
                    Status = ImageStatus.Active,
                    CreatedAt = DateTime.UtcNow
                };
                await _imageService.CreateImage(img, ct);
            }
            return created.Id;
        }
    }
}
