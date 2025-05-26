import React from "react";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PasswordInput from "./PasswordInput";
// import "./input.css";
import { validatePassword } from "../../utilities/Sharedfunctions";

const REQUIREMENTS = [
  { label: "A minimum of 7 characters", test: "length" },
  { label: "A special character (@#$*)", test: "characters" },
  { label: "A capital letter", test: "uppercase" },
  { label: "A number", test: "number" },
];

export default function PasswordResetInput({
  id,
  label,
  placeholder,
  input,
  handleInput,
  id2,
  label2,
  placeholder2,
  input2,
  loading,
  error,
}) {
  return (
    <div>
      {/* First Password Field */}
      <PasswordInput
        id={id}
        label={label}
        placeholder={placeholder}
        input={input}
        handleInput={handleInput}
        disabled={loading}
        error={error || (input && !validatePassword("all", input))}
        errorMessage={
          error ? "New password cannot be the same as old password" : null
        }
      />

      {/* Password Requirements Checker */}
      {input && !validatePassword("all", input) && (
        <div className="validation-container">
          {REQUIREMENTS.map((key) => (
            <div key={key.test} className="validation-item">
              <CheckCircleOutlineRoundedIcon
                style={{
                  color: validatePassword(key.test, input)
                    ? "#74C965"
                    : "#D1D5DB",
                  fontSize: 18,
                  marginRight: "6px",
                }}
              />
              <span>{key.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Password Field */}
      <PasswordInput
        id={id2}
        label={label2}
        placeholder={placeholder2}
        input={input2}
        handleInput={handleInput}
        disabled={!input}
        error={input && input2 && input !== input2}
        errorMessage={"Passwords do not match"}
      />
    </div>
  );
}
