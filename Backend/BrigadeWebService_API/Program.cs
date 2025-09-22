using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using BrigadeWebService_BLL.Mapper.Vacancies;
using BrigadeWebService_BLL.Options;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_BLL.Services.Realizations;
using BrigadeWebService_BLL.Services.Realizations.AWS;
using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Repositories.Interfaces.Donations;
using BrigadeWebService_DAL.Repositories.Interfaces.Images;
using BrigadeWebService_DAL.Repositories.Interfaces.Reports;
using BrigadeWebService_DAL.Repositories.Interfaces.Vacancies;
using BrigadeWebService_DAL.Repositories.Realizations.Donations;
using BrigadeWebService_DAL.Repositories.Realizations.Images;
using BrigadeWebService_DAL.Repositories.Realizations.Vacancies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// AutoMapper
builder.Services.AddAutoMapper(typeof(VacancyProfile));

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sql => sql.MigrationsAssembly("BrigadeWebService_DAL")
    ));

// JWT
var jwtSection = builder.Configuration.GetSection("Jwt");

var jwtKey = jwtSection["Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
    throw new InvalidOperationException("Missing Jwt:Key (set it via env JWT__Key).");

var jwtIssuer = jwtSection["Issuer"] ?? "app";
var jwtAudience = jwtSection["Audience"] ?? "app";

var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = signingKey,

            ClockSkew = TimeSpan.Zero
        };
    });

// AWS S3 (з env або appsettings)
builder.Services.AddSingleton<IAmazonS3>(_ =>
{
    var aws = builder.Configuration.GetSection("AWS");
    var regionName = aws["Region"] ?? "eu-north-1";
    var region = RegionEndpoint.GetBySystemName(regionName);

    var accessKey = aws["AccessKey"];
    var secretKey = aws["SecretKey"];

    if (!string.IsNullOrWhiteSpace(accessKey) && !string.IsNullOrWhiteSpace(secretKey))
        return new AmazonS3Client(accessKey.Trim(), secretKey.Trim(), region);

    // Без ключів — використовуємо default credentials chain (ENV, профілі, IAM роль тощо)
    return new AmazonS3Client(region);
});

// Services
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddTransient<IVacanciesService, VacanciesService>();
builder.Services.AddTransient<IReportsService, ReportsService>();
builder.Services.AddTransient<IDonationService, DonationService>();
builder.Services.AddScoped<IVacancyRepository, VacancyRepository>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddScoped<IDonationsRepository, DonationsRepository>();
builder.Services.AddScoped<IImagesRepository, ImagesRepository>();
builder.Services.AddScoped<S3ImageService>();

// CORS (дев режим — максимально вільно)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Upload options
builder.Services.Configure<UploadOptions>(builder.Configuration.GetSection("Uploads"));

// System.Text.Json налаштування (як у тебе було)
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
});

var app = builder.Build();

app.UseCors("AllowReactApp");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();

// Міграції БД на старті
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Swagger тільки у Dev
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

// Гарантуємо існування wwwroot
var webRoot = app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
Directory.CreateDirectory(webRoot);

app.Run();
