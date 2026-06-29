using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeTakusan.Infrastructure.DataPersistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedUserIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_MyAnimeListUsers_MalUserId",
                table: "MyAnimeListUsers",
                column: "MalUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AniListUsers_AniListUserId",
                table: "AniListUsers",
                column: "AniListUserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MyAnimeListUsers_MalUserId",
                table: "MyAnimeListUsers");

            migrationBuilder.DropIndex(
                name: "IX_AniListUsers_AniListUserId",
                table: "AniListUsers");
        }
    }
}
