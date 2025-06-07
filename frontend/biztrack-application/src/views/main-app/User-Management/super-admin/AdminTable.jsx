import React, { useState, useMemo } from "react";
import { Box, Chip, Typography, Tooltip, Paper } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VpnKey as ResetPasswordIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";

// Adjust the import path to your DataTable component as per your project structure
import DataTable from "../../../../components/datatable";

// Sample Data (replace with actual data from your state/API)
const initialRows = [
  {
    id: 101,
    fullName: "Alice Smith",
    phoneNumber: "+254712345678",
    email: "alice.smith@luxurygrandhotel.com",
    businessName: "Luxury Grand Hotel",
    role: "HOTEL_ADMIN",
    associatedBusinessId: "BIZ-001",
  },
  {
    id: 102,
    fullName: "Bob Johnson",
    phoneNumber: "+254722334455",
    email: "bob.johnson@citykiosk.com",
    businessName: "City Kiosk Express",
    role: "KIOSK_ADMIN",
    associatedBusinessId: "BIZ-002",
  },
  {
    id: 103,
    fullName: "Carol White",
    phoneNumber: "+254733998877",
    email: "carol.white@wellnesshospital.com",
    businessName: "Wellness General Hospital",
    role: "HOSPITAL_ADMIN",
    associatedBusinessId: "BIZ-003",
  },
  {
    id: 104,
    fullName: "David Green",
    phoneNumber: "+254701020304",
    email: "david.green@greenoasis.com",
    businessName: "Green Oasis Spa",
    role: "SPA_ADMIN",
    associatedBusinessId: "BIZ-004",
  },
  {
    id: 105,
    fullName: "Eve Davis",
    phoneNumber: "+254744556677",
    email: "eve.davis@megaelectronics.com",
    businessName: "Mega Electronics",
    role: "RETAIL_ADMIN",
    associatedBusinessId: "BIZ-005",
  },
  {
    id: 106,
    fullName: "Frank White",
    phoneNumber: "+254755889900",
    email: "frank.white@luxurygrandhotel.com",
    businessName: "Luxury Grand Hotel",
    role: "HOTEL_ADMIN",
    associatedBusinessId: "BIZ-006",
  },
  {
    id: 107,
    fullName: "Grace Hopper",
    phoneNumber: "+254766112233",
    email: "grace.hopper@citykiosk.com",
    businessName: "City Kiosk Express",
    role: "KIOSK_ADMIN",
    associatedBusinessId: "BIZ-007",
  },
  {
    id: "user-biztrack-admin",
    fullName: "Alvo Tech",
    phoneNumber: "0711000001",
    email: "admin@biztrack.com",
    businessName: "Biztrack Platform",
    role: "Biztrack_ADMIN",
    associatedBusinessId: "biz-super-admin-default",
  },
];

function AdminTable() {
  const [rows, setRows] = useState(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const handleAction = (actionKey, row) => {
    if (actionKey === "view") {
      console.log(
        "View admin:",
        row.id,
        "Associated Business ID:",
        row.associatedBusinessId
      );
      // Implement view logic, e.g., open a modal or navigate
    } else if (actionKey === "resetPassword") {
      console.log("Reset password for admin:", row.id);
      alert(`Resetting password for ${row.fullName}`);
      // Implement password reset logic
    } else if (actionKey === "delete") {
      console.log("Delete admin:", row.id);
      if (
        window.confirm(
          `Are you sure you want to delete admin: ${row.fullName}?`
        )
      ) {
        setRows((prevRows) => prevRows.filter((r) => r.id !== row.id));
        alert(`${row.fullName} deleted successfully.`);
      }
    } else {
      console.log(`Unhandled action: ${actionKey} for row:`, row);
    }
  };

  const columns = [
    {
      field: "associatedBusinessId",
      label: "Business ID",
      minWidth: "100px", // Increased minWidth to prevent cutoff
      render: (row) => (
        <Typography variant="body2" className="font-medium text-gray-700">
          {row.associatedBusinessId || "N/A"}
        </Typography>
      ),
    },
    {
      field: "businessName",
      label: "Business",
      minWidth: "180px", // Kept a good width for business names
      render: (row) => (
        <Typography
          variant="body2"
          className="text-blue-700 hover:underline cursor-pointer"
        >
          {row.businessName}
        </Typography>
      ),
    },
    {
      field: "fullName",
      label: "Name",
      minWidth: "150px", // Good for typical names
      render: (row) => (
        <Typography variant="body2" className="font-medium text-gray-700">
          {row.fullName}
        </Typography>
      ),
    },
    {
      field: "phoneNumber",
      label: "Phone Number",
      minWidth: "140px", // Adjusted for phone number length
      render: (row) => (
        <Typography variant="body2" className="text-gray-600">
          {row.phoneNumber}
        </Typography>
      ),
    },
    {
      field: "email",
      label: "Email",
      minWidth: "200px", // Sufficient for most email addresses
      render: (row) => (
        <Typography variant="body2" className="text-gray-600">
          {row.email || "N/A"}
        </Typography>
      ),
    },
    {
      field: "role",
      label: "Role",
      minWidth: "100px", // Sufficient for roles like 'BIZTRACK_ADMIN'
      render: (row) => (
        <Chip
          label={row.role}
          size="small"
          color="primary"
          variant="outlined"
          className="lowercase"
          sx={{ borderRadius: "8px" }} // Added this line for 8px border-radius
        />
      ),
    },
    {
      label: "Actions",
      isActionColumn: true,
      minWidth: "120px", // A bit tighter, but still accommodating 3 icons
    },
  ];

  const customActionConfigs = {
    view: {
      icon: ViewIcon,
      label: "View",
      tooltip: "View Admin Details",
      color: "info",
    },
    resetPassword: {
      icon: ResetPasswordIcon,
      label: "Reset Password",
      tooltip: "Reset Admin Password",
      color: "warning",
    },
    delete: {
      icon: DeleteIcon,
      label: "Delete",
      tooltip: "Delete Admin",
      color: "error",
    },
  };

  const statusActionMap = {
    default: ["view", "resetPassword", "delete"],
  };

  const filterOptions = useMemo(() => {
    const roles = [...new Set(initialRows.map((row) => row.role))];
    return roles.map((role) => ({
      value: role,
      label: role
        .replace("_ADMIN", " Admin")
        .replace("_", " ")
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" "),
    }));
  }, []);

  const filteredRows = useMemo(() => {
    let currentFilteredRows = rows;

    if (searchTerm) {
      currentFilteredRows = currentFilteredRows.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterRole) {
      currentFilteredRows = currentFilteredRows.filter(
        (row) => row.role === filterRole
      );
    }

    return currentFilteredRows;
  }, [rows, searchTerm, filterRole]);

  return (
    <Box className="p-4 md:p-6">
      <DataTable
        title="Admin Users"
        columns={columns}
        data={filteredRows.map((row) => ({ ...row, status: "default" }))}
        statusField="status"
        statusActionMap={statusActionMap}
        customActionConfigs={customActionConfigs}
        pagination={true}
        defaultRowsPerPage={5}
        rowsPerPageOptions={[5, 10, 20]}
        onAction={handleAction}
        showToolbar={true}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={filterOptions}
        filterValue={filterRole}
        onFilterChange={setFilterRole}
      />
    </Box>
  );
}

export default AdminTable;
