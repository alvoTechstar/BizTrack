import React from "react";
export default function AppFormButton({
  text,
  color,
  isLoading,
  validation,
  action,
}) {
  return (
    <button
      className={`w-full rounded-lg flex items-center justify-center h-[45px] px-6 py-4 text-sm font-semibold transition-all
        ${color === "invert" 
          ? "bg-white text-gray-800 border border-gray-400" 
          : "text-white"} 
        ${isLoading || !validation ? "cursor-not-allowed" : "cursor-pointer"}`}
      style={color !== "invert" ? { backgroundColor: color } : {}}
      disabled={!!(isLoading || !validation)}
      onClick={() => action()}
    >
      <span>{text}</span>
    </button>
  );
}
