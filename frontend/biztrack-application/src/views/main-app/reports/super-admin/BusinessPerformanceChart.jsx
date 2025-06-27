// src/views/main-app/reports/super-admin/components/BusinessPerformanceCharts.jsx
import React, { useMemo } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DataTable from "../../../../components/datatable"; // Adjust path

const formatKSh = (amount) => {
  return `KSh ${parseFloat(amount).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const BusinessPerformanceCharts = ({ transactions }) => {
  const businessPerformanceData = useMemo(() => {
    const businessCommissions = transactions.reduce((acc, curr) => {
      acc[curr.businessName] = (acc[curr.businessName] || 0) + curr.commission;
      return acc;
    }, {});

    const sortedBusinesses = Object.entries(businessCommissions)
      .map(([name, commission]) => ({ name, commission }))
      .sort((a, b) => b.commission - a.commission); // Descending order

    const top5Businesses = sortedBusinesses.slice(0, 5);

    return { all: sortedBusinesses, top5: top5Businesses };
  }, [transactions]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper
          elevation={2}
          className="p-4 rounded-lg min-h-[300px] flex flex-col items-center justify-center"
        >
          <Typography variant="h6" className="text-gray-700 font-semibold mb-4">
            Top Businesses by Commission
          </Typography>
          {businessPerformanceData.all.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={businessPerformanceData.top5}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis tickFormatter={(value) => formatKSh(value)} />
                <Tooltip formatter={(value) => formatKSh(value)} />
                <Legend />
                <Bar
                  dataKey="commission"
                  fill="#82ca9d"
                  name="Total Commission"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography className="text-gray-500">
              No business performance data for the selected period.
            </Typography>
          )}
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4 rounded-lg">
          <Typography variant="h6" className="text-gray-700 font-semibold mb-4">
            Top 5 Businesses
          </Typography>
          {businessPerformanceData.top5.length > 0 ? (
            <DataTable
              data={businessPerformanceData.top5.map((b, i) => ({
                ...b,
                rank: i + 1,
              }))}
              columns={[
                {
                  field: "rank",
                  label: "Rank",
                  minWidth: "50px",
                  render: (row) => (
                    <Typography
                      variant="body2"
                      className="font-bold text-gray-700"
                    >
                      {row.rank}
                    </Typography>
                  ),
                },
                {
                  field: "name",
                  label: "Business Name",
                  minWidth: "150px",
                  render: (row) => (
                    <Typography variant="body2" className="text-gray-600">
                      {row.name}
                    </Typography>
                  ),
                },
                {
                  field: "commission",
                  label: "Commission",
                  minWidth: "100px",
                  render: (row) => (
                    <Typography
                      variant="body2"
                      className="text-right font-semibold text-green-700"
                    >
                      {formatKSh(row.commission)}
                    </Typography>
                  ),
                },
              ]}
              getRowId={(row) => row.name}
              pagination={false}
              showToolbar={false}
            />
          ) : (
            <Typography className="text-gray-500">
              No businesses to rank for the selected period.
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default BusinessPerformanceCharts;
