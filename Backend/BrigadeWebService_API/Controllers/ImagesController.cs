using BrigadeWebService_BLL.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BrigadeWebService_API.Controllers
{
    [ApiController]
    [Route("api/images")]
    public class ImagesController : ControllerBase
    {
        private readonly IDonationService _donations;

        public ImagesController(IDonationService donations)
        {
            _donations = donations;
        }
    }
}
