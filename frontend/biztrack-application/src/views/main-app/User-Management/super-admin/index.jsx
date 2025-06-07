import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import GroupIcon from "@mui/icons-material/Group";
import BusinessIcon from "@mui/icons-material/Business";

import CreateBusinessFlow from "./CreateBusinessFlow";
import BusinessTable from "./BusinessTable";
import AdminTable from "./AdminTable";

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

  const handleShowCreateFlow = () => setShowCreateFlow(true);
  const handleCloseCreateFlow = () => setShowCreateFlow(false);
  const handleTabChange = (event, newValue) => setCurrentTab(newValue);

  return (
    <Box className="min-h-screen bg-gray-50 p-3 md:p-4">
      {/* Minimal Header */}
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

      {/* Create Flow Section */}
      {showCreateFlow && (
        <Box className="mb-4">
          <Box className="bg-white rounded-md shadow-sm p-4">
            <CreateBusinessFlow />
            <div className="mt-3 flex justify-end">
              <Button
                variant="outlined"
                onClick={handleCloseCreateFlow}
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

      {/* Tabs and Tables */}
      {!showCreateFlow && (
        <Box className="w-full">
          {/* Tabs centered with full underline */}
          <Box className="flex justify-center border-b border-gray-200 mt">
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
                  width: "100%",
                },
              }}
            >
              <Tab
                icon={<GroupIcon fontSize="small" />}
                iconPosition="start"
                label="Admins"
                id="superadmin-usermanagement-tab-0"
                aria-controls="superadmin-usermanagement-tabpanel-0"
              />
              <Tab
                icon={<BusinessIcon fontSize="small" />}
                iconPosition="start"
                label="Businesses"
                id="superadmin-usermanagement-tab-1"
                aria-controls="superadmin-usermanagement-tabpanel-1"
              />
            </Tabs>
          </Box>

          {/* Margin below tabs */}
          <Box className=" mb-2">
            <TabPanel value={currentTab} index={0}>
              <AdminTable />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              <BusinessTable />
            </TabPanel>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default UserManagement;
