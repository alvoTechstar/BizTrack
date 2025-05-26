import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const initialStaff = [
  // example mock staff data; add your own or fetch from API later
  {
    id: 1,
    name: "John Doe",
    role: "Admin",
    email: "john@example.com",
    phone: "(555) 123-4567",
    dateJoined: "2023-02-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Shopkeeper",
    email: "jane@example.com",
    phone: "(555) 987-6543",
    dateJoined: "2023-03-20",
    status: "Inactive",
  },
  // ... add more mock staff
];

const KioskStaffManagement = () => {
  // State declarations
  const [staff, setStaff] = useState(initialStaff);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null); // null means add new
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Admin",
    status: "Active",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // success, error, warning, info
  });

  // Helpers
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filtered staff list based on search and role filter
  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "All" || member.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Event handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleToggleStatus = (id) => {
    setStaff((prevStaff) =>
      prevStaff.map((member) =>
        member.id === id
          ? {
              ...member,
              status: member.status === "Active" ? "Inactive" : "Active",
            }
          : member
      )
    );
    showSnackbar("Status updated", "success");
  };

  const handleOpenDialog = (staffMember = null) => {
    setCurrentStaff(staffMember);
    if (staffMember) {
      setFormData({
        name: staffMember.name,
        email: staffMember.email,
        phone: staffMember.phone,
        role: staffMember.role,
        status: staffMember.status,
        password: "",
        confirmPassword: "",
      });
      setShowPassword(false);
      setFormError({});
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "Admin",
        status: "Active",
        password: "",
        confirmPassword: "",
      });
      setShowPassword(false);
      setFormError({});
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentStaff(null);
    setFormError({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    ) {
      errors.email = "Invalid email address";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\(\d{3}\)\s\d{3}-\d{4}$/.test(formData.phone.trim())) {
      errors.phone = "Phone format must be (555) 123-4567";
    }

    if (!currentStaff) {
      // Only on Add new staff: validate password fields
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    setFormError(errors);

    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field on change
    setFormError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSaveStaff = () => {
    if (!validateForm()) return;

    if (currentStaff) {
      // Update existing staff
      setStaff((prevStaff) =>
        prevStaff.map((member) =>
          member.id === currentStaff.id
            ? {
                ...member,
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                role: formData.role,
                status: formData.status,
              }
            : member
        )
      );
      showSnackbar("Staff member updated successfully", "success");
    } else {
      // Add new staff
      const newStaff = {
        id: staff.length > 0 ? Math.max(...staff.map((s) => s.id)) + 1 : 1,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        status: formData.status,
        dateJoined: new Date().toISOString().split("T")[0], // yyyy-mm-dd
      };
      setStaff((prevStaff) => [newStaff, ...prevStaff]);
      showSnackbar("New staff member added successfully", "success");
    }

    handleCloseDialog();
  };

  const handleDeleteStaff = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this staff member? This action cannot be undone."
      )
    ) {
      setStaff((prevStaff) => prevStaff.filter((member) => member.id !== id));
      showSnackbar("Staff member deleted", "warning");
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header: Title + Search + Filter + Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-900">
          Kiosk Staff Management
        </h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <input
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded p-2 w-full sm:w-64"
          />
          <select
            value={roleFilter}
            onChange={handleRoleFilterChange}
            className="border border-gray-300 rounded p-2 w-full sm:w-48"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Shopkeeper">Shopkeeper</option>
          </select>
          <button
            onClick={() => handleOpenDialog(null)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Staff
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <Paper className="w-full mb-6 shadow rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Contact Information
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Date Joined
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.length > 0 ? (
                filteredStaff
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                              member.status === "Active"
                                ? "bg-blue-600"
                                : "bg-gray-400"
                            } text-white`}
                          >
                            {getInitials(member.name)}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            member.role === "Admin"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center mb-1">
                            <EmailIcon className="mr-2 text-gray-500 text-sm" />
                            <div className="text-sm text-gray-500">
                              {member.email}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <PhoneIcon className="mr-2 text-gray-500 text-sm" />
                            <div className="text-sm text-gray-500">
                              {member.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(member.dateJoined)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Switch
                          checked={member.status === "Active"}
                          onChange={() => handleToggleStatus(member.id)}
                          className={
                            member.status === "Active"
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="p-1 text-blue-600 hover:text-blue-800"
                            onClick={() => handleOpenDialog(member)}
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="p-1 text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteStaff(member.id)}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {searchQuery || roleFilter !== "All"
                      ? "No staff members match your filters"
                      : "No staff members found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <select
                className="mr-2 p-2 border border-gray-300 rounded"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
              >
                {[5, 10, 25].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                onClick={() => handleChangePage(null, page - 1)}
                disabled={page === 0}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                onClick={() => handleChangePage(null, page + 1)}
                disabled={(page + 1) * rowsPerPage >= filteredStaff.length}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </Paper>

      {/* Dialog */}
      {openDialog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseDialog}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">
              {currentStaff ? "Edit Staff Member" : "Add New Staff Member"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full border p-2 rounded ${
                    formError.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formError.name && (
                  <p className="text-red-600 text-xs mt-1">{formError.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full border p-2 rounded ${
                    formError.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formError.email && (
                  <p className="text-red-600 text-xs mt-1">{formError.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (format: (555) 123-4567)
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  className={`w-full border p-2 rounded ${
                    formError.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formError.phone && (
                  <p className="text-red-600 text-xs mt-1">{formError.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="Admin">Admin</option>
                  <option value="Shopkeeper">Shopkeeper</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {!currentStaff && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full border p-2 rounded ${
                        formError.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formError.password && (
                      <p className="text-red-600 text-xs mt-1">
                        {formError.password}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full border p-2 rounded ${
                        formError.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formError.confirmPassword && (
                      <p className="text-red-600 text-xs mt-1">
                        {formError.confirmPassword}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showPassword"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      className="mr-2"
                    />
                    <label
                      htmlFor="showPassword"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      Show Passwords
                    </label>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStaff}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {currentStaff ? "Save Changes" : "Add Staff"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div
          className={`fixed bottom-5 right-5 px-4 py-2 rounded shadow-lg text-white font-semibold z-50
            ${
              snackbar.severity === "success"
                ? "bg-green-600"
                : snackbar.severity === "error"
                ? "bg-red-600"
                : snackbar.severity === "warning"
                ? "bg-yellow-600 text-black"
                : "bg-blue-600"
            }
          `}
          onClick={handleCloseSnackbar}
          role="alert"
          aria-live="assertive"
          style={{ cursor: "pointer" }}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default KioskStaffManagement;
