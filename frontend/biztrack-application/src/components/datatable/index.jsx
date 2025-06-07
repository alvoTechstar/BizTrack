import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField, // Added for search input
  Select, // Added for filter dropdown
  MenuItem, // Added for filter options
  InputAdornment, // For search icon
  IconButton, // For clear search
} from "@mui/material";
import "../../index.css"; 

// Import custom reusable components
import TablePill from "./TablePill";
import TableAction from "./TableAction";
import TablePagination from "./TablePagination";
import TableModal from "./TableModal";
import SelectInput from "../input/SelectInput";
import SearchInput from "../input/SearchInput";

const DataTable = ({
  columns,
  data,
  statusField,
  statusActionMap = {},
  customStatusStyles = {},
  customActionConfigs = {},
  onAction = () => {},
  rowsPerPageOptions = [5, 10, 25, 50],
  defaultRowsPerPage = 10,
  pagination = true,
  title,
  showToolbar = false,
  searchTerm = "",
  onSearchChange = () => {},
  filterOptions = [],
  filterValue = "",
  onFilterChange = () => {},
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Effect to reset page to 0 if data changes or if the current page becomes out of bounds
  useEffect(() => {
    if (data.length > 0 && page * rowsPerPage >= data.length) {
      setPage(0);
    }
  }, [data, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page changes
  };

  const handleOpenModal = (row) => {
    setModalContent(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalContent(null);
  };

  // Determines which actions are available for a given row based on its status
  const getActionsForRow = (row) => {
    const status = statusField ? row[statusField] : null;
    return statusActionMap[status] || [];
  };

  // Internal handler for actions, allowing 'view' to open the modal
  const handleInternalAction = (actionKey, row) => {
    if (actionKey === "view") {
      handleOpenModal(row); // Open the built-in modal for 'view' action
    }
    // Always call the external onAction prop for further custom logic
    onAction(actionKey, row);
  };

  // --- Filtering and Searching Logic ---
  const filteredData = useMemo(() => {
    let currentData = data;

    // Apply filter first
    if (filterValue && filterValue !== "all") {
      // Assuming 'all' is a reset value
      // This example filters by a 'type' field. Adjust as needed.
      currentData = currentData.filter((row) => row.type === filterValue);
    }

    // Then apply search
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentData = currentData.filter((row) =>
        columns.some((column) => {
          // Skip action column and columns without a field
          if (column.isActionColumn || !column.field) return false;

          const value = row[column.field];
          if (typeof value === "string" || typeof value === "number") {
            return String(value).toLowerCase().includes(lowerCaseSearchTerm);
          }
          return false;
        })
      );
    }
    return currentData;
  }, [data, filterValue, searchTerm, columns]);

  // Memoize paginated data to avoid re-calculating on every render
  const paginatedData = useMemo(() => {
    if (!pagination) {
      return filteredData; // Return all filtered data if pagination is disabled
    }
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, page, rowsPerPage, pagination]);

  const hasData = filteredData && filteredData.length > 0; // Check filteredData for 'No data available' message

  return (
    <Paper elevation={3} className="p-4 rounded-lg shadow-md bg-white">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        {title && (
          <Typography
            variant="h5"
            component="h2"
            className="mb-1 text-gray-800 font-semibold ml-10"
          >
            {title}
          </Typography>
        )}
        {showToolbar && (
          <Box className="flex flex-wrap gap-4 items-center justify-end mr-30">
            {/* Use your custom SearchInput component */}
            <SearchInput
              id="data-table-search"
              placeholder="Search..."
              input={searchTerm}
              handleInput={onSearchChange} // Directly pass onSearchChange
              handleClear={() => onSearchChange("")} // Pass empty string to clear search
            />

            {filterOptions.length > 0 && (
              // Use your custom SelectInput component
              <div className="">
                <SelectInput
                  id="data-table-filter"
                  name="data-table-filter"
                  options={[{ value: "", label: "All" }, ...filterOptions]} // Add "All" option to your filterOptions
                  value={filterValue}
                  onChange={(e) => onFilterChange(e.target.value)} // Pass onChange handler
                  displayEmpty // Prop to show placeholder/first option when no value selected
                  size="small" // Assuming your SelectInput supports size
                  className="w-full sm:w-48" // Tailwind for width. Adjust or remove if SelectInput handles its own width
                />
              </div>
            )}

            {/* You can add more buttons/filters here */}
          </Box>
        )}
      </div>

      <TableContainer className="rounded-lg overflow-x-auto">
        <Table
          stickyHeader
          aria-label="biztrack data table"
          className="min-w-full"
        >
          {/* Apply background and top border here */}
          <TableHead>
            <TableRow className="bg-gray-100 border-t border-gray-200">
              {" "}
              {/* This line applies the background */}
              {columns.map((column) => (
                <TableCell
                  key={column.field || column.label}
                  className="text-sm font-semibold text-gray-700 whitespace-nowrap px-2 py-1.5 border-b border-gray-200"
                  style={{ minWidth: column.minWidth || "auto" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!hasData ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-xs font-medium text-center p-3 text-gray-500"
                >
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={row.id || rowIndex}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={column.field || `col-${colIndex}`} // Unique key for cell
                      // Reduced padding further to 'px-2 py-1.5' for body cells
                      className="px-2 py-1.5 border-b border-gray-100 text-gray-800 align-top text-xs"
                    >
                      {column.render ? (
                        column.render(row)
                      ) : column.field === statusField ? (
                        <TablePill
                          status={row[statusField]}
                          customStyles={customStatusStyles}
                        />
                      ) : column.isActionColumn ? (
                        <TableAction
                          actions={getActionsForRow(row)}
                          row={row}
                          onAction={handleInternalAction}
                          customActionConfigs={customActionConfigs}
                        />
                      ) : (
                        <Typography variant="body2" className="text-gray-800">
                          {String(row[column.field] || "")}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination &&
        filteredData.length > 0 && ( // Only show pagination if there's filtered data
          <TablePagination
            count={filteredData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        )}

      {/* TableModal is rendered conditionally when openModal is true */}
      <TableModal
        open={openModal}
        onClose={handleCloseModal}
        title="Record Details"
        content={modalContent}
      />
    </Paper>
  );
};

export default DataTable;
