using Microsoft.AspNetCore.Http;

namespace BrigadeWebService_BLL.Dto.Reports
{
    public class ReportCreateWithImagesForm
    {
        // текстові поля (мають іти ПЕРЕД файлами у FormData)
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int DonationId { get; set; }

        // файли
        public List<IFormFile> Photos { get; set; } = new();
    }
}
