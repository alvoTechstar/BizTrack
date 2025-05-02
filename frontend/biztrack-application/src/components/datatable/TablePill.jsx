import React from 'react';
import { Chip } from '@mui/material';

export default function TablePill({ status }) {
  const colorMap = {
    Completed: 'success',
    Pending: 'warning',
    Failed: 'error',
  };

  return (
    <Chip
      label={status}
      size="small"
      color={colorMap[status] || 'default'}
      variant="outlined"
    />
  );
}
