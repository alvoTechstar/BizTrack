import React, { useState } from "react";
import { Grid } from "@mui/material";
import KPICards from "./KPICards";
import BusinessTable from "../../User-Management/super-admin/BusinessTable";
import AdminTable from "../../User-Management/super-admin/AdminTable";
import TransactionsTable from "./TransactionsTable";
import RevenueTable from "./RevenueTable";
import RevenueChart from "./RevenueCharts"; // Corrected import to RevenueChart
import { businessData, kpiData } from "../../../../utilities/SamplData";

function SuperAdminDashboard() {
  // State to manage which component is visible below the cards
  // Set default view to null, and let the switch's default handle the char
  const [activeView, setActiveView] = useState(null); 

  // This function will be passed to KPICards to update the state on click
  const handleCardClick = (viewName) => {
    setActiveView(viewName);
  };

  // Helper function to render the correct component based on the active view
  const renderActiveComponent = () => {
    switch (activeView) {
      case "businesses":
        return <BusinessTable />;
      case "admins":
        return <AdminTable />;
      case "transactions":
        return <TransactionsTable />;
      case "revenue":
        return <RevenueTable />;
      default: // If activeView is null (initial) or any other unmatched value, render chart
        return <RevenueChart businesses={businessData} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Biztrack Super Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of platform performance and analytics
        </p>
      </header>

      {/* Pass the handler function to the KPICards component */}
      <KPICards data={kpiData} onCardClick={handleCardClick} />

      <Grid container spacing={4}>
        <Grid item xs={12} className="w-full">
          {/* The content here changes based on the card clicked */}
          {renderActiveComponent()}
        </Grid>
      </Grid>
    </div>
  );
}

export default SuperAdminDashboard;