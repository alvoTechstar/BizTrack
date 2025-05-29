// TableAction.jsx
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { actionConfigs } from './TableConfig';

export default function TableAction({
  actionsToShow = [], // ['view', 'edit', ...]
  onView,
  onEdit,
  onDelete,
  onPay,
  onPrint,
}) {
  const handlers = { view: onView, edit: onEdit, delete: onDelete, pay: onPay, print: onPrint };

  return (
    <>
      {actionsToShow.map((action) => {
        const config = actionConfigs[action];
        if (!config) return null;
        return (
          <Tooltip title={config.label} key={action}>
            <IconButton
              onClick={handlers[action]}
              size="small"
              color={config.color}
            >
              {config.icon}
            </IconButton>
          </Tooltip>
        );
      })}
    </>
  );
}
