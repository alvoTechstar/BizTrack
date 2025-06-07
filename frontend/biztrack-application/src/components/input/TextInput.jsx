import React, { useState } from "react";
import { useTheme } from "../theme/ThemeContext";

const TextInput = ({
  id,
  name,
  label,
  placeholder,
  value,
  required,
  onBlur,
  onChange,
  disabled = false,
  type = "text",
  error = false,
  errorMessage = "",
  endAdornment,
}) => {
  const { primaryColor } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

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
        <input
          id={id}
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full pr-10 px-4 py-2 border rounded-lg shadow-sm
            focus:outline-none
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
        />
        {endAdornment && (
          <div
            className="absolute inset-y-0 right-3 flex items-center pointer-events-none"
            style={{ color: primaryColor }}
          >
            {endAdornment}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default TextInput;
