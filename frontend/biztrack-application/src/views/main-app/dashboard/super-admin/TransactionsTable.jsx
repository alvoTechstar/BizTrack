import React from "react";
import { Box, Typography } from "@mui/material";
import DataTable from "../../../../components/datatable";
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
];

// ─────────────────────────────────────────────────────────
// 2️⃣  Define headers in the format your DataTable expects
// ─────────────────────────────────────────────────────────
const headers = [
  { key: "id", title: "Transaction ID" },
  { key: "businessName", title: "Business Name" },
  { key: "businessType", title: "Business Type" },
  { key: "paymentMethod", title: "Payment Method" },
  { key: "date", title: "Date" },
  { key: "status", title: "Status" },
];

// ─────────────────────────────────────────────────────────
// 3️⃣  TransactionsTable Component
// ─────────────────────────────────────────────────────────
const TransactionsTable = () => {
  return (
    <Box>
      <DataTable
        data={mockTransactionsData}
        headers={headers}
        type="default" // or whatever type your DataTable supports
        pagination={true}
        // Add any other props your DataTable component expects
        searchFilter="" // if you need search functionality
        actions={["view", "edit"]} // if you need action buttons
        selected={[]} // for row selection
        selectAll={false}
        // Callback functions your DataTable might need
        selectedRow={(e, row) => console.log("Row selected:", row)}
        selectedAction={(selected) => console.log("Selected actions:", selected)}
        actionSelected={(action, id) => console.log("Action:", action, "ID:", id)}
      />
    </Box>
  );
};

export default TransactionsTable;