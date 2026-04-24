using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DroneMarketplace.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPilotVerificationRejectionReason : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VerificationRejectionReason",
                table: "Pilots",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VerificationRejectionReason",
                table: "Pilots");
        }
    }
}
