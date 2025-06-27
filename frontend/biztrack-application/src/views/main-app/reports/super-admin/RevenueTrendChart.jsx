// src/views/main-app/reports/super-admin/components/RevenueTrendChart.jsx
import React, { useMemo } from "react";
import { Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

const formatKSh = (amount) => {
  return `KSh ${parseFloat(amount).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const RevenueTrendChart = ({ transactions }) => {
  const revenueTrendData = useMemo(() => {
    const dailyData = transactions.reduce((acc, curr) => {
      const date = curr.date;
      acc[date] = (acc[date] || 0) + curr.commission;
      return acc;
    }, {});

    return Object.entries(dailyData)
      .map(([date, commission]) => ({ date, commission }))
      .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  }, [transactions]);

  return (
    <Paper
      elevation={2}
      className="p-4 rounded-lg min-h-[300px] flex items-center justify-center"
    >
      {revenueTrendData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={revenueTrendData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => formatKSh(value)} />
            <Tooltip formatter={(value) => formatKSh(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="commission"
              stroke="#8884d8"
              name="Daily Commission"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Typography className="text-gray-500">
          No revenue trend data for the selected period.
        </Typography>
      )}
    </Paper>
  );
};

export default RevenueTrendChart;
