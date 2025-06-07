// src/components/DataTable/TablePagination.jsx
import React from "react";
import { TablePagination as MuiTablePagination } from "@mui/material";

/**
 * Reusable component for table pagination.
 * @param {object} props
 * @param {number} props.count - Total number of rows.
 * @param {number} props.page - The current page number (0-indexed).
 * @param {number} props.rowsPerPage - The number of rows per page.
 * @param {function(object, number): void} props.onPageChange - Callback for page change.
 * @param {function(object): void} props.onRowsPerPageChange - Callback for rows per page change.
 * @param {number[]} [props.rowsPerPageOptions=[5, 10, 25, 50]] - Array of options for rows per page.
 */
const TablePagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50], // Default options
}) => {
  return (
    <MuiTablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component="div" // Render as a div
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      className="bg-white" // Ensures consistent background
    />
  );
};

export default TablePagination;
