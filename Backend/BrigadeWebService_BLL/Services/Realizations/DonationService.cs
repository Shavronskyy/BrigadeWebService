using AutoMapper;
using BrigadeWebService_BLL.Dto.Donations;
using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations.AWS;
using BrigadeWebService_BLL.Services.Realizations.Base;
using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Donations;
using BrigadeWebService_DAL.Repositories.Interfaces.Images;
using Microsoft.AspNetCore.Http;

namespace BrigadeWebService_BLL.Services.Realizations
{
    public class DonationService : BaseCrudService<Donation, DonationCreateModel, DonationUpdateModel>, IDonationService
    {
        private readonly IDonationsRepository _donationRepository;
        private readonly IReportsService _reportsService;
        private readonly IImagesRepository _imagesRepository;
        private readonly S3ImageService _s3;
        private readonly AppDbContext _db;
        private IMapper _mapper;

        public DonationService(IDonationsRepository donationRepository, IMapper mapper,
                               IReportsService reportsService, IImagesRepository imagesRepository,
                               S3ImageService s3, AppDbContext db)
            : base(donationRepository, mapper)
        {
            _donationRepository = donationRepository;
            _reportsService = reportsService;
            _imagesRepository = imagesRepository;
            _s3 = s3;
            _db = db;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DonationDto>> GetAllDtoAsync(CancellationToken ct = default)
        {
            var donations = await _donationRepository.GetAllWithImageAsync(ct);
            return _mapper.Map<IEnumerable<DonationDto>>(donations);
        }

        public async Task<DonationDto?> GetByIdDtoAsync(int id, CancellationToken ct = default)
        {
            var donation = await _donationRepository.GetByIdWithImageAsync(id, ct);
            return donation is null ? null : _mapper.Map<DonationDto>(donation);
        }

        public async Task<bool> CreateReportAsync(int donationId, ReportCreateModel model)
        {
            var donation = await _donationRepository.GetByIdAsync(donationId);
            if (donation == null)
                throw new InvalidOperationException($"Donation with Id: {donationId} doesn't exist!");

            var report = await _reportsService.CreateAsync(model);
            return report != null;
        }

        public async Task<bool> ChangeDonationStateAsync(int id)
        {
            var donation = await _donationRepository.GetByIdAsync(id);
            if (donation == null) throw new InvalidOperationException($"Donate with Id: {id} doesnt exist!");
            donation.IsCompleted = !donation.IsCompleted;
            return await _donationRepository.SaveChangesAsync() == 1;
        }

        public async Task<IEnumerable<ReportDto>> GetReportsDtoByDonationIdAsync(int donationId)
        {
            var reports = await _reportsService.GetReportsByDonationIdAsync(donationId);
            return reports != null && reports.Any() ? _mapper.Map<IEnumerable<ReportDto>>(reports) : null;
        }

        public async Task<(int donationId, string? imageUrl)> CreateWithImageAsync(
        DonationCreateModel model,
        IFormFile? photo,
        CancellationToken ct)
        {
            // 1) створюємо донейшн стандартним методом із базового CRUD
            var created = await CreateAsync(model) ?? throw new InvalidOperationException("Failed to create donation");

            string? url = null;

            // 2) якщо є файл — вантажимо в S3 і лінкуємо як єдину картинку
            if (photo != null)
            {
                var (key, etag) = await _s3.UploadForDonationAsync(created.Id, photo, ct);

                // якщо Donation має один-до-одного Image через Donation.ImageId
                var img = new Image
                {
                    ObjectKey = key,
                    ContentType = photo.ContentType,
                    SizeBytes = photo.Length,
                    ETag = etag?.Trim('"'),
                    Status = ImageStatus.Active,
                    CreatedAt = DateTime.UtcNow,
                    Donation = created
                };

                await _imagesRepository.AddAsync(img, ct);
                await _imagesRepository.SaveAsync(ct);

                url = _s3.CreatePresignedGet(key);
            }

            return (created.Id, url);
        }
    }
}
