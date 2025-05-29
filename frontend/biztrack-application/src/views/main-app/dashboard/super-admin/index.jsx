import React from "react";
import { Grid } from "@mui/material";
import KPICards from "./KPICards";
import BusinessTable from "./BusinnessTable";
import RevenueChart from "./RevenueCharts";
import RecentTransactions from "./RecentTransaction";
import QuickActions from "./QuickAction";
import { businessData, kpiData } from "../../../../utilities/SamplData";

function SuperAdminDashboard() {
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
      <QuickActions />

      <KPICards data={kpiData} />

      <Grid container spacing={4}>
        <Grid  item xs={12} lg={8} className="w-full">
          <BusinessTable businesses={businessData} />
          <RevenueChart businesses={businessData} />
        </Grid>
      </Grid>
    </div>
  );
}

export default SuperAdminDashboard;
