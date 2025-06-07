import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "../theme/ThemeContext";

const PasswordInput = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  errorMessage = "",
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { primaryColor } = useTheme(); // <--- primaryColor is retrieved here

  return (
    <div className="mb-4 w-full">
      <div className="mb-1">
        <span
          className={`text-[14px] leading-4 font-bold text-[#353f50] ${
            required ? "inline" : "block"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-2 border
            ${error ? "border-red-500" : "border-gray-300"}
            rounded-lg shadow-sm focus:outline-none
            focus:ring-2 // <-- This applies the ring
            focus:border-[${primaryColor}] // <-- This sets the border color to primaryColor on focus
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          `}
          style={{
            "--tw-ring-color": primaryColor, // <-- This sets the ring color to primaryColor
          }}
        />
        <div
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 cursor-pointer"
          style={{ color: primaryColor || "text.gray-500" }} // For the visibility icon
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </div>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{errorMessage}</p>}
    </div>
  );
};

export default PasswordInput;
