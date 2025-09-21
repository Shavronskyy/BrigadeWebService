using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_BLL.Services.Interfaces.Base;
using BrigadeWebService_DAL.Entities;
using Microsoft.AspNetCore.Http;

namespace BrigadeWebService_BLL.Services.Interfaces
{
    public interface IReportsService : IBaseCrudService<Report, ReportCreateModel, ReportUpdateModel>
    {
        Task<IEnumerable<Report>> GetReportsByDonationIdAsync(int donationId);
        Task<(int reportId, IEnumerable<(int imageId, string viewUrl)>)> CreateWithImagesAsync(
        ReportCreateModel model, IEnumerable<IFormFile> photos, CancellationToken ct);
    }
}
