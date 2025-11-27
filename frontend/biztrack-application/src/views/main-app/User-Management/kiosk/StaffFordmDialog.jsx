import React from 'react';
import { useFormik } from 'formik';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useTheme } from '../../../../components/theme/ThemeContext';
import TextInput from '../../../../components/Input/TextInput';
import SelectInput from '../../../../components/input/SelectInput';
import AppFormButton from '../../../../components/buttons/AppFormButton';
import PasswordInput from '../../../../components/input/PasswordInput';
import { userValidationSchema } from '../../../../utilities/validationSchemas';

const StaffFormDialog = ({
  show,
  onClose,
  onSave,
  staff,
  isEditing,
  submitting = false
}) => {
  const theme = useTheme();

  if (!show) return null;

  const safeInitialData = staff || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    status: 'Active',
    password: '',
    confirmPassword: ''
  };

  const formik = useFormik({
    initialValues: safeInitialData,
    validationSchema: userValidationSchema,
    onSubmit: (values) => {
      console.log('📤 Submitting staff form with values:', values);
      const formData = {
        name: `${values.firstName.trim()} ${values.lastName.trim()}`,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phoneNumber || values.phone, // Handle both field names
        role: values.role,
        status: values.status,
        ...(!isEditing && { password: values.password })
      };
      
      const initialData = isEditing ? staff : null;
      onSave(formData, initialData);
    },
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: false,
  });

  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Shopkeeper', label: 'Shopkeeper' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Staff', label: 'Staff' },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    formik.setFieldValue(name, value);
  };

  const handleSelectBlur = (event) => {
    const { name } = event.target;
    formik.setFieldTouched(name, true);
  };

  const handleInputChange = (event) => {
    formik.handleChange(event);
  };

  const handleInputBlur = (event) => {
    formik.handleBlur(event);
  };

  const shouldShowError = (fieldName) => {
    return formik.touched[fieldName] && !!formik.errors[fieldName];
  };

  const getErrorMessage = (fieldName) => {
    return shouldShowError(fieldName) ? formik.errors[fieldName] : '';
  };

  return (
    <div className="bg-white rounded-lg w-3/5 max-w-4xl mx-auto shadow-lg border border-gray-200 mb-8">
      {/* Modal Header */}
      <div
        className="flex items-center justify-between p-6 border-gray-200 bg-gray-50 rounded-t-lg"
        style={{ borderBottom: `1px solid ${theme.borderColor || '#e5e7eb'}` }}
      >
        <h3
          className="text-xl font-semibold"
          style={{ color: theme.textPrimary || '#1f2937' }}
        >
          {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
        </h3>
        <button
          onClick={onClose}
          className="hover:bg-gray-100 transition rounded-full p-1"
          disabled={submitting}
          type="button"
        >
          <CancelRoundedIcon
            className="main-form-close"
            style={{
              fill: theme.textSecondary || '#6b7280',
              fontSize: '24px'
            }}
          />
        </button>
      </div>

      <form onSubmit={formik.handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              id="firstName"
              label="First Name"
              placeholder="John"
              input={formik.values.firstName}
              handleInput={handleInputChange}
              handleBlur={handleInputBlur}
              name="firstName"
              required={true}
              disabled={submitting}
              error={shouldShowError('firstName')}
              errorMessage={getErrorMessage('firstName')}
            />

            <TextInput
              id="lastName"
              label="Last Name"
              placeholder="Doe"
              input={formik.values.lastName}
              handleInput={handleInputChange}
              handleBlur={handleInputBlur}
              name="lastName"
              required={true}
              disabled={submitting}
              error={shouldShowError('lastName')}
              errorMessage={getErrorMessage('lastName')}
            />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              id="email"
              label="Email Address"
              placeholder="staff@example.com"
              input={formik.values.email}
              handleInput={handleInputChange}
              handleBlur={handleInputBlur}
              name="email"
              type="email"
              required={true}
              disabled={submitting}
              error={shouldShowError('email')}
              errorMessage={getErrorMessage('email')}
            />

            <TextInput
              id="phoneNumber"
              label="Phone Number"
              placeholder="+254712345678"
              input={formik.values.phoneNumber || formik.values.phone}
              handleInput={handleInputChange}
              handleBlur={handleInputBlur}
              name="phoneNumber"
              type="tel"
              required={true}
              disabled={submitting}
              error={shouldShowError('phoneNumber')}
              errorMessage={getErrorMessage('phoneNumber')}
            />
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-2 gap-4">
            <SelectInput
              id="role"
              name="role"
              label="Role"
              options={roleOptions}
              value={formik.values.role}
              onChange={handleSelectChange}
              onBlur={handleSelectBlur}
              required={true}
              disabled={submitting}
              error={shouldShowError('role')}
              errorMessage={getErrorMessage('role')}
              placeholder="Select a role"
            />

            <SelectInput
              id="status"
              name="status"
              label="Status"
              options={statusOptions}
              value={formik.values.status}
              onChange={handleSelectChange}
              onBlur={handleSelectBlur}
              required={true}
              disabled={submitting}
              error={shouldShowError('status')}
              errorMessage={getErrorMessage('status')}
              placeholder="Select status"
            />
          </div>

          {/* Password fields (only for new staff) */}
          {!isEditing && (
            <div className="grid grid-cols-2 gap-4">
              <PasswordInput
                id="password"
                label="Password"
                placeholder="Enter password"
                value={formik.values.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                name="password"
                required={true}
                disabled={submitting}
                error={shouldShowError('password')}
                errorMessage={getErrorMessage('password')}
              />

              <PasswordInput
                id="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm password"
                value={formik.values.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                name="confirmPassword"
                required={true}
                disabled={submitting}
                error={shouldShowError('confirmPassword')}
                errorMessage={getErrorMessage('confirmPassword')}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className="flex gap-3 pt-6 border-t border-gray-200 mt-6"
          style={{ borderTopColor: theme.borderColor || '#e5e7eb' }}
        >
          <AppFormButton
            text="Cancel"
            color="invert"
            isLoading={false}
            validation={true}
            action={onClose}
            type="button"
            disabled={submitting}
          />
          <AppFormButton
            text={submitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Staff')}
            color={theme.primaryColor || '#2563eb'}
            isLoading={submitting}
            validation={formik.isValid && !submitting}
            action={formik.handleSubmit}
            type="submit"
            disabled={!formik.isValid || submitting}
          />
        </div>
      </form>
    </div>
  );
};

export default StaffFormDialog;