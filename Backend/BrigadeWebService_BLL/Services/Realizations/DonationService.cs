using AutoMapper;
using BrigadeWebService_BLL.Dto.Donations;
using BrigadeWebService_BLL.Dto.Images;
using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Enums;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations.AWS;
using BrigadeWebService_BLL.Services.Realizations.Base;
using BrigadeWebService_DAL.Entities;
using BrigadeWebService_DAL.Repositories.Interfaces.Donations;
using Microsoft.AspNetCore.Http;

namespace BrigadeWebService_BLL.Services.Realizations
{
    public class DonationService : BaseCrudService<Donation, DonationCreateModel, DonationUpdateModel>, IDonationService
    {
        private readonly IDonationsRepository _donationRepository;
        private readonly IReportsService _reportsService;
        private readonly IImageService _imageService;
        private readonly S3ImageService _s3;
        private IMapper _mapper;

        public DonationService(IDonationsRepository donationRepository, IMapper mapper,
                               IReportsService reportsService, S3ImageService s3, IImageService imageService)
            : base(donationRepository, mapper)
        {
            _donationRepository = donationRepository;
            _reportsService = reportsService;
            _s3 = s3;
            _mapper = mapper;
            _imageService = imageService;
        }

        public override async Task<bool> DeleteAsync(int id, CancellationToken ct)
        {
            var donation = await _donationRepository.GetByIdAsync(id);
            if(donation == null) throw new InvalidOperationException($"Donate with Id: {id} doesnt exist!");

            //remove image
            if(donation.Image != null)
                await _imageService.RemoveImage(donation.Image, ct);

            foreach (var report in donation.Reports)
            {
                await _reportsService.DeleteAsync(report.Id, ct);
            }

            return await base.DeleteAsync(id, ct);
        }

        public async Task<IEnumerable<DonationDto>> GetAllDtoAsync(CancellationToken ct = default)
        {
            var donations = await _donationRepository.GetAllAsync(ct);
            return _mapper.Map<IEnumerable<DonationDto>>(donations);
        }

        public async Task<DonationDto?> GetByIdDtoAsync(int id, CancellationToken ct = default)
        {
            var donation = await _donationRepository.GetByIdAsync(id, ct);
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

        public async Task<int> CreateAsync(DonationCreateModel model, IFormFile? photo, CancellationToken ct)
        {
            // create donation
            var created = await CreateAsync(model) ?? throw new InvalidOperationException("Failed to create donation");

            if (photo != null)
            {
                // upload image to s3
                var (key, etag) = await _s3.UploadImagesAsync(created.Id, photo, Content.Donations, ct);
                // create image record in database
                var imageModel = new ImageCreateDto()
                {
                    ObjectKey = key,
                    ContentType = photo.ContentType,
                    SizeBytes = photo.Length,
                    ETag = etag?.Trim('"'),
                    Status = ImageStatus.Active,
                    CreatedAt = DateTime.UtcNow,
                    Donation = created
                };

                await _imageService.CreateImage(imageModel, ct);
            }

            return created.Id;
        }
    }
}
