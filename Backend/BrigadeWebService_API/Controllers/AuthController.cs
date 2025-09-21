using BrigadeWebService_BLL.Dto.Authorization;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_DAL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BrigadeWebService_API.Controllers
{
    [ApiController]
    [Route("api/[controller]/")]
    public class AuthController : Controller
    {
        private readonly AppDbContext _db;
        private readonly ITokenService _tokenService;

        public AuthController(AppDbContext db, ITokenService tokenService)
        {
            _db = db;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(BrigadeWebService_BLL.Dto.Authorization.LoginRequest request)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized(new { error = "Invalid credentials" });

            var token = _tokenService.GenerateToken(user);
            return Ok(new LoginResponse(token));
        }
    }
}
