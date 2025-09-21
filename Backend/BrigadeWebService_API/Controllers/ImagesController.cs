using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations.AWS;
using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
