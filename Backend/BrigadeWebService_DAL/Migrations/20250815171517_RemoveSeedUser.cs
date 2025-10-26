using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BrigadeWebService_DAL.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSeedUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "PasswordHash", "Role", "Username" },
                values: new object[] { 1, "$2a$12$0QGvGHDZ5zNpZxO7T1XYveC6rJp9FkMzw5JZgN12/p6YvC4FvSe2G", "User", "user@example.com" });
        }
    }
}
