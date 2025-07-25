import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextInput from "../../../../components/input/TextInput";
import PasswordInput from "../../../../components/input/PasswordInput";
import AppFormButton from "../../../../components/buttons/AppFormButton";
import SelectInput from "../../../../components/input/SelectInput";
import { useTheme } from "../../../../components/theme/ThemeContext";
import {
  validateEmail,
  validatePhoneNumber,
  validatePassword,
} from "../../../../utilities/Sharedfunctions";

const StaffFormDialog = ({ open, onClose, initialData, onSave }) => {
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Admin");
  const [status, setStatus] = useState("Active");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Error states
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  
  // Form validation state
  const [isFormValid, setIsFormValid] = useState(false);
  
  const { primaryColor } = useTheme();

  useEffect(() => {
    if (initialData) {
      const [firstName = "", ...lastNameParts] = initialData.name ? initialData.name.split(" ") : ["", ""];
      const lastName = lastNameParts.join(" ");
      
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setRole(initialData.role || "Admin");
      setStatus(initialData.status || "Active");
      setIsFormValid(true); // Editing existing staff is considered valid
    } else {
      // Reset form for new staff
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setRole("Admin");
      setStatus("Active");
      setPassword("");
      setConfirmPassword("");
      setIsFormValid(false);
    }
    
    // Clear all errors when opening dialog
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");
    setConfirmPasswordError("");
  }, [open, initialData]);

  useEffect(() => {
    // Basic validation check (not as thorough as validateForm)
    const isValid = firstName && lastName && validateEmail(email) && validatePhoneNumber(phone) && 
                    (initialData || (password && password === confirmPassword));
    setIsFormValid(isValid);
  }, [firstName, lastName, email, phone, password, confirmPassword, initialData]);

  const validateForm = () => {
    let isValid = true;

    // First Name validation
    if (!firstName.trim()) {
      setFirstNameError("First Name is required");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    // Last Name validation
    if (!lastName.trim()) {
      setLastNameError("Last Name is required");
      isValid = false;
    } else {
      setLastNameError("");
    }

    // Email validation
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Phone validation
    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else if (!validatePhoneNumber(phone)) {
      setPhoneError("Please enter a valid Kenyan phone number");
      isValid = false;
    } else {
      setPhoneError("");
    }

    // Password validation (only for new staff)
    if (!initialData) {
      if (!password) {
        setPasswordError("Password is required");
        isValid = false;
      } else if (!validatePassword("length", password)) {
        setPasswordError("Password must be at least 7 characters");
        isValid = false;
      } else if (!validatePassword("uppercase", password)) {
        setPasswordError("Password must contain an uppercase letter");
        isValid = false;
      } else if (!validatePassword("number", password)) {
        setPasswordError("Password must contain a number");
        isValid = false;
      } else if (!validatePassword("characters", password)) {
        setPasswordError("Password must contain a special character");
        isValid = false;
      } else {
        setPasswordError("");
      }

      // Confirm Password validation
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
        isValid = false;
      } else {
        setConfirmPasswordError("");
      }
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e?.preventDefault(); // Prevent default form submission behavior
    
    if (validateForm()) {
      const staffToSave = {
        name: `${firstName.trim()} ${lastName.trim()}`,
        firstName,
        lastName,
        email,
        phone,
        role,
        status,
        ...(!initialData && { password }) // Only include password for new staff
      };
      onSave(staffToSave, initialData);
    }
  };

  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Shopkeeper", label: "Shopkeeper" },
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        pb: 1, 
        
        borderBottom: (theme) => `1px solid ${theme.palette.divider}` 
      }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          {initialData ? "Edit Staff Member" : "Register New Staff Member"}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            backgroundColor: primaryColor,
            color: "white",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: primaryColor,
              opacity: 0.9,
            },
            p: "6px",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {/* First Name and Last Name */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextInput
              label="First Name"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={!!firstNameError}
              helperText={firstNameError}
              fullWidth
              required
            />
            <TextInput
              label="Last Name"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={!!lastNameError}
              helperText={lastNameError}
              fullWidth
              required
            />
          </Box>

          {/* Email and Phone */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextInput
              label="Email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              fullWidth
              required
            />
            <TextInput
              label="Phone"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={!!phoneError}
              helperText={phoneError}
              fullWidth
              required
            />
          </Box>

          {/* Role and Status */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <SelectInput
              label="Role"
              options={roleOptions}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
            />
            <SelectInput
              label="Status"
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
            />
          </Box>

          {/* Password fields (only for new staff) */}
          {!initialData && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <PasswordInput
                label="Password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                errorMessage={passwordError}
                fullWidth
                required
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!confirmPasswordError}
                errorMessage={confirmPasswordError}
                fullWidth
                required
              />
            </Box>
          )}

          {/* Hidden submit button for form submission on Enter */}
          <button type="submit" style={{ display: 'none' }} />
        </Box>
      </DialogContent>

        <div className="ml-20 mr-20 mb-10 mt-2">
        <AppFormButton
          text={initialData ? "Save Changes" : "Register Staff"}
          color={primaryColor}
          validation={isFormValid}
          action={handleSubmit}
        />
        </div>
    </Dialog>
  );
};

export default StaffFormDialog;