import React, { useState, useCallback } from "react";
import {
  Button,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import GroupIcon from "@mui/icons-material/Group";
import BusinessIcon from "@mui/icons-material/Business";
import axios from "axios";

import CreateBusinessFlow from "./CreateBusinessFlow";
import BusinessTable from "./BusinessTable";
import AdminTable from "./AdminTable";
import URLS from "../../../../utilities/Endpoints";

const API_BASE_URL = URLS.TAG_BASE_URL;

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`superadmin-usermanagement-tabpanel-${index}`}
      aria-labelledby={`superadmin-usermanagement-tab-${index}`}
      {...other}
    >
      {value === index && <Box className="pt-2">{children}</Box>}
    </div>
  );
}

function UserManagement() {
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isLoading, setIsLoading] = useState(false);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleShowCreateFlow = () => setShowCreateFlow(true);
  const handleCloseCreateFlow = () => setShowCreateFlow(false);
  
  const handleTabChange = (event, newValue) => setCurrentTab(newValue);
  
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleCreate = async (businessData, adminData) => {
    if (!businessData || !adminData) {
      setSnackbar({
        open: true,
        message: "Business and admin data are required",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!businessData.businessName?.trim() || !adminData.fullName?.trim()) {
        throw new Error("Business name and admin name are required");
      }

      if (!adminData.email?.trim() && !adminData.phoneNumber?.trim()) {
        throw new Error("Email or phone number is required for admin");
      }

      const [firstName, ...lastNameParts] = adminData.fullName.split(" ");
      const lastName = lastNameParts.join(" ") || "-"; // Provide default if no last name

      const requestBody = {
        businessData: {
          businessName: businessData.businessName.trim(),
          businessType: businessData.businessType || "GENERAL",
          email: adminData.email?.trim() || adminData.phoneNumber,
          phone: adminData.phoneNumber?.trim(),
          location: businessData.location?.trim(),
          logoUrl: businessData.logoUrl?.trim(),
          primaryColor: businessData.primaryColor?.trim() || "#1976d2",
        },
        adminData: {
          username: adminData.email?.trim() || adminData.phoneNumber,
          firstName: firstName?.trim() || "Admin",
          lastName: lastName.trim(),
          email: adminData.email?.trim(),
          phone: adminData.phoneNumber?.trim(),
          password: adminData.password,
        },
      };

      // Validate the request body
      if (!requestBody.businessData.businessName) {
        throw new Error("Business name is required");
      }

      if (!requestBody.adminData.firstName) {
        throw new Error("Admin first name is required");
      }

      const apiUrl = `${API_BASE_URL}${URLS.USER_MANAGEMENT.BUSINESS_SETUP}`;
      
      if (!apiUrl || apiUrl.includes("undefined")) {
        throw new Error("API endpoint configuration is invalid");
      }

      await axios.post(apiUrl, requestBody, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setSnackbar({
        open: true,
        message: "Business and admin created successfully! Tables refreshing...",
        severity: "success",
      });
      handleCloseCreateFlow();
      triggerRefresh();
      
    } catch (error) {
      console.error("Error creating business and admin:", error);
      
      let errorMessage = "An error occurred during creation.";
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = "Request timeout. Please try again.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 400) {
          errorMessage = "Invalid data provided. Please check your inputs.";
        } else if (error.response?.status === 401) {
          errorMessage = "Unauthorized. Please check your permissions.";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gray-50 p-3 md:p-4">
      {/* Header Section */}
      <Box className="mb-2">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography 
              variant="h6" 
              component="h1" 
              className="font-medium text-gray-800"
            >
              User & Business Management
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Oversee administrators and businesses.
            </Typography>
          </Grid>
          <Grid item>
            {!showCreateFlow && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddBusinessIcon />}
                onClick={handleShowCreateFlow}
                className="transition-transform hover:scale-105"
                sx={{
                  textTransform: "none",
                  fontSize: "0.75rem",
                  py: 0.75,
                  px: 1.5,
                  borderRadius: "0.5rem",
                }}
              >
                Add Business & Admin
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Create Business Flow */}
      {showCreateFlow && (
        <Box className="mb-4">
          <Box className="bg-white rounded-md shadow-sm p-4">
            <CreateBusinessFlow 
              onCreate={handleCreate} 
              isLoading={isLoading}
            />
            <div className="mt-3 flex justify-end">
              <Button
                variant="outlined"
                onClick={handleCloseCreateFlow}
                disabled={isLoading}
                sx={{
                  textTransform: "none",
                  fontSize: "0.75rem",
                  borderRadius: "0.5rem",
                  py: 0.5,
                  px: 1.5,
                }}
              >
                Close
              </Button>
            </div>
          </Box>
          <Divider className="my-4" />
        </Box>
      )}

      {/* Tabs Section */}
      {!showCreateFlow && (
        <Box className="w-full">
          <Box className="flex justify-center border-b border-gray-200">
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="User and Business Management Tabs"
              centered
              sx={{
                width: "100%",
                minHeight: "32px",
                "& .MuiTabs-flexContainer": {
                  justifyContent: "center",
                },
                "& .MuiTab-root": {
                  minHeight: "32px",
                  fontSize: "0.75rem",
                  textTransform: "none",
                  px: 2,
                },
                "& .MuiTabs-indicator": {
                  height: "2px",
                  backgroundColor: "#1976d2",
                },
              }}
            >
              <Tab
                icon={<BusinessIcon fontSize="small" />}
                iconPosition="start"
                label="Businesses"
                id="superadmin-usermanagement-tab-0"
                aria-controls="superadmin-usermanagement-tabpanel-0"
              />
              <Tab
                icon={<GroupIcon fontSize="small" />}
                iconPosition="start"
                label="Admins"
                id="superadmin-usermanagement-tab-1"
                aria-controls="superadmin-usermanagement-tabpanel-1"
              />
            </Tabs>
          </Box>
          
          <Box className="mb-2">
            <TabPanel value={currentTab} index={0}>
              <BusinessTable 
                refreshKey={refreshKey} 
                triggerRefresh={triggerRefresh} 
                setSnackbar={setSnackbar} 
              />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              <AdminTable 
                refreshKey={refreshKey} 
                triggerRefresh={triggerRefresh} 
                setSnackbar={setSnackbar} 
              />
            </TabPanel>
          </Box>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UserManagement;