import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import AppFormButton from "../../../../components/buttons/AppFormButton";
import TextInput from "../../../../components/Input/TextInput";
import PasswordInput from "../../../../components/Input/PasswordInput";

import { X } from "@mui/icons-material";

const EditUserForm = ({ isOpen, onClose, onSubmit, user, businessRoles }) => {
  const [formData, setFormData] = useState({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    password: "",
    business: user.business,
    role: user.role,
  });

  useEffect(() => {
    setFormData({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      password: "",
      business: user.business,
      role: user.role,
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent editing business field
    if (name === "business") return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.role) {
      alert("Username and role are required.");
      return;
    }

    // Password is optional on edit
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        Edit User
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

          {/* Business fixed (disabled) */}
          <label className="block font-semibold mt-4">Business</label>
          <input
            type="text"
            name="business"
            value={formData.business}
            disabled
            className="w-full rounded-md border border-gray-300 p-2 bg-gray-100"
            readOnly
          />

          {/* Role editable */}
          <label className="block font-semibold mt-4">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 p-2"
          >
            {Object.values(businessRoles).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          {/* Password (optional) */}
          <PasswordInput
            label="New Password (leave blank to keep current)"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <DialogActions className="pt-4">
            <AppFormButton type="button" variant="outline" onClick={onClose}>
              Cancel
            </AppFormButton>
            <AppFormButton type="submit">Save Changes</AppFormButton>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserForm;
