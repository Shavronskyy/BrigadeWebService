using BrigadeWebService_DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace BrigadeWebService_DAL.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Vacancy> Vacancies { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Post> Posts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Post>()
                .HasMany(p => p.Images)
                .WithOne(i => i.Post)
                .HasForeignKey(i => i.PostId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
