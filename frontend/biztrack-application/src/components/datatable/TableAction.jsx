import React from "react";
import { IconButton, Tooltip, Box, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const TableAction = ({ actions, row, onAction, customActionConfigs = {} }) => {
  const defaultIconMap = {
    view: <VisibilityIcon fontSize="small" />,
    edit: <EditIcon fontSize="small" />,
    delete: <DeleteIcon fontSize="small" />,
    print: <PrintIcon fontSize="small" />,
    more: <MoreHorizIcon fontSize="small" />,
  };

  const getActionConfig = (actionKey) => {
    // Get default config
    const defaultConfig = {
      icon: defaultIconMap[actionKey] || defaultIconMap.more,
      tooltip: actionKey
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      label: actionKey
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      variant: undefined,
      size: "small",
    };

    // Merge with custom config if exists
    const customConfig = customActionConfigs[actionKey] || {};

    return {
      ...defaultConfig,
      ...customConfig,
      // Ensure icon is properly formatted
      icon: React.isValidElement(customConfig.icon)
        ? customConfig.icon
        : defaultConfig.icon,
    };
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {actions.map((actionKey) => {
        const { icon, tooltip, label, variant, ...rest } =
          getActionConfig(actionKey);

        return (
          <Tooltip title={tooltip} key={actionKey}>
            {variant ? (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(actionKey, row);
                }}
                startIcon={icon}
                size="small"
                variant={variant}
                {...rest}
              >
                {label}
              </Button>
            ) : (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(actionKey, row);
                }}
                aria-label={label}
                size="small"
                {...rest}
              >
                {icon}
              </IconButton>
            )}
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default TableAction;
