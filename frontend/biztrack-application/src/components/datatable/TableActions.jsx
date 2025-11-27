import React from "react";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import NotInterestedRoundedIcon from "@mui/icons-material/NotInterestedRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import LocalPrintshopRoundedIcon from "@mui/icons-material/LocalPrintshopRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded"; // ADD FOR RESTOCK
import "./table.css";

export default function TableActions({ status, actions, action, id }) {
  // FIX: Add safe defaults for actions array
  const safeActions = Array.isArray(actions) ? actions : [];
  const safeStatus = (status || '').toUpperCase();

  const handleClick = (e, clickAction) => {
    e.preventDefault();
    e.stopPropagation();
    if (action) {
      action(clickAction, id);
    }
  };

  // Business-specific action logic
  const getBusinessActions = () => {
    switch (safeStatus) {
      case 'ACTIVE':
        return ['edit', 'disable', 'delete'];
      case 'NEW':
        return ['view', 'delete'];
      case 'INACTIVE':
        return ['view', 'enable', 'delete'];
      default:
        return ['view', 'delete'];
    }
  };

  // ADD PRODUCT ACTIONS
  const getProductActions = () => {
    // Products get these actions regardless of status
    return ['view', 'restock', 'edit', 'delete'];
  };

  // Use provided actions or fall back to appropriate logic based on context
  const effectiveActions = safeActions.length > 0 ? safeActions : 
    (safeStatus.includes('STOCK') ? getProductActions() : getBusinessActions());

  return (
    <div className="table-actions">
      {/* ADD RESTOCK ACTION */}
      {effectiveActions.includes('restock') && (
        <AddCircleOutlineRoundedIcon 
          onClick={(e) => handleClick(e, "restock")}
          title="Restock"
          className="action-icon"
        />
      )}
      
      {/* KEEP ALL EXISTING ACTIONS */}
      {effectiveActions.includes('edit') ? (
        <BorderColorRoundedIcon 
          onClick={(e) => handleClick(e, "edit")}
          title="Edit"
          className="action-icon"
        />
      ) : effectiveActions.includes('view') ? (
        <VisibilityRoundedIcon 
          onClick={(e) => handleClick(e, "view")}
          title="View"
          className="action-icon"
        />
      ) : null}
      
      {effectiveActions.includes('disable') && (
        <NotInterestedRoundedIcon
          onClick={(e) => handleClick(e, "disable")}
          title="Disable"
          className="action-icon"
        />
      )}
      
      {effectiveActions.includes('enable') && (
        <DoneRoundedIcon 
          onClick={(e) => handleClick(e, "enable")}
          title="Enable"
          className="action-icon"
        />
      )}
      
      {effectiveActions.includes('delete') && (
        <DeleteOutlineRoundedIcon 
          onClick={(e) => handleClick(e, "delete")}
          title="Delete"
          className="action-icon"
        />
      )}
      
      {effectiveActions.includes('print') && (
        <LocalPrintshopRoundedIcon 
          onClick={(e) => handleClick(e, "print")}
          title="Print"
          className="action-icon"
        />
      )}
    </div>
  );
}