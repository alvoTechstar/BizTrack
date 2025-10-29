import React from "react";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import NotInterestedRoundedIcon from "@mui/icons-material/NotInterestedRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import LocalPrintshopRoundedIcon from "@mui/icons-material/LocalPrintshopRounded";
import "./table.css";

export default function TableActions({ status, actions, action, id }) {
  const handleClick = (e, clickAction) => {
    e.preventDefault();
    e.stopPropagation();
    action(clickAction, id);
  };

  return (
    <div className="table-actions">
      {(status === "ACTIVE" && actions[0] !== "View") ||
      status === "BLACKLISTED" ||
      status === "EXCEPTIONAL_BLACKLIST" ||
      (status === "NOT_BLACKLISTED" && actions.includes("Edit")) ? (
        <BorderColorRoundedIcon onClick={(e) => handleClick(e, "edit")} />
      ) : (
        <VisibilityRoundedIcon onClick={(e) => handleClick(e, "view")} />
      )}
      {status === "ACTIVE" && actions.includes("Disable") ? (
        <NotInterestedRoundedIcon
          onClick={(e) => handleClick(e, "IN_ACTIVE")}
        />
      ) : null}
      {status === "IN_ACTIVE" && actions.includes("Disable") ? (
        <DoneRoundedIcon onClick={(e) => handleClick(e, "ACTIVE")} />
      ) : null}
      {actions.includes("Delete") ? (
        <DeleteOutlineRoundedIcon onClick={(e) => handleClick(e, "DELETED")} />
      ) : null}
      {actions.includes("Print") ? (
        <LocalPrintshopRoundedIcon onClick={(e) => handleClick(e, "PRINT")} />
      ) : null}
    </div>
  );
}
