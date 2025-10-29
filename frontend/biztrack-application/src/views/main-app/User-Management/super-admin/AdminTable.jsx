import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Chip,
  Typography,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VpnKey as ResetPasswordIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import axios from "axios";
import DataTable from "../../../../components/datatable";
import URLS from "../../../../utilities/Endpoints";
import { DELETE, PUT } from "../../../../services/DatabaseServiceImp";
import ContentLoader from "../../../../components/Loader/ContentLoader";
import AddButton from "../../../../components/buttons/AddButton";
import SearchInput from "../../../../components/input/SearchInput";
import TextButton from "../../../../components/buttons/TextButton";
import FilterInput from "../../../../components/input/FilterInput";
import { getRowValue } from "../../../../utilities/SharedFunctions";

const API_BASE_URL = URLS.TAG_BASE_URL;

// Define headers similar to BusinessHeaders
const AdminHeaders = [
  { key: "all", title: "All" },
  { key: "associatedBusinessId", title: "Business ID" },
  { key: "businessName", title: "Business" },
  { key: "fullName", title: "Name" },
  { key: "phoneNumber", title: "Phone Number" },
  { key: "email", title: "Email" },
  { key: "role", title: "Role" },
  { key: "status", title: "Status" },
  { key: "action", title: "Action" },
];

const AdminActions = ["View", "Reset Password", "Delete"];

const STATUS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const AdminTable = ({ refreshKey, triggerRefresh, setSnackbar, color }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedStates, setSelectedStates] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [tableFilter, setTableFilter] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [view, setView] = useState(0);
  const [state, setState] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [loadedText, setLoadedText] = useState("");

  // Function to fetch admin data
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}${URLS.USER_MANAGEMENT.ADMINS}`
      );
      const adminData = response.data.data || response.data || [];
      setRows(Array.isArray(adminData) ? adminData : []);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      setSnackbar({
        open: true,
        message: "Failed to load admin users.",
        severity: "error",
      });
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [refreshKey]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    if (id === "search") {
      setSearchFilter(value);
    }
  };

  const handleTableView = (view, action, index) => {
    if (action === "View") {
      console.log("View admin:", getRowValue(rows, index));
      // Handle view logic
    } else if (action === "Reset Password") {
      setState("RESET_PASSWORD");
      setView(1);
      setSelected([getRowValue(rows, index)?.id]);
    } else if (action === "Delete") {
      setState("DELETE");
      setView(1);
      setSelected([getRowValue(rows, index)?.id]);
    }
  };

  const handleResponse = (status, text) => {
    setTimeout(() => {
      setActionLoading(false);
      setLoadingState(status);
      setLoadedText(text);
    }, 1000);
    setTimeout(() => {
      setView(status === true ? 0 : 1);
    }, 4000);
  };

  const handleAction = async () => {
    setActionLoading(true);
    setLoadingText(state === "DELETE" ? "Deleting Admin" : "Resetting Password");
    setView(2);

    try {
      if (state === "DELETE") {
        for (const element of selected) {
          const deleteUrl = `${API_BASE_URL}${URLS.USER_MANAGEMENT.USER_BY_ID}`.replace(
            ":id",
            element
          );
          await axios.delete(deleteUrl);
        }
        handleResponse(true, "Admin Deleted Successfully");
      } else if (state === "RESET_PASSWORD") {
        for (const element of selected) {
          const admin = getRowValue(rows, element);
          const resetPasswordUrl = `${API_BASE_URL}${URLS.AUTH.RESET_PASSWORD}`;
          await axios.post(resetPasswordUrl, { 
            adminId: admin.id, 
            email: admin.email 
          });
        }
        handleResponse(true, "Password Reset Triggered Successfully");
      }
      
      triggerRefresh();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        (state === "DELETE" ? "Failed to delete admin." : "Failed to reset password.");
      handleResponse(false, errorMessage);
      console.error("Error performing action:", error);
    }
  };

  const handleSelectRecord = (rows) => {
    setSelected([...rows]);
  };

  const handleSelectedStates = (rows) => {
    setSelectedStates([...rows]);
  };

  const handleAddAdmin = () => {
    // This would open the create admin flow from parent
    console.log("Add admin clicked");
  };

  // Prepare data for DataTable
  const tableData = rows.map((row) => ({
    ...row,
    id: row.id,
    associatedBusinessId: (
      <Typography variant="body2" className="font-medium text-gray-700">
        {row.associatedBusinessId || "N/A"}
      </Typography>
    ),
    businessName: (
      <Typography
        variant="body2"
        className="text-blue-700 hover:underline cursor-pointer"
        onClick={() => handleTableView(0, "View", row.id)}
      >
        {row.businessName}
      </Typography>
    ),
    fullName: (
      <Typography variant="body2" className="font-medium text-gray-700">
        {row.fullName}
      </Typography>
    ),
    phoneNumber: (
      <Typography variant="body2" className="text-gray-600">
        {row.phoneNumber}
      </Typography>
    ),
    email: (
      <Typography variant="body2" className="text-gray-600">
        {row.email || "N/A"}
      </Typography>
    ),
    role: (
      <Chip
        label={row.role}
        size="small"
        color="primary"
        variant="outlined"
        className="capitalize"
        sx={{ borderRadius: "8px" }}
      />
    ),
    status: (
      <Chip
        label={row.status || "ACTIVE"}
        size="small"
        color={row.status === "ACTIVE" ? "success" : "default"}
        variant="outlined"
      />
    ),
    action: (
      <Box className="flex space-x-1">
        <Tooltip title="View Details">
          <ViewIcon 
            className="cursor-pointer text-blue-600 hover:text-blue-800"
            onClick={() => handleTableView(0, "View", row.id)}
            fontSize="small"
          />
        </Tooltip>
        <Tooltip title="Reset Password">
          <ResetPasswordIcon 
            className="cursor-pointer text-orange-600 hover:text-orange-800"
            onClick={() => handleTableView(1, "Reset Password", row.id)}
            fontSize="small"
          />
        </Tooltip>
        <Tooltip title="Delete Admin">
          <DeleteIcon 
            className="cursor-pointer text-red-600 hover:text-red-800"
            onClick={() => handleTableView(1, "Delete", row.id)}
            fontSize="small"
          />
        </Tooltip>
      </Box>
    ),
  }));

  // Extract unique roles for filter options
  const filterOptions = useMemo(() => {
    if (!Array.isArray(rows) || rows.length === 0) return [];
    const roles = [...new Set(rows.map((row) => row.role).filter(Boolean))];
    return roles.map((role) => ({ 
      value: role, 
      label: role
        .replace("_ADMIN", " Admin")
        .replace("_", " ")
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ")
    }));
  }, [rows]);

  if (loading) {
    return (
      <Box className="flex justify-center items-center p-8">
        <CircularProgress size={40} />
        <Typography variant="body1" className="ml-4 text-gray-600">
          Loading administrators...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <div className="main-app-content-title">
        <span>Admin Management</span>
      </div>
      <div className="main-app-view">
        {view === 1 ? (
          <div className="main-app-content-container">
            <div className="confirmation-dialog">
              <Typography variant="h6" className="confirmation-title">
                Confirm {state === "DELETE" ? "Delete" : "Password Reset"}
              </Typography>
              <Typography variant="body1" className="confirmation-message">
                {state === "DELETE" 
                  ? `Are you sure you want to delete ${selected.length} admin(s)?`
                  : `Are you sure you want to reset password for ${selected.length} admin(s)?`
                }
              </Typography>
              <div className="confirmation-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setView(0)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleAction}
                  disabled={actionLoading}
                  style={{ backgroundColor: state === "DELETE" ? "#d32f2f" : color }}
                >
                  {actionLoading 
                    ? (state === "DELETE" ? "Deleting..." : "Resetting...") 
                    : (state === "DELETE" ? "Delete" : "Reset Password")
                  }
                </button>
              </div>
            </div>
          </div>
        ) : view === 2 ? (
          <div className="main-app-content-container">
            <ContentLoader
              state={loadingState}
              loadingText={loadingText}
              loadedText={loadedText}
              loading={actionLoading}
              color={color}
            />
          </div>
        ) : (
          <div className="main-app-table-container">
            <div className="display-flex main-app-table-controls">
              <div className="display-flex">
                <SearchInput
                  id={"search"}
                  placeholder={"Search admins..."}
                  input={searchFilter}
                  handleInput={handleInput}
                  handleClear={() => setSearchFilter("")}
                />
                <div className="filter-flex">
                  <FilterInput
                    color={color}
                    label={"Admins"}
                    options={["Role", "Status"]}
                    filters={filterOptions.concat(STATUS)}
                    selected={selectedStates}
                    tableFilter={tableFilter}
                    anchorEl={anchorEl}
                    selectedAction={handleSelectedStates}
                    handleTableFilter={setTableFilter}
                    handleClick={handleClick}
                    handleClose={handleClose}
                  />
                </div>
              </div>
              <AddButton
                text={"Add Admin"}
                action={handleAddAdmin}
                color={color}
              />
            </div>
            <div className="display-flex main-app-table-controls">
              {selected.length > 0 ? (
                <div className="main-app-table-actions">
                  <span>Selected {selected.length} admins:</span>
                  <TextButton
                    actionText={"Reset Password"}
                    alignment={"center"}
                    disabled={false}
                    action={() => {
                      setState("RESET_PASSWORD");
                      setView(1);
                    }}
                    color={color}
                  />
                  <TextButton
                    actionText={"Delete"}
                    alignment={"center"}
                    disabled={false}
                    action={() => {
                      setState("DELETE");
                      setView(1);
                    }}
                    color={"#d32f2f"}
                  />
                </div>
              ) : null}
            </div>
            <DataTable
              headers={AdminHeaders}
              data={tableData}
              searchFilter={searchFilter}
              openFilter={Boolean(anchorEl)}
              columnFilters={["role", "status"]}
              columnFilter={selectedStates}
              selected={selected}
              clickable={true}
              actions={AdminActions}
              all={selectAll}
              selectAll={setSelectAll}
              selectedAction={handleSelectRecord}
              actionSelected={handleTableView}
              color={color}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AdminTable;