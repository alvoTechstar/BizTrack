import React from 'react';
import { CircularProgress } from "@mui/material";

export default function TextButton({
  alignment = "left",
  text,
  actionText,
  action,
  isLoading,
  color,
}) {
  return (
    <div className={`w-full text-${alignment} text-sm`}>
      <span className="text-gray-700">{text}</span>{" "}
      {isLoading ? (
        <CircularProgress
          style={{ color: "#1f2937" }} // Tailwind's gray-800
          size={16}
          thickness={5}
        />
      ) : (
        <span
          className={`cursor-pointer font-medium hover:underline ${
            color ? "" : "text-blue-600"
          }`}
          style={color ? { color: color } : {}}
          onClick={action}
        >
          {actionText}
        </span>
      )}
    </div>
  );
}
