using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeTakusan.MAL.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedUserIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_MalUsers_MalUserId",
                schema: "mal",
                table: "MalUsers",
                column: "MalUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MalUsers_UserId",
                schema: "mal",
                table: "MalUsers",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MalUsers_MalUserId",
                schema: "mal",
                table: "MalUsers");

            migrationBuilder.DropIndex(
                name: "IX_MalUsers_UserId",
                schema: "mal",
                table: "MalUsers");
        }
    }
}
