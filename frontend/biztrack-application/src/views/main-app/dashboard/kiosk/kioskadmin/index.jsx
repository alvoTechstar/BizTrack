import React, { useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  Smartphone,
  Package,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import StatsCard from "./StatsCard";
import DataTable from "../../../../../components/datatable";

// Helper: parse amount string like "KSh 7,500" → 7500 number
function parseAmount(amountStr) {
  if (!amountStr) return 0;
  return Number(amountStr.replace(/[^0-9.-]+/g, ""));
}

export default function DashboardPage() {
  const transactions = [
    {
      id: "TXN001",
      datetime: "2025-05-22 11:23 AM",
      products: ["Product A", "Product B", "Product C", "Product D", "Product E", "Product F"],
      amount: "KSh 7,500",
      payment: "M-PESA",
      status: "Completed",
    },
    {
      id: "TXN002",
      datetime: "2025-05-22 10:45 AM",
      products: ["Product C"],
      amount: "KSh 5,800",
      payment: "Cash",
      status: "Completed",
    },
    {
      id: "TXN003",
      datetime: "2025-05-22 09:15 AM",
      products: ["Product A", "Product B"],
      amount: "KSh 3,200",
      payment: "M-PESA",
      status: "Failed",
    },
    {
      id: "TXN004",
      datetime: "2025-05-22 08:30 AM",
      products: ["Product D", "Product E", "Product F", "Product G", "Product H", "Product I", "Product J", "Product K", "Product L", "Product M", "Product N"],
      amount: "KSh 15,000",
      payment: "Cash",
      status: "Completed",
    },
    {
      id: "TXN005",
      datetime: "2025-05-22 12:00 PM",
      products: ["Product X", "Product Y"],
      amount: "KSh 4,200",
      payment: "Debt",
      status: "Pending",
      debtCustomer: {
        name: "Jane Doe",
        phone: "0712345678",
        expectedPaymentDate: "2025-05-30",
      },
    },
  ];

  // Calculate total sales from only completed and payment method cash or mpesa
  const totalSalesToday = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          t.status.toLowerCase() === "completed" &&
          (t.payment.toLowerCase() === "cash" ||
            t.payment.toLowerCase() === "m-pesa")
      )
      .reduce((sum, t) => sum + parseAmount(t.amount), 0);
  }, [transactions]);

  // For demo, profit assumed as 35% of sales
  const totalProfitToday = (totalSalesToday * 0.35).toFixed(0);

  // Count payments for pie chart (only completed cash/mpesa)
  const paymentCounts = transactions.reduce(
    (acc, t) => {
      if (t.status.toLowerCase() !== "completed") return acc;
      if (t.payment.toLowerCase() === "cash") acc.cash++;
      else if (t.payment.toLowerCase() === "m-pesa") acc.mpesa++;
      return acc;
    },
    { cash: 0, mpesa: 0 }
  );

  const paymentData = [
    { name: "M-PESA", value: paymentCounts.mpesa },
    { name: "Cash", value: paymentCounts.cash },
  ];

  // Mock product sales data for bar chart
  const productData = [
    { name: "Product A", sales: 2400 },
    { name: "Product B", sales: 1398 },
    { name: "Product C", sales: 9800 },
    { name: "Product D", sales: 3908 },
  ];

  // Define headers in the format your DataTable expects
  const headers = [
    { key: "id", title: "Transaction ID" },
    { key: "datetime", title: "Date & Time" },
    { key: "products", title: "Products" },
    { key: "amount", title: "Total Amount" },
    { key: "payment", title: "Payment Method" },
    { key: "status", title: "Status" },
  ];

  // Transform data to match your DataTable's expected format
  const tableData = transactions.map(transaction => ({
    ...transaction,
    // Ensure the data is in the format your DataTable expects
    products: Array.isArray(transaction.products) 
      ? transaction.products.join(", ") 
      : transaction.products,
  }));

  // Required callback functions for your DataTable
  const handleSelectedRow = (e, row) => {
    console.log("Row selected:", row);
  };

  const handleSelectedAction = (selected) => {
    console.log("Selected actions:", selected);
  };

  const handleActionSelected = (action, id) => {
    console.log("Action:", action, "ID:", id);
  };

  return (
    <div className="min-h-screen bg-white p-2">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700">Sales Overview</h2>
        <p className="text-sm text-gray-500">
          Welcome back! Here's your business at a glance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Sales Today"
          value={`KSh ${totalSalesToday.toLocaleString()}`}
          change="+8.2%"
          icon={<DollarSign />}
          color="blue"
        />
        <StatsCard
          title="Profit Today"
          value={`KSh ${Number(totalProfitToday).toLocaleString()}`}
          change="+5.7%"
          icon={<TrendingUp />}
          color="green"
        />
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-700 font-medium">M-PESA vs Cash</h3>
              <Smartphone size={20} className="text-purple-600" />
            </div>
          </div>
          <div className="px-5 py-2 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {paymentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#3b82f6", "#10b981"][index % 2]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-700 font-medium">
                Top Selling Products
              </h3>
              <Package size={20} className="text-amber-600" />
            </div>
          </div>
          <div className="px-2 py-2 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productData}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.3}
                />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <RechartsTooltip />
                <Bar
                  dataKey="sales"
                  fill="#3b82f6"
                  barSize={12}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Transactions
        </h3>
        <DataTable
          data={tableData}
          headers={headers}
          type="default"
          pagination={false}
          searchFilter=""
          actions={[]} // Empty array since we don't need actions
          selected={[]}
          selectAll={false}
          // Required callback functions
          selectedRow={handleSelectedRow}
          selectedAction={handleSelectedAction}
          actionSelected={handleActionSelected}
          // Optional props with safe defaults
          clickable={true}
          color="primary"
        />
      </div>
    </div>
  );
}