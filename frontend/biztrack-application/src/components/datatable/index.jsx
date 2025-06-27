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
} from "@mui/material";
import "../../index.css";

// Import custom reusable components
import TablePill from "./TablePill";
import TableAction from "./TableAction";
import TablePagination from "./TablePagination";
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
  const rowsPerPage = 5; // Fixed at 5 rows per page

  useEffect(() => {
    if (data.length > 0 && page * rowsPerPage >= data.length) {
      setPage(0);
    }
  }, [data, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const getActionsForRow = (row) => {
    let actions = [];
    if (statusField && row[statusField] !== undefined) {
      const status = row[statusField];
      actions = statusActionMap[status] || [];
    }

    if (actions.length === 0 && statusActionMap.default) {
      actions = statusActionMap.default;
    }
    return actions;
  };

  const handleInternalAction = (actionKey, row) => {
    onAction(actionKey, row);
  };

  const filteredData = useMemo(() => {
    let currentData = data;

    if (filterValue && filterValue !== "all") {
      currentData = currentData.filter((row) => row.service === filterValue);
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentData = currentData.filter((row) =>
        columns.some((column) => {
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

  const paginatedData = useMemo(() => {
    if (!pagination) {
      return filteredData;
    }
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, page, rowsPerPage, pagination]);

  const hasData = filteredData && filteredData.length > 0;

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
            <SearchInput
              id="data-table-search"
              placeholder="Search..."
              input={searchTerm}
              handleInput={onSearchChange}
              handleClear={() => onSearchChange("")}
            />

            {filterOptions.length > 0 && (
              <div className="">
                <SelectInput
                  id="data-table-filter"
                  name="data-table-filter"
                  options={[{ value: "all", label: "All" }, ...filterOptions]}
                  value={filterValue}
                  onChange={onFilterChange}
                  displayEmpty
                  size="small"
                  className="w-full sm:w-48"
                />
              </div>
            )}
          </Box>
        )}
      </div>

      <TableContainer className="rounded-lg overflow-x-auto">
        <Table
          stickyHeader
          aria-label="biztrack data table"
          className="min-w-full"
        >
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#f3f4f6",
                borderTop: "1px solid #e5e7eb",
                "& .MuiTableCell-head": {
                  backgroundColor: "inherit",
                  borderBottom: "1px solid #e5e7eb",
                },
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.field || column.label}
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#374151",
                    whiteSpace: "nowrap",
                    px: 2,
                    py: 1.5,
                    minWidth: column.minWidth || "auto",
                  }}
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
                      key={column.field || `col-${colIndex}`}
                      className="px-2 py-1.5 border-b border-gray-100 text-gray-800 align-top text-xs"
                      sx={
                        column.isActionColumn
                          ? { display: "flex", alignItems: "center", gap: 1 }
                          : {}
                      }
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

      {pagination && filteredData.length > 0 && (
        <TablePagination
          count={filteredData.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
        />
      )}
    </Paper>
  );
};

export default DataTable;