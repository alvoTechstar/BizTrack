import React from "react";
import { Select, MenuItem } from "@mui/material";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";

export default function SelectInput({
  id, 
  name,
  label,
  options,
  value,
  onBlur,
  color,
  onChange,
  disabled,
  returnObject,
  required,
  error,
  errorMessage,
}) {
  return (
    <div className="mb-4">
      <div className="mb-1">
        <span
          className={`text-[12px] leading-4 font-bold text-[#353f50] ${
            required ? "inline" : "block"
          }`}
        >
          {label}
        </span>
        {required && (
          <span className="inline text-red-500 font-bold text-[12px] leading-4">
            {" "}
            *
          </span>
        )}
      </div>

      <Select
        id={id} 
        name={name}
        disabled={!!disabled}
        displayEmpty
        value={
          value === undefined || value === null || options.length === 0
            ? ""
            : value
        }
        onChange={onChange}
        onBlur={onBlur}
        fullWidth
        className={`w-full px-4 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}        
          sx={{
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          "& .MuiSelect-select": { padding: 0 },
        }}
        renderValue={(selected) => {
          if (selected === "") {
            return <span className="text-[#9ca3af]">Select</span>; // Placeholder style
          }

          const selectedOption = options.find((opt) =>
            returnObject
              ? opt === selected
              : opt.value === selected || opt.name === selected
          );

          return selectedOption?.label || selectedOption?.name || selected;
        }}
      >
        <MenuItem value={""} disabled>
          Select
        </MenuItem>
        {options.map((option, index) => (
          <MenuItem
            key={index}
            value={returnObject ? option : option.value || option.name}
            sx={{
              ":hover": {
                color: `${color} !important`,
              },
              color:
                (returnObject && option === value) ||
                option.value === value ||
                JSON.stringify(option) === JSON.stringify(value) ||
                option.name === value
                  ? `${color} !important`
                  : "inherit",
            }}
          >
            {option.label || option.name}
          </MenuItem>
        ))}
      </Select>

      {error && (
        <div className="flex items-center mt-1 text-xs leading-5 text-[#dc4437]">
          <ErrorRoundedIcon className="h-[0.7em] w-[0.7em] mr-1" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
