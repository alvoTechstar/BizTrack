import React from "react";
import { Box, Typography } from "@mui/material";
import DataTable from "../../../../components/datatable";
// ─────────────────────────────────────────────────────────
// 1️⃣  Mock data for Revenue
// ─────────────────────────────────────────────────────────
const mockRevenueData = [
  {
    id: "TXN001",
    businessName: "Grand Hyatt Nairobi",
    businessType: "Hotel",
    date: "2025-06-05",
    commissionEarned: 250.0,
  },
  {
    id: "TXN002",
    businessName: "Mama Oliech Kiosk",
    businessType: "Kiosk",
    date: "2025-06-06",
    commissionEarned: 15.5,
  },
  {
    id: "TXN003",
    businessName: "Aga Khan Hospital",
    businessType: "Hospital",
    date: "2025-06-07",
    commissionEarned: 75.25,
  },
  {
    id: "TXN004",
    businessName: "Karen Butchery",
    businessType: "Butchery",
    date: "2025-06-07",
    commissionEarned: 12.0,
  },
  {
    id: "TXN005",
    businessName: "Nairobi Safari Tours",
    businessType: "Tour Operator",
    date: "2025-06-08",
    commissionEarned: 50.0,
  },
  {
    id: "TXN006",
    businessName: "Kona Mbaya Bar",
    businessType: "Bar",
    date: "2025-06-08",
    commissionEarned: 8.75,
  },
  {
    id: "TXN007",
    businessName: "Jambo Supermarket",
    businessType: "Supermarket",
    date: "2025-06-09",
    commissionEarned: 35.0,
  },
];

// ─────────────────────────────────────────────────────────
// 2️⃣  Define headers in the format your DataTable expects
// ─────────────────────────────────────────────────────────
const headers = [
  { key: "id", title: "Transaction ID" },
  { key: "businessName", title: "Business Name" },
  { key: "businessType", title: "Business Type" },
  { key: "date", title: "Date" },
  { key: "commissionEarned", title: "Commission Earned" },
];

// ─────────────────────────────────────────────────────────
// 3️⃣  RevenueTable Component
// ─────────────────────────────────────────────────────────
const RevenueTable = () => {
  return (
    <Box>
      <DataTable
        data={mockRevenueData}
        headers={headers}
        type="default"
        pagination={true}
        searchFilter="" // if you need search functionality
        actions={["view"]} // if you need action buttons
        selected={[]} // for row selection
        selectAll={false}
        // Callback functions your DataTable needs
        selectedRow={(e, row) => console.log("Row selected:", row)}
        selectedAction={(selected) => console.log("Selected actions:", selected)}
        actionSelected={(action, id) => console.log("Action:", action, "ID:", id)}
      />
    </Box>
  );
};

export default RevenueTable;