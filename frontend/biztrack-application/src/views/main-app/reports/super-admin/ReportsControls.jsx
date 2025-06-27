// src/views/main-app/reports/super-admin/components/ReportsControls.jsx
import React, { useCallback } from "react";
import { Box, Button } from "@mui/material";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AppFormButton from "../../../../components/buttons/AppFormButton";
import Upload from "@mui/icons-material/Upload";
import dayjs from "dayjs";

// Export Libraries
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Helper to format currency
const formatKSh = (amount) => {
  return `KSh ${parseFloat(amount).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const ReportsControls = ({
  dateRange,
  setDateRange,
  filteredTransactions,
  selectedTab,
}) => {
  // ─── Data preparation for export based on active tab ─────────────────────
  // This function now calculates the data specific to each tab's export
  // directly from filteredTransactions.
  const getExportData = useCallback(() => {
    let dataToExport = [];
    let headers = [];
    let summary = {};
    let fileName = `Biztrack_Report_${dayjs().format("YYYY-MM-DD")}`;

    // Common summary calculations for all reports
    const totalCommissionEarnedValue = filteredTransactions
      .filter((t) => t.status === "Completed")
      .reduce((sum, t) => sum + t.commission, 0);
    const totalTransactionsValue = filteredTransactions.filter(
      (t) => t.status === "Completed"
    ).length;

    const totalCommissionEarnedFormatted = formatKSh(
      totalCommissionEarnedValue
    );
    const totalTransactionsFormatted = totalTransactionsValue;

    switch (selectedTab) {
      case 0: {
        // Added curly braces here!
        const dailyData = filteredTransactions.reduce((acc, curr) => {
          const date = curr.date;
          acc[date] = (acc[date] || 0) + curr.commission;
          return acc;
        }, {});
        dataToExport = Object.entries(dailyData)
          .map(([date, commission]) => ({
            Date: dayjs(date).format("YYYY-MM-DD"),
            "Daily Commission": commission,
          }))
          .sort((a, b) => dayjs(a.Date).diff(dayjs(b.Date)));

        headers = ["Date", "Daily Commission"];
        summary = {
          title: "Revenue Trend Report",
          "Total Commission": totalCommissionEarnedFormatted,
          "Total Data Points": dataToExport.length,
        };
        fileName = `Biztrack_Revenue_Trend_${dayjs().format(
          "YYYY-MM-DD_HHmmss"
        )}`; // Add time for unique filename
        break;
      } // Closing curly brace

      case 1: {
        // Added curly braces here!
        dataToExport = filteredTransactions.map((t) => ({
          "Transaction ID": t.id,
          "Business Name": t.businessName,
          "Business Type": t.businessType,
          Date: dayjs(t.date).format("YYYY-MM-DD"),
          "Commission Earned": t.commission, // Keep as number for internal calculation if needed
          "Payment Method": t.paymentMethod,
          Status: t.status,
        }));
        headers = [
          "Transaction ID",
          "Business Name",
          "Business Type",
          "Date",
          "Commission Earned",
          "Payment Method",
          "Status",
        ];
        summary = {
          title: "Transactions Report",
          "Total Commission": totalCommissionEarnedFormatted,
          "Total Transactions": totalTransactionsFormatted,
        };
        fileName = `Biztrack_Transactions_${dayjs().format(
          "YYYY-MM-DD_HHmmss"
        )}`;
        break;
      } // Closing curly brace

      case 2: {
        // Added curly braces here!
        const paymentBreakdown = filteredTransactions.reduce((acc, curr) => {
          acc[curr.paymentMethod] =
            (acc[curr.paymentMethod] || 0) + curr.commission;
          return acc;
        }, {});
        dataToExport = Object.entries(paymentBreakdown).map(
          ([name, value]) => ({
            "Payment Method": name,
            "Total Commission": value,
          })
        );

        headers = ["Payment Method", "Total Commission"];
        summary = {
          title: "Payment Breakdown Report",
          "Total Commission": totalCommissionEarnedFormatted,
        };
        fileName = `Biztrack_Payment_Breakdown_${dayjs().format(
          "YYYY-MM-DD_HHmmss"
        )}`;
        break;
      } // Closing curly brace

      case 3: {
        // Added curly braces here!
        const businessCommissions = filteredTransactions.reduce((acc, curr) => {
          acc[curr.businessName] =
            (acc[curr.businessName] || 0) + curr.commission;
          return acc;
        }, {});
        dataToExport = Object.entries(businessCommissions)
          .map(([name, commission]) => ({
            "Business Name": name,
            "Total Commission": commission,
          }))
          .sort((a, b) => b["Total Commission"] - a["Total Commission"]);

        headers = ["Business Name", "Total Commission"];
        summary = {
          title: "Business Performance Report",
          "Total Commission": totalCommissionEarnedFormatted,
          "Number of Businesses": dataToExport.length,
        };
        fileName = `Biztrack_Business_Performance_${dayjs().format(
          "YYYY-MM-DD_HHmmss"
        )}`;
        break;
      } // Closing curly brace

      default:
        break;
    }
    return { dataToExport, headers, summary, fileName };
  }, [selectedTab, filteredTransactions]); // Dependency array: Recalculate when tab or filteredTransactions change

  const handleCSVExport = () => {
    const { dataToExport, headers, fileName } = getExportData();

    if (!dataToExport || dataToExport.length === 0) {
      alert("No data to export for the current view.");
      return;
    }

    const csv = Papa.unparse(dataToExport, {
      header: true,
      columns: headers,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePDFExport = () => {
    const { dataToExport, headers, summary, fileName } = getExportData();

    if (!dataToExport || dataToExport.length === 0) {
      alert("No data to export for the current view.");
      return;
    }

    const doc = new jsPDF();
    let yPos = 14;

    // Title
    doc.setFontSize(18);
    doc.text(summary.title, 14, yPos);
    yPos += 10;

    // Export Timestamp
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Export Date: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`, 14, yPos);
    yPos += 10;
    doc.setTextColor(0); // Reset text color

    // Summary Info
    doc.setFontSize(10);
    Object.entries(summary).forEach(([key, value]) => {
      if (key !== "title") {
        doc.text(`${key}: ${value}`, 14, yPos);
        yPos += 7;
      }
    });
    yPos += 5; // Add some space before table

    // Prepare table body for jsPDF-autotable
    const tableHeaders = [headers];
    const tableBody = dataToExport.map((row) =>
      headers.map((header) => {
        if (
          typeof row[header] === "number" &&
          (header.includes("Commission") || header.includes("Total Commission"))
        ) {
          return formatKSh(row[header]);
        }
        return row[header];
      })
    );

    doc.autoTable({
      startY: yPos,
      head: tableHeaders,
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: [243, 244, 246],
        textColor: [55, 65, 81],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak",
      },
      columnStyles: {
        ...headers.reduce((acc, header, index) => {
          if (
            header.includes("Commission") ||
            header.includes("Total Commission")
          ) {
            acc[index] = { halign: "right" };
          }
          return acc;
        }, {}),
      },
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <Box
      className="
    mb-6 p-4 sm:p-5
    bg-gray-50 border border-gray-100
    rounded-2xl shadow-sm
    flex flex-col sm:flex-row
    sm:items-center gap-4
  "
    >
      {/* Date Range */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRangePicker
          localeText={{ start: "Start", end: "End" }}
          value={dateRange}
          onChange={setDateRange}
          className="w-1/2"
          slotProps={{
            textField: { size: "small", fullWidth: true, variant: "outlined" },
          }}
        />
      </LocalizationProvider>

      {/* Spacer */}
      <div className="flex-grow hidden sm:block" />

      {/* Export Buttons */}
      <Box className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <AppFormButton
          text="Export CSV"
          icon={<Upload />}
          action={handleCSVExport}
          color="#4F46E5"
          validation={true}
        />
        <AppFormButton
          text="Export PDF"
          icon={<Upload />}
          action={handlePDFExport}
          color="#4F46E5"
          validation={true}
        />
      </Box>
    </Box>
  );
};

export default ReportsControls;
