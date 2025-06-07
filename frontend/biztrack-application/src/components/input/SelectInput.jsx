import React, { useState } from "react";
import { Select, MenuItem } from "@mui/material";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import { useTheme } from "../theme/ThemeContext";

export default function SelectInput({
  id,
  name,
  label,
  options = [],
  value,
  onBlur,
  onChange,
  disabled = false,
  required = false,
  error = false,
  errorMessage = "",
  returnObject = false,
}) {
  const { primaryColor } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const isEmpty = value === undefined || value === null || options.length === 0;

  return (
    <div className="mb-4 w-full">
      <div className="mb-1">
        <span className="text-[14px] leading-4 font-bold text-[#353f50]">
          {label}
          {required && (
            <span className="text-red-500 font-bold text-[12px] ml-1">*</span>
          )}
        </span>
      </div>

      <div className="relative">
        <Select
          id={id}
          name={name}
          fullWidth
          displayEmpty
          disabled={disabled}
          value={isEmpty ? "" : value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className={`
            w-full pr-10 px-4 py-2 border rounded-lg shadow-sm
            focus:outline-none h-[40px]
            ${error ? "border-red-500" : "border-gray-300"}
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          `}
          style={
            isFocused && !error
              ? {
                  borderColor: primaryColor,
                  boxShadow: `0 0 0 2px ${primaryColor}33`,
                }
              : {}
          }
          renderValue={(selected) => {
            if (selected === "") {
              return <span className="text-[#9ca3af]">Select</span>;
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
          {options.map((option, index) => {
            const isSelected =
              (returnObject && option === value) ||
              option.value === value ||
              JSON.stringify(option) === JSON.stringify(value) ||
              option.name === value;

            return (
              <MenuItem
                key={index}
                value={returnObject ? option : option.value || option.name}
                sx={{
                  ":hover": { color: primaryColor },
                  color: isSelected ? primaryColor : "inherit",
                }}
              >
                {option.label || option.name}
              </MenuItem>
            );
          })}
        </Select>

        {error && (
          <div className="flex items-center mt-1 text-xs leading-5 text-[#dc4437]">
            <ErrorRoundedIcon className="h-[0.7em] w-[0.7em] mr-1" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
