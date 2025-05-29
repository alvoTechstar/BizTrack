// TablePill.jsx
import React from 'react';
import { Chip } from '@mui/material';

export default function TablePill({ status, statusConfig }) {
  return (
    <Chip
      label={statusConfig?.label || status}
      size="small"
      color={statusConfig?.color || 'default'}
      icon={statusConfig?.icon || null}
      variant="outlined"
    />
  );
}
