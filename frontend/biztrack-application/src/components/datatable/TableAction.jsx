// src/components/DataTable/TableAction.jsx
import React from "react";
import { IconButton, Tooltip, Box } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"; // Generic icon for unknown actions

/**
 * Reusable component to display action buttons for a table row.
 * @param {object} props
 * @param {string[]} props.actions - An array of action keys available for the current row (e.g., ['view', 'edit']).
 * @param {object} props.row - The data object for the current row.
 * @param {function(string, object): void} props.onAction - Callback function when an action is triggered.
 * @param {object} props.customActionConfigs - Object mapping action keys to icon, label, and tooltip.
 */
const TableAction = ({ actions, row, onAction, customActionConfigs }) => {
  // Default icons for common actions, used if not overridden by customActionConfigs
  const defaultIconMap = {
    view: VisibilityIcon,
    edit: EditIcon,
    delete: DeleteIcon,
    print: PrintIcon,
    more: MoreHorizIcon,
  };

  // Helper to get action configuration, falling back to defaults
  const getConfig = (actionKey) => {
    return (
      customActionConfigs?.[actionKey] || {
        icon: defaultIconMap[actionKey] || MoreHorizIcon, // Fallback to MoreHorizIcon if no specific icon
        label: actionKey.charAt(0).toUpperCase() + actionKey.slice(1), // Capitalize the action key for label
        tooltip: actionKey.charAt(0).toUpperCase() + actionKey.slice(1), // Capitalize for tooltip
      }
    );
  };

  return (
    <Box className="flex items-center space-x-1">
      {actions.map((actionKey) => {
        const { icon: IconComponent, label, tooltip } = getConfig(actionKey);
        return (
          <Tooltip title={tooltip} key={actionKey}>
            <IconButton
              onClick={() => onAction(actionKey, row)}
              aria-label={label}
              size="small"
              className="text-gray-600 hover:text-blue-500" // Tailwind for subtle hover effect
            >
              <IconComponent fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default TableAction;
