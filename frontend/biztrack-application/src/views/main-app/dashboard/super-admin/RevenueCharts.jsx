import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, Typography } from "@mui/material";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const BusinessCharts = ({ businesses }) => {
  // Aggregate data for charts
  const revenueByType = businesses.reduce((acc, business) => {
    const type = business.type.charAt(0).toUpperCase() + business.type.slice(1);
    acc[type] = (acc[type] || 0) + business.totalRevenue;
    return acc;
  }, {});

  const totalTransactionsByType = businesses.reduce((acc, business) => {
    const type = business.type.charAt(0).toUpperCase() + business.type.slice(1);
    acc[type] = (acc[type] || 0) + business.totalTransactions;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(revenueByType),
    datasets: [
      {
        label: "Revenue (KSh in 1000s)",
        data: Object.values(revenueByType).map((v) => v / 1000),
        backgroundColor: "#6366f1",
      },
    ],
  };

  const doughnutChartData = {
    labels: Object.keys(totalTransactionsByType),
    datasets: [
      {
        label: "Transactions",
        data: Object.values(totalTransactionsByType),
        backgroundColor: [
          "#6366f1",
          "#06b6d4",
          "#10b981",
          "#f59e0b",
          "#ef4444",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full font-[Averta]">
      {/* Bar Chart */}
      <Card className="flex-1 shadow-lg">
        <CardContent>
          <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
            Revenue by Business Type
          </Typography>
          <div className="h-80">
            <Bar
              data={barChartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Doughnut Chart */}
      <Card className="flex-1 shadow-lg">
        <CardContent>
          <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
            Transactions by Business Type
          </Typography>
          <div className="h-80">
            <Doughnut
              data={doughnutChartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessCharts;
