// components/TextInput.jsx
import React from "react";

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
  endAdornment,             // ← new prop
}) => {
  return (
    <div className="mb-4 w-full">
      {/* label as before */}
      <div className="mb-1">
        <span className={`text-[14px] leading-4 font-bold text-[#353f50] ${required ? "inline" : "block"}`}>
          {label}
        </span>
        {required && (
          <span className="inline text-red-500 font-bold text-[12px] leading-4">
            *
          </span>
        )}
      </div>

      {/* wrap the input itself in a relative container */}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pr-10 px-4 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {/* absolute icon, now truly centered on the input */}
        {endAdornment && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
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
