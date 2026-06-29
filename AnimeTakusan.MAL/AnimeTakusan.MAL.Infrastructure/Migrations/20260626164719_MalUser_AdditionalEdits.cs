using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AnimeTakusan.MAL.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MalUser_AdditionalEdits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MalUsers",
                schema: "mal",
                table: "MalUsers");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                schema: "mal",
                table: "MalUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MalUsers",
                schema: "mal",
                table: "MalUsers",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MalUsers",
                schema: "mal",
                table: "MalUsers");

            migrationBuilder.DropColumn(
                name: "Id",
                schema: "mal",
                table: "MalUsers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MalUsers",
                schema: "mal",
                table: "MalUsers",
                column: "UserId");
        }
    }
}
