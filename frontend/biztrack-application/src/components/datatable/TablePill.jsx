// src/components/DataTable/TablePill.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Reusable component to display status indicators with customizable colors.
 * @param {object} props
 * @param {string} props.status - The status string to display.
 * @param {object} props.customStyles - An object mapping status values to Tailwind CSS classes for background and text color.
 */
const TablePill = ({ status, customStyles }) => {
  // Fallback styles for unknown statuses
  const defaultStyles = "bg-gray-200 text-gray-800";

  // Determine specific styles based on the status provided by props
  const statusSpecificStyles = customStyles?.[status] || defaultStyles;

  return (
    <Box
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusSpecificStyles}`}
    >
      <Typography variant="caption" component="span" className="capitalize">
        {status}
      </Typography>
    </Box>
  );
};

export default TablePill;