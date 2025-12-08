using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeTakusan.Infrastructure.DataPersistence.Migrations
{
    /// <inheritdoc />
    public partial class User_RemovedOveriddenUsername : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserName",
                table: "users");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "users",
                newName: "UserName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "users",
                newName: "Username");

            migrationBuilder.AddColumn<string>(
                name: "UserName",
                table: "users",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);
        }
    }
}
