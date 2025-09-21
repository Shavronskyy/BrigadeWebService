using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BrigadeWebService_DAL.Migrations
{
    /// <inheritdoc />
    public partial class editedEntites : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Img",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "Img",
                table: "Donations");

            migrationBuilder.AddColumn<int>(
                name: "ImageId",
                table: "Donations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ObjectKey = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContentType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    ETag = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Width = table.Column<int>(type: "int", nullable: true),
                    Height = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReportId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Images_Reports_ReportId",
                        column: x => x.ReportId,
                        principalTable: "Reports",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Donations_ImageId",
                table: "Donations",
                column: "ImageId",
                unique: true,
                filter: "[ImageId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Images_ReportId",
                table: "Images",
                column: "ReportId");

            migrationBuilder.AddForeignKey(
                name: "FK_Donations_Images_ImageId",
                table: "Donations",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Donations_Images_ImageId",
                table: "Donations");

            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Donations_ImageId",
                table: "Donations");

            migrationBuilder.DropColumn(
                name: "ImageId",
                table: "Donations");

            migrationBuilder.AddColumn<string>(
                name: "Img",
                table: "Reports",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Img",
                table: "Donations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
