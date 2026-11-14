using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SplitPriceHistoryFromBook : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PriceEntries_Books_BookId",
                schema: "catalog",
                table: "PriceEntries");

            migrationBuilder.DropIndex(
                name: "IX_PriceEntries_BookId",
                schema: "catalog",
                table: "PriceEntries");

            migrationBuilder.AddColumn<decimal>(
                name: "Price_Amount",
                schema: "catalog",
                table: "Books",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Price_Currency",
                schema: "catalog",
                table: "Books",
                type: "nchar(3)",
                fixedLength: true,
                maxLength: 3,
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql(
                """
                UPDATE b
                SET b.Price_Amount = p.Price_Amount, b.Price_Currency = p.Price_Currency
                FROM catalog.Books b
                CROSS APPLY (
                    SELECT TOP 1 e.Price_Amount, e.Price_Currency
                    FROM catalog.PriceEntries e
                    WHERE e.BookId = b.Id
                    ORDER BY CASE WHEN e.ValidFrom <= SYSDATETIMEOFFSET() THEN 0 ELSE 1 END, e.ValidFrom DESC
                ) p
                """);

            migrationBuilder.CreateIndex(
                name: "IX_PriceEntries_BookId_ValidFrom",
                schema: "catalog",
                table: "PriceEntries",
                columns: new[] { "BookId", "ValidFrom" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PriceEntries_BookId_ValidFrom",
                schema: "catalog",
                table: "PriceEntries");

            migrationBuilder.DropColumn(
                name: "Price_Amount",
                schema: "catalog",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "Price_Currency",
                schema: "catalog",
                table: "Books");

            migrationBuilder.CreateIndex(
                name: "IX_PriceEntries_BookId",
                schema: "catalog",
                table: "PriceEntries",
                column: "BookId");

            migrationBuilder.AddForeignKey(
                name: "FK_PriceEntries_Books_BookId",
                schema: "catalog",
                table: "PriceEntries",
                column: "BookId",
                principalSchema: "catalog",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
