import React, { useState } from "react";
import { Box } from "@mui/material";
import TableAction from "./TableAction";
import TablePill from "./TablePill";
import TablePagination from "./TablePagination";
import TableModal from "./TableModal";
import {
  statusStyles,
  actionConfigs,
  defaultStatusActionMap,
} from "./TableConfig";

const DataTable = ({
  columns,
  data,
  statusField = "status",
  statusActionMap = defaultStatusActionMap,
  customStatusStyles = {},
  customActionConfigs = {},
  onAction,
  pagination = true,
  rowsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  // Merge custom configurations with defaults
  const mergedStatusStyles = { ...statusStyles, ...customStatusStyles };
  const mergedActionConfigs = { ...actionConfigs, ...customActionConfigs };

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = pagination
    ? data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : data;

  const handleAction = (actionKey, row) => {
    if (onAction) {
      onAction(actionKey, row);
    } else {
      // Default fallback actions
      if (actionKey === "view") {
        setOpenModal(true);
      }
    }
  };

  return (
    <Box className="overflow-x-auto border border-gray-300 rounded-md bg-white p-3">
      <table className="min-w-full table-auto border-collapse">
        {/* Table header remains the same */}
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 2}
                className="text-center px-4 py-6 text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            paginatedData.map((row) => {
              const status = row[statusField];
              const rowActions = statusActionMap[status] || [];
              const statusConfig = mergedStatusStyles[status];

              return (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 border-b border-gray-100"
                >
                  {columns.map((col) => (
                    <td
                      key={col.field}
                      className="px-4 py-2 max-w-xs truncate whitespace-nowrap"
                    >
                      {row[col.field]}
                    </td>
                  ))}
                  <td className="px-4 py-2">
                    <TablePill status={status} statusConfig={statusConfig} />
                  </td>
                  <td className="px-4 py-2">
                    <TableAction
                      actionsToShow={rowActions}
                      actionConfigs={mergedActionConfigs}
                      onAction={(actionKey) => handleAction(actionKey, row)}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {pagination && data.length > rowsPerPage && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <TableModal
        open={openModal}
        setOpen={setOpenModal}
        title="Details"
        description="Detailed information:"
      >
        {/* Modal content remains the same */}
      </TableModal>
    </Box>
  );
};

export default DataTable;
