// src/views/main-app/reports/super-admin/components/PaymentBreakdownChart.jsx
import React, { useMemo } from 'react';
import { Paper, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper to format currency
const formatKSh = (amount) => {
  return `KSh ${parseFloat(amount).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Define a set of colors for the pie chart segments
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28F6C', '#FF6666'];

const PaymentBreakdownChart = ({ transactions }) => {
  // Memoize the data transformation for the pie chart
  const paymentBreakdownData = useMemo(() => {
    // Aggregate commissions by payment method
    const breakdown = transactions.reduce((acc, curr) => {
      acc[curr.paymentMethod] = (acc[curr.paymentMethod] || 0) + curr.commission;
      return acc;
    }, {});

    // Convert the aggregated object into an array suitable for Recharts PieChart
    return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  }, [transactions]); // Recalculate only when transactions prop changes

  return (
    <Paper elevation={2} className="p-4 rounded-lg min-h-[300px] flex flex-col items-center justify-center">
      <Typography variant="h6" className="text-gray-700 font-semibold mb-4">Commission Split by Payment Method</Typography>
      {paymentBreakdownData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={paymentBreakdownData}
              cx="50%" // Center X position
              cy="50%" // Center Y position
              outerRadius={100} // Outer radius of the pie slices
              fill="#8884d8" // Default fill color if cells don't override
              dataKey="value" // Key from data that represents the slice value
              labelLine={false} // Hide the lines connecting labels to slices
              // Custom label formatter to show method name and percentage
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {/* Map over data to assign a unique color to each slice */}
              {paymentBreakdownData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            {/* Tooltip to show detailed info on hover, formatted with KSh */}
            <Tooltip formatter={(value) => formatKSh(value)} />
            {/* Legend to explain what each color represents */}
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <Typography className="text-gray-500">No payment breakdown data for the selected period.</Typography>
      )}
    </Paper>
  );
};

export default PaymentBreakdownChart;