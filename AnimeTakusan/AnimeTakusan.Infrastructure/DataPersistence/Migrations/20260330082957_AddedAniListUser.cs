using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AnimeTakusan.Infrastructure.DataPersistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedAniListUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AniListUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    AniListUserId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    AccessToken = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    AccessTokenExpiry = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AniListUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AniListUsers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AniListUsers_UserId",
                table: "AniListUsers",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AniListUsers");
        }
    }
}
