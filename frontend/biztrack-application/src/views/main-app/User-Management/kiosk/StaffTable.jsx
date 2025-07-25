import React from "react";
import {
  Paper,
  Switch,
  IconButton,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../../../../components/datatable";

const StaffTable = ({
  staffData,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  onEditStaff,
  onDeleteStaff,
  onToggleStatus,
  getInitials,
  formatDate,
}) => {
  // Define table columns
  const columns = [
    {
      field: "name",
      label: "Staff Member",
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: row.status === "Active" ? "primary.main" : "grey",
              mr: 1.5,
            }}
          >
            {getInitials(row.name)}
          </Avatar>
          <Box component="span" sx={{ fontWeight: "medium" }}>
            {row.name}
          </Box>
        </Box>
      ),
    },
    {
      field: "role",
      label: "Role",
      render: (row) => (
        <Box
          component="span"
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: "medium",
            bgcolor:
              row.role === "Admin" ? "warning.light" : "info.light",
            color: row.role === "Admin" ? "warning.dark" : "info.dark",
          }}
        >
          {row.role}
        </Box>
      ),
    },
    {
      field: "contact",
      label: "Contact Information",
      render: (row) => (
        <>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <EmailIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {row.email}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {row.phone}
            </Typography>
          </Box>
        </>
      ),
    },
    {
      field: "dateJoined",
      label: "Date Joined",
      render: (row) => (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {formatDate(row.dateJoined)}
        </Typography>
      ),
    },
    {
      field: "status",
      label: "Status",
      render: (row) => (
        <Switch
          checked={row.status === "Active"}
          onChange={() => onToggleStatus(row.id)}
          inputProps={{ "aria-label": `Toggle ${row.name} status` }}
        />
      ),
    },
    {
      isActionColumn: true,
      label: "Actions",
      render: (row) => (
        <>
          <IconButton
            color="primary"
            onClick={() => onEditStaff(row)}
            aria-label={`Edit ${row.name}`}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => onDeleteStaff(row.id)}
            aria-label={`Delete ${row.name}`}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  // Define status actions (if needed for your TableAction component)
  const statusActionMap = {
    Active: [
      { key: "edit", label: "Edit", icon: <EditIcon /> },
      { key: "delete", label: "Delete", icon: <DeleteIcon /> },
    ],
    Inactive: [
      { key: "edit", label: "Edit", icon: <EditIcon /> },
      { key: "delete", label: "Delete", icon: <DeleteIcon /> },
    ],
  };

  return (
    <DataTable
      columns={columns}
      data={staffData}
      statusField="status"
      statusActionMap={statusActionMap}
      pagination={true}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};

export default StaffTable;