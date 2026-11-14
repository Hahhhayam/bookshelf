using System.Globalization;
using System.Text;

namespace WebApi.Reports;

/// <summary>Scenario 3.12 export: one CSV file with a section per table, readable by spreadsheet tools.</summary>
internal static class ManagementReportCsv
{
    public static string Write(ManagementReport report)
    {
        var csv = new StringBuilder();
        Summary(csv, report);
        Section(csv, "Top books", "book,sold,revenue",
            report.TopBooks.Select(b => Row(b.Book, b.Sold.Value, b.Revenue)));
        Section(csv, "Stores", "location,revenue,margin,receipts,average check",
            report.Stores.Select(s => Row(s.Location, s.Revenue, s.Margin, s.Receipts, s.AverageCheck)));
        Section(csv, "Categories", "category,sold,revenue",
            report.Categories.Select(c => Row(c.Category?.ToString() ?? "uncategorised", c.Sold.Value, c.Revenue)));
        Section(csv, "ABC analysis", "book,revenue,cumulative share,class",
            report.Abc.Select(a => Row(a.Book, a.Revenue, a.CumulativeShare, a.Class)));
        Section(csv, "Shortages", "location,book,on hand,minimum",
            report.Shortages.Select(s => Row(s.Location, s.Book, s.OnHand.Value, s.Minimum.Value)));
        Section(csv, "Slow-moving books", "book", report.SlowMovingBooks.Select(b => Row(b)));
        return csv.ToString();
    }

    private static void Summary(StringBuilder csv, ManagementReport report)
    {
        csv.AppendLine("metric,value");
        csv.AppendLine(Row("revenue", report.Revenue));
        csv.AppendLine(Row("margin", report.Margin));
        csv.AppendLine(Row("receipts", report.Receipts));
        csv.AppendLine(Row("average check", report.AverageCheck));
        csv.AppendLine(Row("days of stock", report.DaysOfStock?.ToString(CultureInfo.InvariantCulture) ?? ""));
    }

    private static void Section(StringBuilder csv, string title, string header, IEnumerable<string> rows)
    {
        csv.AppendLine().AppendLine(Cell(title)).AppendLine(header);
        foreach (var row in rows)
            csv.AppendLine(row);
    }

    private static string Row(params object[] cells) => string.Join(",", cells.Select(Cell));

    private static string Cell(object value)
    {
        var text = value switch
        {
            Money money => money.ToString(),
            IFormattable formattable => formattable.ToString(null, CultureInfo.InvariantCulture),
            _ => value.ToString() ?? "",
        };
        return text.IndexOfAny([',', '"', '\n']) < 0 ? text : $"\"{text.Replace("\"", "\"\"")}\"";
    }
}
