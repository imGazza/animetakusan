using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeTakusan.MAL.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MinorChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"ALTER TABLE mal.""MalReplayMessages""
                  ALTER COLUMN ""MalUserId"" TYPE integer USING ""MalUserId""::integer;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "MalUserId",
                schema: "mal",
                table: "MalReplayMessages",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }
    }
}
