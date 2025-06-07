// PatientRegistration.jsx (Modified for within-layout display)
import React, { useState, useEffect } from "react";
import {
  Paper, // Keep Paper for styling the panel itself
  IconButton,
  Alert,
  // Removed Modal and Box imports
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AppFormButton from "../../../../components/buttons/AppFormButton";
import TextInput from "../../../../components/Input/TextInput";
import SelectInput from "../../../../components/input/SelectInput";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material"; // For gender selection
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // For Date of Birth

// Assume these are defined in your Constants.js or similar
const GENDER_OPTIONS = ["Male", "Female", "Other"];
const VISIT_TYPES_MODAL = ["Consultation", "Emergency", "Follow-up"]; // Assuming this is used

const PatientRegistration = ({ open, onClose, onRegisterPatient, patients }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    nationalId: "",
    gender: "",
    dob: null, // Date object or null
    address: "",
    visitTypeModal: VISIT_TYPES_MODAL[0], // Default visit type for new registration
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setFormData({
        fullName: "",
        phoneNumber: "",
        nationalId: "",
        gender: "",
        dob: null,
        address: "",
        visitTypeModal: VISIT_TYPES_MODAL[0],
      });
      setErrors({});
      setSuccessMessage("");
      setErrorMessage("");
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dob: date }));
    setErrors((prev) => ({ ...prev, dob: "" }));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = "Full Name is required.";
    if (!formData.phoneNumber.trim()) {
      tempErrors.phoneNumber = "Phone Number is required.";
    } else if (!/^\+?\d{7,15}$/.test(formData.phoneNumber.trim())) { // Simple phone regex
      tempErrors.phoneNumber = "Invalid phone number format.";
    } else if (patients.some(p => p.phoneNumber === formData.phoneNumber.trim())) {
      tempErrors.phoneNumber = "Phone number already registered.";
    }

    if (!formData.nationalId.trim()) {
      tempErrors.nationalId = "National ID is required.";
    } else if (patients.some(p => p.nationalId === formData.nationalId.trim())) {
      tempErrors.nationalId = "National ID already registered.";
    }

    if (!formData.gender) tempErrors.gender = "Gender is required.";
    if (!formData.dob) tempErrors.dob = "Date of Birth is required.";
    if (!formData.address.trim()) tempErrors.address = "Address is required.";
    if (!formData.visitTypeModal) tempErrors.visitTypeModal = "Visit Type is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    if (validate()) {
      setIsSubmitting(true);
      try {
        await onRegisterPatient(formData); // This function will add to patients and queue
        setSuccessMessage("Patient registered and added to queue successfully!");
        // Optionally, close after a delay or require user to close
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (err) {
        setErrorMessage("Failed to register patient. Please try again.");
        console.error("Registration error:", err);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrorMessage("Please correct the errors in the form.");
    }
  };

  if (!open) return null; // Crucial for conditional rendering

  return (
    // This div creates the absolute positioning and centering, no backdrop
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <Paper
        elevation={4}
        className="p-4 md:p-6 mb-6 relative z-10 w-full md:max-w-2xl bg-white rounded-lg shadow-xl"
        // No overflow-y auto or maxHeight here
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Register New Patient</h2>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>

        {successMessage && <Alert severity="success" className="mb-4">{successMessage}</Alert>}
        {errorMessage && <Alert severity="error" className="mb-4">{errorMessage}</Alert>}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <TextInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            size="small"
            error={!!errors.fullName}
            errorMessage={errors.fullName}
            required
          />
          <TextInput
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            size="small"
            error={!!errors.phoneNumber}
            errorMessage={errors.phoneNumber}
            required
          />
          <TextInput
            label="National ID"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            size="small"
            error={!!errors.nationalId}
            errorMessage={errors.nationalId}
            required
          />

          <RadioGroup
            row
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            {GENDER_OPTIONS.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
          {errors.gender && <Alert severity="error" className="mb-4">{errors.gender}</Alert>}

          <DatePicker
            label="Date of Birth"
            value={formData.dob}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextInput
                {...params}
                size="small"
                error={!!errors.dob}
                errorMessage={errors.dob}
                required
              />
            )}
          />

          <TextInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            size="small"
            error={!!errors.address}
            errorMessage={errors.address}
            required
          />

          <SelectInput
            id="visit-type-modal"
            name="visitTypeModal"
            label="Visit Type"
            options={VISIT_TYPES_MODAL.map((type) => ({
              label: type,
              value: type,
            }))}
            value={formData.visitTypeModal}
            onChange={handleChange}
            required
            error={!!errors.visitTypeModal}
            errorMessage={errors.visitTypeModal}
            color="#2563EB"
          />

          <AppFormButton
            text="Register Patient"
            color="#10b981"
            action={handleSubmit}
            validation={true}
            isLoading={isSubmitting}
          />
        </form>
      </Paper>
    </div>
  );
};

export default PatientRegistration;