import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Chip,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import axios from "axios";
import DataTable from "../../../../components/datatable";
import URLS from "../../../../utilities/Endpoints";
import { DELETE, PUT } from "../../../../services/DatabaseServiceImp";
import ContentLoader from "../../../../components/Loader/ContentLoader";
import AddButton from "../../../../components/buttons/AddButton"
import SearchInput from "../../../../components/input/SearchInput"
import TextButton from "../../../../components/buttons/TextButton";
import FilterInput from "../../../../components/input/FilterInput";
import { getRowValue } from "../../../../utilities/SharedFunctions";


// Define headers similar to BranchHeaders
const BusinessHeaders = [
  { key: "all", title: "All" },
  { key: "businessId", title: "Business ID" },
  { key: "logo", title: "Logo" },
  { key: "businessName", title: "Business Name" },
  { key: "type", title: "Type" },
  { key: "location", title: "Location" },
  { key: "primaryColor", title: "Color" },
  { key: "adminName", title: "Admin" },
  { key: "status", title: "Status" },
  { key: "action", title: "Action" },
];

const BusinessActions = ["View", "Edit", "Delete"];

const STATUS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const BusinessTable = ({ refreshKey, triggerRefresh, setSnackbar, color }) => {
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

  // Function to fetch business data
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${URLS.TAG_BASE_URL}${URLS.USER_MANAGEMENT.BUSINESSES}`
      );
      const businessData = response.data.data || response.data || [];
      setRows(Array.isArray(businessData) ? businessData : []);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      setSnackbar({
        open: true,
        message: "Failed to load businesses.",
        severity: "error",
      });
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
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
      console.log("View business:", getRowValue(rows, index));
      // Handle view logic
    } else if (action === "Edit") {
      console.log("Edit business:", getRowValue(rows, index));
      // Handle edit logic
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
    setLoadingText("Deleting Business");
    setView(2);

    try {
      for (const element of selected) {
        const deleteUrl = `${API_BASE_URL}${URLS.USER_MANAGEMENT.BUSINESS_BY_ID}`.replace(
          ":id",
          element
        );
        await axios.delete(deleteUrl);
      }

      setSelected([]);
      handleResponse(true, "Business Deleted Successfully");
      triggerRefresh();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete business.";
      handleResponse(false, errorMessage);
      console.error("Error deleting business:", error);
    }
  };

  const handleSelectRecord = (rows) => {
    setSelected([...rows]);
  };

  const handleSelectedStates = (rows) => {
    setSelectedStates([...rows]);
  };

  const handleAddBusiness = () => {
    // This would open the create business flow from parent
    console.log("Add business clicked");
  };

  // Prepare data for DataTable
  const tableData = rows.map((row) => ({
    ...row,
    id: row.id || row.businessId,
    logo: (
      <Box className="flex justify-center">
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
    primaryColor: (
      <Box className="flex justify-center">
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
    type: (
      <Chip
        label={row.type}
        size="small"
        variant="outlined"
        className="capitalize"
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
  }));

  if (loading) {
    return (
      <Box className="flex justify-center items-center p-8">
        <CircularProgress size={40} />
        <Typography variant="body1" className="ml-4 text-gray-600">
          Loading businesses...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <div className="main-app-content-title">
        <span>Business Management</span>
      </div>
      <div className="main-app-view">
        {view === 1 ? (
          <div className="main-app-content-container">
            <div className="confirmation-dialog">
              <Typography variant="h6" className="confirmation-title">
                Confirm Delete
              </Typography>
              <Typography variant="body1" className="confirmation-message">
                Are you sure you want to delete {selected.length} business(es)?
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
                  style={{ backgroundColor: color }}
                >
                  {actionLoading ? "Deleting..." : "Delete"}
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
                  placeholder={"Search businesses..."}
                  input={searchFilter}
                  handleInput={handleInput}
                  handleClear={() => setSearchFilter("")}
                />
                <div className="filter-flex">
                  <FilterInput
                    color={color}
                    label={"Businesses"}
                    options={["Status"]}
                    filters={STATUS}
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
                text={"Add Business"}
                action={handleAddBusiness}
                color={color}
              />
            </div>
            <div className="display-flex main-app-table-controls">
              {selected.length > 0 ? (
                <div className="main-app-table-actions">
                  <span>Selected {selected.length} businesses:</span>
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
              headers={BusinessHeaders}
              data={tableData}
              searchFilter={searchFilter}
              openFilter={Boolean(anchorEl)}
              columnFilters={["status"]}
              columnFilter={selectedStates}
              selected={selected}
              clickable={true}
              actions={BusinessActions}
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

export default BusinessTable;