using AutoMapper;
using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations.AWS;
using BrigadeWebService_BLL.Services.Realizations.Base;
using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Images;
using BrigadeWebService_DAL.Repositories.Interfaces.Reports;
using Microsoft.AspNetCore.Http;

namespace BrigadeWebService_BLL.Services.Realizations
{
    public class ReportsService : BaseCrudService<Report, ReportCreateModel, ReportUpdateModel>, IReportsService
    {
        private readonly IReportRepository _reportRepository;
        private readonly IImagesRepository _imagesRepository;
        private IMapper _mapper;
        private readonly S3ImageService _s3;
        private readonly AppDbContext _db; // у сервісі можна, у контролері не будемо

        public ReportsService(IReportRepository reportRepository, IMapper mapper,
                              IImagesRepository imagesRepository, S3ImageService s3, AppDbContext db)
            : base(reportRepository, mapper)
        {
            _reportRepository = reportRepository;
            _imagesRepository = imagesRepository;
            _s3 = s3;
            _db = db;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ReportDto>> GetAllDtoAsync(CancellationToken ct = default)
        {
            var reports = await _reportRepository.GetAllWithImagesAsync(ct); // .Include(r => r.Images)
            return _mapper.Map<IEnumerable<ReportDto>>(reports);
        }

        public async Task<IEnumerable<Report>> GetReportsByDonationIdAsync(int donationId)
            => await _reportRepository.GetReportsByDonationIdAsync(donationId);

        public async Task<(int reportId, IEnumerable<(int imageId, string viewUrl)>)> CreateWithImagesAsync(
            ReportCreateModel model, IEnumerable<IFormFile> photos, CancellationToken ct)
        {
            // створюємо репорт стандартним шляхом
            var created = await CreateAsync(model);
            if (created == null) throw new InvalidOperationException("Failed to create report");
            var reportId = created.Id;

            var result = new List<(int, string)>();
            foreach (var f in photos ?? Enumerable.Empty<IFormFile>())
            {
                var (key, etag) = await _s3.UploadForReportAsync(reportId, f, ct);
                var img = new Image
                {
                    ReportId = reportId,
                    ObjectKey = key,
                    ContentType = f.ContentType,
                    SizeBytes = f.Length,
                    ETag = etag?.Trim('"'),
                    Status = ImageStatus.Active,
                    CreatedAt = DateTime.UtcNow
                };
                await _imagesRepository.AddAsync(img, ct);
                await _imagesRepository.SaveAsync(ct);
                result.Add((img.Id, _s3.CreatePresignedGet(img.ObjectKey)));
            }
            return (reportId, result);
        }
    }
}
