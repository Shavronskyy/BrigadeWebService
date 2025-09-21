using BrigadeWebService_DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace BrigadeWebService_DAL.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Vacancy> Vacancies => Set<Vacancy>();
        public DbSet<Report> Reports => Set<Report>();
        public DbSet<Donation> Donations => Set<Donation>();
        public DbSet<Image> Images { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
