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
  
  return (
    <div
      className={
        stateString === "PENDING" ||
        stateString === "NEW" ||
        stateString === "RECEIVED" ||
        stateString === "Draft" ||
        stateString === "Processing" ||
        stateString === "ApprovalPending" ||
        stateString === "Pending Approval" ||
        stateString === "Draft/Pending Approval"
          ? ["table-pill orange"]
          : stateString === "ACTIVE" ||
            stateString === "SUCCESS" ||
            stateString === "PAID" ||
            stateString === "Paid" ||
            stateString === "Sent" ||
            stateString === "APPROVED" ||
            stateString === "Posted" ||
            stateString === "ReadyForPayout"
          ? ["table-pill green"]
          : ["table-pill red"]
      }
    >
      <CircleIcon />
      {page && page === "outbound"
        ? formatPillOutbound(stateString)
        : formatPill(stateString)}
    </div>
  );
}