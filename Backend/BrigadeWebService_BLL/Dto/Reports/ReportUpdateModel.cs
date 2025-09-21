using BrigadeWebService_BLL.Dto.Base;

namespace BrigadeWebService_BLL.Dto.Reports
{
    public class ReportUpdateModel : ReportCreateModel, IUpdateModel
    {
        public int Id { get; set; }
    }
}
