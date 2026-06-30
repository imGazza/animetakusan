using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeTakusan.Infrastructure.DataPersistence.Migrations
{
    /// <inheritdoc />
    public partial class AniListUser_AddedInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AniListAvatar",
                table: "AniListUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AniListUsername",
                table: "AniListUsers",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AniListAvatar",
                table: "AniListUsers");

            migrationBuilder.DropColumn(
                name: "AniListUsername",
                table: "AniListUsers");
        }
    }
}
