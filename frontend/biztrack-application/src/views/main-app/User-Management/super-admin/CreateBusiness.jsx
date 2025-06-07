import React, { useState, useEffect } from "react";
import AppFormButton from "../../../../components/buttons/AppFormButton";
import TextInput from "../../../../components/input/TextInput";
import SelectInput from "../../../../components/input/SelectInput";
import ColorPickerInput from "../../../../components/input/ColorPickerInput";
import { UploadButton } from "../../../../components/buttons/UploadButton";
import { UserPlus, Upload } from "lucide-react";

// Main CreateBusiness component
const CreateBusiness = ({ onNext }) => {
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    location: "",
    logoUrl: "",
    primaryColor: "#000000",
  });

  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Business type options
  const businessTypeOptions = [
    { value: "Hotel", label: "Hotel" },
    { value: "Kiosk", label: "Kiosk" },
    { value: "Hospital", label: "Hospital" },
  ];

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!formData.businessType) {
      newErrors.businessType = "Business type is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.businessName.trim() &&
      formData.businessType &&
      formData.location.trim()
    );
  };
  const handleColorChange = (hex) => {
    setFormData((prev) => ({ ...prev, primaryColor: hex }));
    if (errors.primaryColor) {
      setErrors((prev) => ({ ...prev, primaryColor: "" }));
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (name === "logoUrl") {
      // Clear uploaded file state and preview
      setUploadedFile(null);

      // If previous preview was a blob URL, revoke it
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
      setLogoPreview(value);
    }
  };

  // Handle file upload
  const handleFileSelect = (file) => {
    // Clear URL input when file is selected
    setFormData((prev) => ({
      ...prev,
      logoUrl: "",
    }));

    // Clean up previous preview
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    // Create new preview
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    setUploadedFile(file);
  };

  // Handle URL input change
  useEffect(() => {
    if (formData.logoUrl) {
      // Clear uploaded file when URL is entered
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
      setUploadedFile(null);
      setLogoPreview(formData.logoUrl);
    } else if (!uploadedFile) {
      setLogoPreview(null);
    }
  }, [formData.logoUrl]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleSubmit = () => {
    if (validateForm()) {
      const submitData = {
        ...formData,
        logoPreview,
        uploadedFile,
      };
      onNext?.(submitData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Business</h1>

      <div className="space-y-6">
        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <TextInput
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              error={errors.businessName}
              required
              placeholder="Enter business name"
            />

            <SelectInput
              label="Business Type"
              name="businessType"
              value={formData.businessType}
              onChange={handleInputChange}
              error={errors.businessType}
              required
              options={businessTypeOptions}
            />

            <TextInput
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              error={errors.location}
              required
              placeholder="Enter business location"
            />
          </div>

          <div>
            {/* Logo Upload Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Logo
              </label>

              {/* URL Input */}
              <TextInput
                label=""
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
                error={errors.logoUrl}
                placeholder="Enter image URL"
              />

              {/* Upload Button */}
              <div className="mt-2">
                <UploadButton
                  onFileSelect={handleFileSelect}
                  disabled={!!formData.logoUrl}
                />
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Use either URL or upload a file (not both)
              </p>
            </div>

            <ColorPickerInput
              label="Primary Color"
              name="primaryColor"
              value={formData.primaryColor}
              onChange={handleColorChange}
              error={errors.primaryColor}
            />
          </div>
        </div>

        {/* Preview Section */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Logo Preview
                </h3>
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain rounded-lg"
                      onError={() => {
                        setLogoPreview(null);
                        setFormData((prev) => ({
                          ...prev,
                          logoUrl: "",
                        }));
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">No logo uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Color Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </h3>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-16 h-16 rounded-lg border border-gray-300 shadow-sm"
                    style={{ backgroundColor: formData.primaryColor }}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.primaryColor}
                    </p>
                    <p className="text-xs text-gray-500">Hex Color Code</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <AppFormButton
            text="Create Business"
            action={handleSubmit}
            color="#4F46E5"
            icon={<UserPlus className="w-4 h-4" />}
            validation={isFormValid()}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateBusiness;
