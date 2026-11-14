using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SplitStatusHistories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderStatusChanges_Orders_OrderId",
                schema: "orders",
                table: "OrderStatusChanges");

            migrationBuilder.DropIndex(
                name: "IX_OrderStatusChanges_OrderId",
                schema: "orders",
                table: "OrderStatusChanges");

            migrationBuilder.AlterColumn<Guid>(
                name: "By",
                schema: "orders",
                table: "OrderStatusChanges",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "PurchaseOrderStatusChanges",
                schema: "purchasing",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PurchaseOrderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    From = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    To = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    At = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    By = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PurchaseOrderStatusChanges", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TransferStatusChanges",
                schema: "inventory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TransferId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    From = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    To = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    At = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    By = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransferStatusChanges", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderStatusChanges_OrderId_At",
                schema: "orders",
                table: "OrderStatusChanges",
                columns: new[] { "OrderId", "At" });

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrderStatusChanges_PurchaseOrderId_At",
                schema: "purchasing",
                table: "PurchaseOrderStatusChanges",
                columns: new[] { "PurchaseOrderId", "At" });

            migrationBuilder.CreateIndex(
                name: "IX_TransferStatusChanges_TransferId_At",
                schema: "inventory",
                table: "TransferStatusChanges",
                columns: new[] { "TransferId", "At" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PurchaseOrderStatusChanges",
                schema: "purchasing");

            migrationBuilder.DropTable(
                name: "TransferStatusChanges",
                schema: "inventory");

            migrationBuilder.DropIndex(
                name: "IX_OrderStatusChanges_OrderId_At",
                schema: "orders",
                table: "OrderStatusChanges");

            migrationBuilder.AlterColumn<Guid>(
                name: "By",
                schema: "orders",
                table: "OrderStatusChanges",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.CreateIndex(
                name: "IX_OrderStatusChanges_OrderId",
                schema: "orders",
                table: "OrderStatusChanges",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderStatusChanges_Orders_OrderId",
                schema: "orders",
                table: "OrderStatusChanges",
                column: "OrderId",
                principalSchema: "orders",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
