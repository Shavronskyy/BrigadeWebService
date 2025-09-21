using BrigadeWebService_BLL.Dto.Authorization;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

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

        [HttpPost("register")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(RegisterResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken ct)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            if (request.Password.Length < 8 ||
                !request.Password.Any(char.IsLetter) ||
                !request.Password.Any(char.IsDigit))
            {
                return BadRequest(new { error = "Password must be at least 8 chars and contain letters and digits" });
            }

            if (await _db.Users.AnyAsync(u => u.Username == request.Username, ct))
                return BadRequest(new { error = "Username is already taken" });

            var user = new User
            {
                Username = request.Username.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync(ct);

            var token = _tokenService.GenerateToken(user);

            var response = new RegisterResponse
            {
                Id = user.Id,
                Username = user.Username,
                Token = token
            };

            return Created(string.Empty, response);
        }
    }

    public class RegisterRequest
    {
        [Required]
        [MinLength(3)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterResponse
    {
        public long Id { get; set; }
        public string Username { get; set; } = "";
        public string? Email { get; set; }
        public string Token { get; set; } = "";
    }
}
