import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PaidIcon from '@mui/icons-material/Paid';
import PrintIcon from '@mui/icons-material/Print';

export const statusStyles = {
  Paid: { color: 'success', label: 'Paid', icon: '✓' },
  Pending: { color: 'warning', label: 'Pending', icon: '⏳' },
  Failed: { color: 'error', label: 'Failed', icon: '✗' },
  Completed: { color: 'success', label: 'Completed', icon: '✓' },
  Draft: { color: 'default', label: 'Draft', icon: '✎' },
  // Add more statuses as needed
};

export const actionConfigs = {
  view: { icon: <VisibilityIcon fontSize="small" />, color: 'primary', label: 'View' },
  edit: { icon: <EditIcon fontSize="small" />, color: 'success', label: 'Edit' },
  delete: { icon: <DeleteIcon fontSize="small" />, color: 'error', label: 'Delete' },
  pay: { icon: <PaidIcon fontSize="small" />, color: 'secondary', label: 'Pay' },
  print: { icon: <PrintIcon fontSize="small" />, color: 'info', label: 'Print' },
  // Add more actions as needed
};

export const defaultStatusActionMap = {
  Paid: ['view', 'print'],
  Pending: ['pay'],
  Failed: ['view', 'edit', 'delete'],
  Completed: ['view', 'print'],
  Draft: ['edit', 'delete'],
  // Map more statuses as needed
};
