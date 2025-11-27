import React from "react";
import CircleIcon from "@mui/icons-material/Circle";
import "./table.css";
import {
  formatPill,
  formatPillOutbound,
} from "../../utilities/SharedFunctions";

export default function TablePill({ state, page }) {
  // Ensure state is treated as a string
  const stateString = String(state || '');
  
  // ADD PRODUCT STATUS CLASSIFICATION
  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    
    // PRODUCT STATUSES - ADD THESE
    if (statusLower.includes('in stock')) return "table-pill green";
    if (statusLower.includes('low stock')) return "table-pill orange";
    if (statusLower.includes('out of stock')) return "table-pill red";
    
    // KEEP ALL EXISTING STATUS LOGIC
    if (statusLower === "pending" ||
        statusLower === "new" ||
        statusLower === "received" ||
        statusLower === "draft" ||
        statusLower === "processing" ||
        statusLower === "approvalpending" ||
        statusLower === "pending approval" ||
        statusLower === "draft/pending approval") {
      return "table-pill orange";
    } else if (statusLower === "active" ||
               statusLower === "success" ||
               statusLower === "paid" ||
               statusLower === "sent" ||
               statusLower === "approved" ||
               statusLower === "posted" ||
               statusLower === "readyforpayout") {
      return "table-pill green";
    } else {
      return "table-pill red";
    }
  };

  // ADD PRODUCT STATUS FORMATTING
  const formatDisplayStatus = (status) => {
    const statusLower = status.toLowerCase();
    
    // PRODUCT STATUS DISPLAY - ADD THESE
    if (statusLower.includes('in stock')) return 'In Stock';
    if (statusLower.includes('low stock')) return 'Low Stock';
    if (statusLower.includes('out of stock')) return 'Out of Stock';
    
    // KEEP EXISTING FORMATTING
    return page === "outbound" ? formatPillOutbound(status) : formatPill(status);
  };

  return (
    <div className={getStatusClass(stateString)}>
      <CircleIcon />
      {formatDisplayStatus(stateString)}
    </div>
  );
}