import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft, UserPlus, Building2 } from "lucide-react";
import TextInput from "../../../../components/input/TextInput";
import PasswordInput from "../../../../components/input/PasswordInput";
import TextButton from "../../../../components/buttons/TextButton";
import AppFormButton from "../../../../components/buttons/AppFormButton";
import { Paper, Avatar } from "@mui/material";

// Import shared validations
import {
  validateEmail,
  validatePhoneNumber,
  validatePassword,
} from "../../../../utilities/Sharedfunctions";

const CreateAdmin = ({ businessData, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Validation function using shared validations
  const formIsValid = () => {
    if (!formData.fullName.trim()) return false;
    if (!validatePhoneNumber(formData.phoneNumber.replace(/\D/g, "")))
      return false;
    if (formData.email.trim() && !validateEmail(formData.email)) return false;
    if (formData.password.trim() && !validatePassword(null, formData.password))
      return false;
    return true;
  };
  const handleInputChange = (field) => (event) => {
    let value = event.target.value;

    if (field === "phoneNumber") {
      // Optional: format phone number here if you want
      // value = formatPhoneNumber(value);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };
  const handleSubmit = () => {
    if (formIsValid()) {
  
      onNext?.(formData);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Paper elevation={3} className="p-6">
        {/* Business Information Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Create Admin User
          </h1>

          <Paper elevation={1} className="p-4 mb-6 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Business Information
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <Avatar
                src={businessData?.logoPreview || businessData?.logoUrl}
                alt="Business Logo"
                size="large"
                style={{
                  backgroundColor: businessData?.primaryColor || "#e5e7eb",
                }}
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {businessData?.businessName || "Business Name"}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Primary Color:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{
                        backgroundColor:
                          businessData?.primaryColor || "#000000",
                      }}
                    ></div>
                    <span className="text-sm font-mono text-gray-700">
                      {businessData?.primaryColor || "#000000"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Paper>
        </div>

        {/* Admin Form */}
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Admin Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <TextInput
              label="Admin Full Name"
              value={formData.fullName}
              onChange={handleInputChange("fullName")}
              error={errors.fullName}
              required
              placeholder="Enter full name"
            />

            {/* Phone Number */}
            <TextInput
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange("phoneNumber")}
              error={errors.phoneNumber}
              helperText={
                !errors.phoneNumber ? "Kenya format: +254XXXXXXXXX" : undefined
              }
              required
              placeholder="0712 345 678"
              startAdornment={<span className="text-sm text-gray-500">🇰🇪</span>}
            />

            {/* Email */}
            <TextInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={errors.email}
              helperText={!errors.email ? "Optional field" : undefined}
              placeholder="admin@example.com"
            />

            {/* Password */}
            <PasswordInput
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange("password")}
              error={errors.password}
              helperText="Leave blank for auto-generated password"
              placeholder="Enter password"
              endAdornment={
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
            <TextButton
              action={onBack}
              icon={<ArrowLeft className="w-4 h-4" />}
              actionText="Go back"
            />

            <AppFormButton
              text="Create Admin & Business"
              action={handleSubmit}
              color="#4F46E5"
              icon={<UserPlus className="w-4 h-4" />}
              validation={formIsValid}
            />
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default CreateAdmin;
