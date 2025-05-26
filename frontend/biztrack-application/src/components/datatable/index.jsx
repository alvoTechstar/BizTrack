import React from "react";
import PropTypes from "prop-types";

const DataTable = ({ columns = [], data = [], renderActions, renderCell }) => {
  return (
    <div className="overflow-x-auto border border-gray-300 rounded-md bg-white">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col, index) => (
              <th
                key={index}
                className="border-b border-gray-200 px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
            {renderActions && (
              <th className="border-b border-gray-200 px-4 py-2 text-left font-medium text-gray-700">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
                className="text-center px-4 py-6 text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 border-b border-gray-100"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 max-w-xs truncate whitespace-nowrap"
                    title={
                      typeof row[col.field] === "string" &&
                      row[col.field].length > 30
                        ? row[col.field]
                        : undefined
                    }
                  >
                    {renderCell ? renderCell(row, col) : row[col.field]}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-4 py-2">{renderActions(row)}</td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  renderActions: PropTypes.func,
  renderCell: PropTypes.func,
};

export default DataTable;
