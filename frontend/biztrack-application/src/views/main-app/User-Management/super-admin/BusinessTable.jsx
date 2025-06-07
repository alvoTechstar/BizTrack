import React, { useState, useMemo } from "react";
import {
  Avatar,
  Box,
  Chip,
  Tooltip,
  Typography,
  TextField,
  // Removed unused Select and MenuItem as DataTable now handles the filter dropdown
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
// Adjust the import path to your DataTable component as per your project structure
import DataTable from "../../../../components/datatable";

const initialRows = [
  {
    id: 1,
    businessId: "BIZ-001", // Added businessId
    logoUrl: "https://via.placeholder.com/40x40.png?text=B1",
    businessName: "Luxury Grand Hotel",
    type: "HOTEL",
    location: "Nairobi, Kenya",
    primaryColor: "#007BFF",
    adminName: "Alice Smith",
  },
  {
    id: 2,
    businessId: "BIZ-002", // Added businessId
    logoUrl: null,
    businessName: "City Kiosk Express",
    type: "KIOSK",
    location: "Mombasa Rd",
    primaryColor: "#28A745",
    adminName: "Bob Johnson",
  },
  {
    id: 3,
    businessId: "BIZ-003", // Added businessId
    businessName: "Wellness General Hospital",
    type: "HOSPITAL",
    location: "Upper Hill, Nairobi",
    primaryColor: "#DC3545",
    adminName: "Carol White",
    logoUrl: "https://via.placeholder.com/40x40.png?text=HOS",
  },
  {
    id: 4,
    businessId: "BIZ-004", // Added businessId
    businessName: "Green Oasis Spa",
    type: "SPA",
    location: "Karen, Nairobi",
    primaryColor: "#FFC107",
    adminName: "David Lee",
    logoUrl: null,
  },
  {
    id: 5,
    businessId: "BIZ-005", // Added businessId
    businessName: "Mega Electronics",
    type: "RETAIL",
    location: "CBD, Nairobi",
    primaryColor: "#6C757D",
    adminName: "Eve Davis",
    logoUrl: "https://via.placeholder.com/40x40.png?text=RET",
  },
  {
    id: 6,
    businessId: "BIZ-006", // Changed businessId to be unique
    logoUrl: "https://via.placeholder.com/40x40.png?text=B6",
    businessName: "Coast Beach Resort",
    type: "HOTEL",
    location: "Diani, Kenya",
    primaryColor: "#FF5733",
    adminName: "Frank Green",
  },
  {
    id: 7,
    businessId: "BIZ-007", // Changed businessId to be unique
    businessName: "Mountain View Clinic",
    type: "HOSPITAL",
    location: "Limuru, Kenya",
    primaryColor: "#33FF57",
    adminName: "Grace Black",
    logoUrl: null,
  },
  {
    id: 8,
    businessId: "BIZ-008", // Changed businessId to be unique
    businessName: "Urban Fitness Gym",
    type: "GYM", // Added a new type for variety
    location: "Westlands, Nairobi",
    primaryColor: "#5733FF",
    adminName: "Henry Wilson",
    logoUrl: "https://via.placeholder.com/40x40.png?text=GYM",
  },
  {
    id: 9,
    businessId: "BIZ-009", // Changed businessId to be unique
    businessName: "Quick Bites Cafe",
    type: "RESTAURANT", // Added a new type for variety
    location: "Kilimani, Nairobi",
    primaryColor: "#FF3357",
    adminName: "Ivy King",
    logoUrl: null,
  },
];

const BusinessTable = () => {
  const [rows, setRows] = useState(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState(""); // State for the filter dropdown

  const handleAction = (actionKey, row) => {
    if (actionKey === "view") {
      console.log("View details for:", row);
    } else if (actionKey === "edit") {
      console.log("Edit requested for:", row);
      alert(`Editing business: ${row.businessName}`);
    } else if (actionKey === "delete") {
      console.log("Delete requested for ID:", row.id);
      if (
        window.confirm(`Are you sure you want to delete ${row.businessName}?`)
      ) {
        setRows((prev) => prev.filter((r) => r.id !== row.id));
        alert(`${row.businessName} deleted successfully.`);
      }
    } else {
      console.log(`Unhandled action: ${actionKey} for row:`, row);
    }
  };

  const columns = [
    {
      field: "businessId",
      label: "Business ID", // Added new column for businessId
      minWidth: "120px",
      render: (row) => (
        <Typography variant="body2" className="font-medium text-gray-700">
          {row.businessId}
        </Typography>
      ),
    },
    {
      field: "logoUrl",
      label: "Logo",
      minWidth: "60px",
      render: (row) => (
        <Box className="flex justify-center">
          {" "}
          {/* Center content */}
          <Avatar
            src={row.logoUrl}
            alt={row.businessName}
            variant="rounded"
            sx={{
              width: 40,
              height: 40,
              backgroundColor: row.primaryColor || "#e0e0e0",
            }}
          >
            {!row.logoUrl && <ImageIcon sx={{ color: "white" }} />}
          </Avatar>
        </Box>
      ),
    },
    {
      field: "businessName",
      label: "Business Name",
      minWidth: "180px",
      render: (row) => (
        <Typography
          variant="body2"
          className="font-medium text-blue-700 hover:underline cursor-pointer"
        >
          {row.businessName}
        </Typography>
      ),
    },
    {
      field: "type",
      label: "Type",
      minWidth: "100px",
      render: (row) => (
        <Chip
          label={row.type}
          size="small"
          variant="outlined"
          className="capitalize"
        />
      ),
    },
    {
      field: "location",
      label: "Location",
      minWidth: "150px",
      render: (row) => (
        <Typography variant="body2" className="text-gray-600">
          {row.location}
        </Typography>
      ),
    },
    {
      field: "primaryColor",
      label: "Color",
      minWidth: "80px",
      render: (row) => (
        <Box className="flex justify-center">
          {" "}
          {/* Center content */}
          <Tooltip title={row.primaryColor || "N/A"} placement="right">
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: row.primaryColor || "#ccc",
                border: "1px solid #ddd",
              }}
            />
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "adminName",
      label: "Admin",
      minWidth: "120px",
      render: (row) => (
        <Typography variant="body2" className="text-gray-600">
          {row.adminName}
        </Typography>
      ),
    },
    {
      label: "Actions",
      isActionColumn: true,
      minWidth: "120px",
    },
  ];

  // Provide custom action button configurations
  const customActionConfigs = {
    view: {
      icon: ViewIcon,
      label: "View",
      tooltip: "View Business Details",
    },
    edit: {
      icon: EditIcon,
      label: "Edit",
      tooltip: "Edit Business Information",
    },
    delete: {
      icon: DeleteIcon,
      label: "Delete",
      tooltip: "Delete Business",
    },
  };

  const statusActionMap = {
    default: ["view", "edit", "delete"],
  };

  // Extract unique business types for filter options
  const filterOptions = useMemo(() => {
    const types = [...new Set(initialRows.map((row) => row.type))];
    return types.map((type) => ({ value: type, label: type }));
  }, []);

  // Filter rows based on search term and filter type
  const filteredRows = useMemo(() => {
    let currentFilteredRows = rows;

    if (searchTerm) {
      currentFilteredRows = currentFilteredRows.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterType) {
      currentFilteredRows = currentFilteredRows.filter(
        (row) => row.type === filterType
      );
    }

    return currentFilteredRows;
  }, [rows, searchTerm, filterType]);

  return (
    <Box className="p-4">
      <DataTable
        title="Managed Businesses"
        columns={columns}
        data={filteredRows.map((row) => ({ ...row, status: "default" }))} // Pass filteredRows
        statusField="status"
        statusActionMap={statusActionMap}
        customActionConfigs={customActionConfigs}
        pagination={true}
        defaultRowsPerPage={5}
        rowsPerPageOptions={[5, 10, 25]}
        onAction={handleAction}
        showToolbar={true} // Ensure toolbar is visible
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={filterOptions}
        filterValue={filterType}
        onFilterChange={setFilterType}
      />
    </Box>
  );
};

export default BusinessTable;