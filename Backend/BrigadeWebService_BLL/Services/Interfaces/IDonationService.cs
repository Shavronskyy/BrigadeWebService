using BrigadeWebService_BLL.Dto.Donations;
using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Services.Interfaces.Base;
using BrigadeWebService_DAL.Entities;
using Microsoft.AspNetCore.Http;

namespace BrigadeWebService_BLL.Services.Interfaces
{
    public interface IDonationService : IBaseCrudService<Donation, DonationCreateModel, DonationUpdateModel>
    {
        Task<bool> CreateReportAsync(int id, ReportCreateModel model);
        Task<bool> ChangeDonationStateAsync(int id);
        Task<IEnumerable<ReportDto>> GetReportsDtoByDonationIdAsync(int donationId);
        Task<(int donationId, string? imageUrl)> CreateWithImageAsync(
        DonationCreateModel model,
        IFormFile? photo,
        CancellationToken ct);
        Task<IEnumerable<DonationDto>> GetAllDtoAsync(CancellationToken ct = default);
        Task<DonationDto?> GetByIdDtoAsync(int id, CancellationToken ct = default);
    }
}
