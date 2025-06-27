import React from "react";
import { Box, Typography } from "@mui/material";
import DataTable from "../../../../components/datatable"; // Adjust path as needed

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
// 2️⃣  Columns definition for RevenueTable - NOW MATCHING BusinessTable's structure EXACTLY
// ─────────────────────────────────────────────────────────
const columns = [
  {
    field: "id",
    label: "Transaction ID", // Changed to 'label'
    minWidth: "120px", // Changed to 'minWidth'
    render: (row) => ( // Changed to 'render' and uses 'row' directly
      <Typography variant="body2" className="font-medium text-gray-700">
        {row.id}
      </Typography>
    ),
  },
  {
    field: "businessName",
    label: "Business Name", // Changed to 'label'
    minWidth: "180px", // Changed to 'minWidth'
    render: (row) => ( // Changed to 'render'
      <Typography variant="body2" className="font-medium text-blue-700">
        {row.businessName}
      </Typography>
    ),
  },
  {
    field: "businessType",
    label: "Business Type", // Changed to 'label'
    minWidth: "120px", // Changed to 'minWidth'
    render: (row) => ( // Changed to 'render'
      <Typography variant="body2" className="text-gray-600">
        {row.businessType}
      </Typography>
    ),
  },
  {
    field: "date",
    label: "Date", // Changed to 'label'
    minWidth: "120px", // Changed to 'minWidth'
    render: (row) => ( // Changed to 'render'
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
    field: "commissionEarned",
    label: "Commission Earned", // Changed to 'label'
    minWidth: "150px", // Changed to 'minWidth'
    render: (row) => ( // Changed to 'render'
      <Typography
        variant="body2"
        className="text-right font-semibold text-green-700"
      >
        {typeof row.commissionEarned === "number"
          ? `KSh ${row.commissionEarned.toLocaleString("en-KE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : "N/A"}
      </Typography>
    ),
    // Removed `align` and `headerAlign` as these are MUI X DataGrid specific.
    // You might need to handle alignment within the `render` function's Typography component.
  },
];

// ─────────────────────────────────────────────────────────
// 3️⃣  RevenueTable Component
// ─────────────────────────────────────────────────────────
const RevenueTable = () => {
  return (
    <div>
      <DataTable
        title="Biztrack Revenue Transactions"
        data={mockRevenueData}
        columns={columns}
        getRowId={(row) => row.id}
        pagination={true}
        defaultRowsPerPage={10}
        rowsPerPageOptions={[5, 10, 25]}
        showToolbar={false}
       
      />
    </div>
  );
};

export default RevenueTable;
