// src/views/main-app/reports/super-admin/components/TransactionsReportTable.jsx
import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import DataTable from "../../../../components/datatable";
import dayjs from "dayjs";

const formatKSh = (amount) => {
  return `KSh ${parseFloat(amount).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const TransactionsReportTable = ({ transactions }) => {
  // Custom status styles for DataTable's TablePill
  const statusStyles = {
    Completed: { backgroundColor: "bg-green-100", textColor: "text-green-800" },
    Pending: { backgroundColor: "bg-yellow-100", textColor: "text-yellow-800" },
    Failed: { backgroundColor: "bg-red-100", textColor: "text-red-800" },
  };

  const transactionTableColumns = useMemo(
    () => [
      {
        field: "id",
        label: "Transaction ID",
        minWidth: "100px",
        render: (row) => (
          <Typography variant="body2" className="font-medium text-gray-700">
            {row.id}
          </Typography>
        ),
      },
      {
        field: "businessName",
        label: "Business Name",
        minWidth: "150px",
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
        field: "date",
        label: "Date",
        minWidth: "100px",
        render: (row) => (
          <Typography variant="body2" className="text-gray-600">
            {dayjs(row.date).format("MMM D, YYYY")}
          </Typography>
        ),
      },
      {
        field: "status",
        label: "Status",
        minWidth: "100px",
        // DataTable's TablePill logic will handle rendering based on `statusField` prop
        // No custom render here as DataTable's TablePill expects to handle it
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
        field: "commission",
        label: "Commission",
        minWidth: "100px",
        render: (row) => (
          <Typography
            variant="body2"
            className="text-right font-semibold text-green-700"
          >
            {formatKSh(row.commission)}
          </Typography>
        ),
      },
    ],
    []
  ); // No dependencies for columns as they are static

  return (
    <DataTable
      data={transactions}
      columns={transactionTableColumns}
      getRowId={(row) => row.id}
      pagination={true}
      defaultRowsPerPage={10}
      rowsPerPageOptions={[5, 10, 25, 50]}
      showToolbar={false}
      statusField="status" // Pass the field name for DataTable to use TablePill
      customStatusStyles={statusStyles} // Pass the custom styles for TablePill
    />
  );
};

export default TransactionsReportTable;
