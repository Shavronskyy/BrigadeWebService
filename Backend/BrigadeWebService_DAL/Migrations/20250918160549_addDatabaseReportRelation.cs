using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BrigadeWebService_DAL.Migrations
{
    /// <inheritdoc />
    public partial class addDatabaseReportRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DonationId",
                table: "Reports",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Reports_DonationId",
                table: "Reports",
                column: "DonationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_Donations_DonationId",
                table: "Reports",
                column: "DonationId",
                principalTable: "Donations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_Donations_DonationId",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_DonationId",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "DonationId",
                table: "Reports");
        }
    }
}
