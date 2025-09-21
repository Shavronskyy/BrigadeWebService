using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BrigadeWebService_DAL.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$12$0QGvGHDZ5zNpZxO7T1XYveC6rJp9FkMzw5JZgN12/p6YvC4FvSe2G");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$0qagqSxPXSo4S2Vi.8vLyeCLVUTJwsI1OAW.OeLD4w6FFaKMOYcWq");
        }
    }
}
