using AutoMapper;
using BrigadeWebService_BLL.Dto.Reports;
using BrigadeWebService_DAL.Entities;

namespace BrigadeWebService_BLL.Mapper.Vacancies
{
    public class ReportProfile : Profile
    {
        public ReportProfile()
        {
            CreateMap<Report, ReportCreateModel>().ReverseMap();
            CreateMap<Report, ReportDto>()
            .ForMember(d => d.Images, o => o.MapFrom(s => s.Images));
        }
    }
}
