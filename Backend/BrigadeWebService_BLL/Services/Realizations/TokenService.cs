using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_DAL.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config) => _config = config;

    public string GenerateToken(User user)
    {
        // Безпечне читання конфігу з дефолтами
        var keyStr = _config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is missing");
        var issuer = _config["Jwt:Issuer"] ?? "app";
        var audience = _config["Jwt:Audience"] ?? "app";

        int expiresMinutes = 60; // дефолт
        var minutesStr = _config["Jwt:ExpiresMinutes"];
        if (!string.IsNullOrWhiteSpace(minutesStr))
            int.TryParse(minutesStr, out expiresMinutes);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var role = string.IsNullOrWhiteSpace(user.Role) ? "User" : user.Role;

        var claims = new List<Claim>
        {
            new (JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new (ClaimTypes.NameIdentifier, user.Id.ToString()),
            new (ClaimTypes.Name, user.Username),
            new (ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
