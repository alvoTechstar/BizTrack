import React, { useState, useMemo, useCallback } from "react";
import { Box } from "@mui/material";

// Import the new components
import StaffHeader from "./StaffHeader";
import StaffTable from "./StaffTable";
import StaffFormDialog from "./StaffFordmDialog";
import NotificationSnackbar from "./NotificationSnackbar";

// Example mock staff data (can be moved to a separate data file if it grows large)
const initialStaff = [
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
  {
    id: 3,
    name: "Alice Johnson",
    role: "Admin",
    email: "alice@example.com",
    phone: "(555) 111-2222",
    dateJoined: "2024-01-10",
    status: "Active",
  },
  {
    id: 4,
    name: "Bob Williams",
    role: "Shopkeeper",
    email: "bob@example.com",
    phone: "(555) 333-4444",
    dateJoined: "2024-03-01",
    status: "Active",
  },
  {
    id: 5,
    name: "Charlie Brown",
    role: "Shopkeeper",
    email: "charlie@example.com",
    phone: "(555) 555-6666",
    dateJoined: "2023-11-20",
    status: "Inactive",
  },
  {
    id: 6,
    name: "Diana Prince",
    role: "Admin",
    email: "diana@example.com",
    phone: "(555) 777-8888",
    dateJoined: "2025-01-05",
    status: "Active",
  },
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
  const [formErrors, setFormErrors] = useState({}); // For form validation errors

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // success, error, warning, info
  });

  // Helper Functions (memoized)
  const getInitials = useCallback((name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  // Filtered staff list based on search and role filter (memoized for performance)
  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "All" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [staff, searchQuery, roleFilter]);

  // Event handlers for header (memoized)
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setPage(0); // Reset page on search
  }, []);

  const handleRoleFilterChange = useCallback((e) => {
    setRoleFilter(e.target.value);
    setPage(0); // Reset page on filter change
  }, []);

  // Event handlers for table pagination (memoized)
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0); // Reset page on rows per page change
  }, []);

  // Snackbar functions (memoized)
  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // CRUD operations and dialog handling (memoized)
  const handleOpenDialog = useCallback((staffMember = null) => {
    setCurrentStaff(staffMember);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setCurrentStaff(null);
    setFormErrors({}); // Clear errors on dialog close
  }, []);

  const handleSaveStaff = useCallback(
    (formDataFromDialog, initialDataFromDialog) => {
      if (initialDataFromDialog) {
        // Update existing staff
        setStaff((prevStaff) =>
          prevStaff.map((member) =>
            member.id === initialDataFromDialog.id
              ? {
                  ...member,
                  name: formDataFromDialog.name.trim(),
                  email: formDataFromDialog.email.trim(),
                  phone: formDataFromDialog.phone.trim(),
                  role: formDataFromDialog.role,
                  status: formDataFromDialog.status,
                  // Password is not updated on edit unless explicitly handled in form,
                  // which is not the case in this simplified example.
                }
              : member
          )
        );
        showSnackbar("Staff member updated successfully", "success");
      } else {
        // Add new staff
        const newStaff = {
          id: staff.length > 0 ? Math.max(...staff.map((s) => s.id)) + 1 : 1,
          name: formDataFromDialog.name.trim(),
          email: formDataFromDialog.email.trim(),
          phone: formDataFromDialog.phone.trim(),
          role: formDataFromDialog.role,
          status: formDataFromDialog.status,
          dateJoined: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        };
        setStaff((prevStaff) => [newStaff, ...prevStaff]); // Add new staff to the top
        showSnackbar("New staff member added successfully", "success");
      }
      handleCloseDialog();
    },
    [staff, showSnackbar, handleCloseDialog]
  );

  const handleDeleteStaff = useCallback(
    (id) => {
      if (
        window.confirm(
          "Are you sure you want to delete this staff member? This action cannot be undone."
        )
      ) {
        setStaff((prevStaff) => prevStaff.filter((member) => member.id !== id));
        showSnackbar("Staff member deleted", "warning");
      }
    },
    [showSnackbar]
  );

  const handleToggleStatus = useCallback(
    (id) => {
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
      showSnackbar("Staff status updated successfully", "success");
    },
    [showSnackbar]
  );

  return (
    <Box>
      <StaffHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        roleFilter={roleFilter}
        onRoleFilterChange={handleRoleFilterChange}
        onAddStaffClick={() => handleOpenDialog(null)}
      />

      <StaffTable
        staffData={filteredStaff}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        onEditStaff={handleOpenDialog}
        onDeleteStaff={handleDeleteStaff}
        onToggleStatus={handleToggleStatus}
        getInitials={getInitials}
        formatDate={formatDate}
      />

      <StaffFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        initialData={currentStaff}
        onSave={handleSaveStaff}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
      />

      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default KioskStaffManagement;