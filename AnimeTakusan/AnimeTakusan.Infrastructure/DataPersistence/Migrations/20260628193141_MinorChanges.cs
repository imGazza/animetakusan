using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeTakusan.Infrastructure.DataPersistence.Migrations
{
    /// <inheritdoc />
    public partial class MinorChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MyAnimeListUsers_UserId",
                table: "MyAnimeListUsers");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "MyAnimeListUsers",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateIndex(
                name: "IX_MyAnimeListUsers_UserId",
                table: "MyAnimeListUsers",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MyAnimeListUsers_UserId",
                table: "MyAnimeListUsers");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "MyAnimeListUsers",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateIndex(
                name: "IX_MyAnimeListUsers_UserId",
                table: "MyAnimeListUsers",
                column: "UserId");
        }
    }
}
