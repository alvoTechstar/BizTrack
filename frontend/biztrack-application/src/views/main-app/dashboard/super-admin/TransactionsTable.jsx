import React from "react";
import { Box, Typography } from "@mui/material";
import DataTable from "../../../../components/datatable"; // Adjust path as needed
// Assuming TablePill is also correctly imported within your DataTable or available globally if needed by DataTable
// For now, TablePill is handled by DataTable based on `statusField` and `customStatusStyles`.

// ─────────────────────────────────────────────────────────
// 1️⃣  Mock data for Transactions
// ─────────────────────────────────────────────────────────
const mockTransactionsData = [
  {
    id: "TRX001",
    businessName: "Grand Hyatt Nairobi",
    businessType: "Hotel",
    paymentMethod: "M-PESA",
    date: "2025-06-05",
    status: "Completed",
  },
  {
    id: "TRX002",
    businessName: "Mama Oliech Kiosk",
    businessType: "Kiosk",
    paymentMethod: "Cash",
    date: "2025-06-06",
    status: "Pending",
  },
  {
    id: "TRX003",
    businessName: "Aga Khan Hospital",
    businessType: "Hospital",
    paymentMethod: "Debt",
    date: "2025-06-07",
    status: "Failed",
  },
  {
    id: "TRX004",
    businessName: "Karen Butchery",
    businessType: "Butchery",
    paymentMethod: "M-PESA",
    date: "2025-06-07",
    status: "Completed",
  },
  {
    id: "TRX005",
    businessName: "Nairobi Safari Tours",
    businessType: "Tour Operator",
    paymentMethod: "Cash",
    date: "2025-06-08",
    status: "Completed",
  },
  {
    id: "TRX006",
    businessName: "Kona Mbaya Bar",
    businessType: "Bar",
    paymentMethod: "Debt",
    date: "2025-06-08",
    status: "Pending",
  },
  {
    id: "TRX007",
    businessName: "Jambo Supermarket",
    businessType: "Supermarket",
    paymentMethod: "M-PESA",
    date: "2025-06-09",
    status: "Failed",
  },
  {
    id: "TRX008",
    businessName: "Biashara Hardware",
    businessType: "Retail",
    paymentMethod: "Cash",
    date: "2025-06-09",
    status: "Completed",
  },
  {
    id: "TRX009",
    businessName: "Swift Courier Services",
    businessType: "Logistics",
    paymentMethod: "M-PESA",
    date: "2025-06-10",
    status: "Pending",
  },
  {
    id: "TRX010",
    businessName: "Afya Pharmacy",
    businessType: "Pharmacy",
    paymentMethod: "Debt",
    date: "2025-06-10",
    status: "Completed",
  },
];

// ─────────────────────────────────────────────────────────
// 2️⃣  Columns definition for TransactionsTable - Matches DataTable's expected structure
// ─────────────────────────────────────────────────────────
const columns = [
  {
    field: "id",
    label: "Transaction ID", // Use 'label' for header text
    minWidth: "120px", // Use 'minWidth' for column width
    render: (
      row // Use 'render' for custom cell content
    ) => (
      <Typography variant="body2" className="font-medium text-gray-700">
        {row.id}
      </Typography>
    ),
  },
  {
    field: "businessName",
    label: "Business Name",
    minWidth: "180px",
    render: (row) => (
      <Typography variant="body2" className="font-medium text-blue-700">
        {row.businessName}
      </Typography>
    ),
  },
  {
    field: "businessType",
    label: "Business Type",
    minWidth: "120px",
    render: (row) => (
      <Typography variant="body2" className="text-gray-600">
        {row.businessType}
      </Typography>
    ),
  },
  {
    field: "paymentMethod",
    label: "Payment Method",
    minWidth: "120px",
    render: (row) => (
      <Typography variant="body2" className="text-gray-600 capitalize">
        {row.paymentMethod}
      </Typography>
    ),
  },
  {
    field: "date",
    label: "Date",
    minWidth: "120px",
    render: (row) => (
      <Typography variant="body2" className="text-gray-600">
        {new Date(row.date).toLocaleDateString("en-KE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Typography>
    ),
  },
  {
    field: "status", // This field will be handled by DataTable's TablePill logic
    label: "Status",
    minWidth: "100px",
    render: (row) => (
      <Typography variant="body2" className="text-gray-800">
        {row.status} {/* Fallback text if TablePill doesn't render */}
      </Typography>
    ),
  },
];

const customStatusStyles = {
  Completed: { backgroundColor: "bg-green-100", textColor: "text-green-800" },
  Pending: { backgroundColor: "bg-yellow-100", textColor: "text-yellow-800" },
  Failed: { backgroundColor: "bg-red-100", textColor: "text-red-800" },
};

// ─────────────────────────────────────────────────────────
// 4️⃣  TransactionsTable Component
// ─────────────────────────────────────────────────────────
const TransactionsTable = () => {
  return (
    <div>
      <DataTable
        title="All Biztrack Transactions"
        data={mockTransactionsData}
        columns={columns}
        getRowId={(row) => row.id}
        pagination={true}
        defaultRowsPerPage={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        showToolbar={false}
        statusField="status"
        customStatusStyles={customStatusStyles}
      />
    </div>
  );
};

export default TransactionsTable;
