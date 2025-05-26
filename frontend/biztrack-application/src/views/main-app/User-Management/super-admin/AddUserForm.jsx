import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import AppFormButton from "../../../../components/buttons/AppFormButton";
import TextInput from "../../../../components/Input/TextInput";
import PasswordInput from "../../../../components/Input/PasswordInput";

import { X } from "@mui/icons-material";

const AddUserForm = ({ isOpen, onClose, onSubmit, businessRoles }) => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    business: "",
    role: "",
  });

  useEffect(() => {
    // When business changes, auto-set role
    if (formData.business) {
      setFormData((prev) => ({
        ...prev,
        role: businessRoles[formData.business] || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, role: "" }));
    }
  }, [formData.business, businessRoles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, fullName, business, role, password } = formData;

    if (!username || !fullName || !business || !role || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    onSubmit(formData);
    setFormData({
      username: "",
      fullName: "",
      email: "",
      phone: "",
      password: "",
      business: "",
      role: "",
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        Add New User
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          type="button"
          aria-label="Close"
        >
          <X />
        </button>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <TextInput
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextInput
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Business select */}
          <label className="block font-semibold">Business *</label>
          <select
            name="business"
            value={formData.business}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 p-2"
          >
            <option value="">Select business</option>
            {Object.keys(businessRoles).map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Role - auto set and disabled */}
          <label className="block font-semibold mt-4">Role *</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            disabled
            className="w-full rounded-md border border-gray-300 p-2 bg-gray-100"
            readOnly
          />

          <DialogActions className="pt-4">
            <AppFormButton type="button" variant="outline" onClick={onClose}>
              Cancel
            </AppFormButton>
            <AppFormButton type="submit">Add User</AppFormButton>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserForm;
