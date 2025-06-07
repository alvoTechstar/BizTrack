// src/components/DataTable/TableModal.jsx
import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Reusable modal component to display detailed content of a table row.
 * @param {object} props
 * @param {boolean} props.open - Whether the modal is open.
 * @param {function(): void} props.onClose - Callback to close the modal.
 * @param {string} props.title - Title for the modal.
 * @param {object} props.content - The data object to display in the modal.
 */
const TableModal = ({ open, onClose, title, content }) => {
  if (!content) {
    return null; // Don't render if no content is provided
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className="flex items-center justify-center p-4" // Tailwind for centering the modal
    >
      <Box className="relative bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <IconButton
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-title" variant="h5" component="h2" className="mb-4 text-gray-800">
          {title}
        </Typography>
        <Box id="modal-description" className="space-y-2">
          {/* Iterates over the content object and displays key-value pairs */}
          {Object.entries(content).map(([key, value]) => (
            <Box key={key} className="flex items-start text-sm">
              <Typography component="span" className="font-semibold w-1/3 text-gray-600 pr-2">
                {/* Converts camelCase keys to Title Case for better readability */}
                {key.replace(/([A-Z])/g, ' $1').trim().replace(/\s+/g, ' ').toUpperCase()}:
              </Typography>
              <Typography component="span" className="w-2/3 text-gray-800 break-words">
                {/* Handles object values by stringifying them, otherwise displays as string */}
                {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default TableModal;