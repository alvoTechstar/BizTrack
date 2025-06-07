import React from "react";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import "./toaster.css";

export default function Toaster({
  open,
  state,
  title,
  message,
  action,
  position,
}) {
  const vertical = "top";
  let horizontal = position;

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      anchorOrigin={{ vertical, horizontal }}
      onClose={() => action(false)}
      key={vertical + horizontal}
    >
      <div
        className={
          state
            ? state === "true"
              ? "toaster-container toaster-success"
              : "toaster-container toaster-error"
            : "toaster-container toaster-warning"
        }
      >
        {state ? (
          state === "true" ? (
            <CheckCircleRoundedIcon color="success" />
          ) : (
            <ErrorRoundedIcon color="error" />
          )
        ) : null}
        <div className="toaster-content">
          <span className="toaster-title">{title}</span>
          <span>{message}</span>
        </div>
      </div>
    </Snackbar>
  );
}
