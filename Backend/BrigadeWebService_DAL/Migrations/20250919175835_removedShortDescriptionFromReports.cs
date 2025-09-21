using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BrigadeWebService_DAL.Migrations
{
    /// <inheritdoc />
    public partial class removedShortDescriptionFromReports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "ShortDescription",
                table: "Reports");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "Reports",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ShortDescription",
                table: "Reports",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
