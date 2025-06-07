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

// Status badge component
function StatusBadge({ status }) {
  const statusMap = {
    completed: {
      color: "bg-green-100 text-green-700",
      icon: <CheckCircle size={16} />,
    },
    pending: {
      color: "bg-yellow-100 text-yellow-700",
      icon: <Clock size={16} />,
    },
    failed: {
      color: "bg-red-100 text-red-700",
      icon: <AlertCircle size={16} />,
    },
  };
  const key = status.toLowerCase();
  const badge = statusMap[key] || {
    color: "bg-gray-100 text-gray-700",
    icon: null,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${badge.color}`}
    >
      {badge.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Payment method icon component
function PaymentMethodIcon({ method }) {
  const methodLower = method.toLowerCase();
  if (methodLower === "m-pesa")
    return <Smartphone size={16} className="inline mr-1 text-green-600" />;
  if (methodLower === "cash")
    return <DollarSign size={16} className="inline mr-1 text-yellow-600" />;
  if (methodLower === "debt")
    return <CreditCard size={16} className="inline mr-1 text-purple-600" />;
  return <CreditCard size={16} className="inline mr-1 text-gray-600" />;
}

// Products cell with tooltip for many products
function ProductsCell({ products }) {
  const maxVisible = 3;
  if (products.length <= maxVisible) {
    return <span>{products.join(", ")}</span>;
  }
  const visibleProducts = products.slice(0, maxVisible);
  const remainingCount = products.length - maxVisible;
  const tooltipText = products.join(", ");

  return (
    <span title={tooltipText} className="cursor-help select-none">
      {visibleProducts.join(", ")}{" "}
      <span className="text-gray-500">+{remainingCount} more</span>
    </span>
  );
}

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
      products: [
        "Product A",
        "Product B",
        "Product C",
        "Product D",
        "Product E",
        "Product F",
      ],
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
      id: "TXN004",
      datetime: "2025-05-22 08:30 AM",
      products: [
        "Product D",
        "Product E",
        "Product F",
        "Product G",
        "Product H",
        "Product I",
        "Product J",
        "Product K",
        "Product L",
        "Product M",
        "Product N",
      ],
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
          (t.payment.toLowerCase() === "cash" || t.payment.toLowerCase() === "m-pesa")
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

  // Columns for transactions table
  const transactionColumns = [
    { label: "Transaction ID", field: "id" },
    { label: "Date & Time", field: "datetime" },
    { label: "Products", field: "products" },
    { label: "Total Amount", field: "amount" },
    { label: "Payment Method", field: "payment" },
    { label: "Status", field: "status" },
  ];

  // Render cells for special columns
  const renderRowContent = (row, col) => {
    switch (col.field) {
      case "products":
        return <ProductsCell products={row.products} />;
      case "payment":
        return (
          <>
            <PaymentMethodIcon method={row.payment} />
            {row.payment}
          </>
        );
      case "status":
        return <StatusBadge status={row.status} />;
      default:
        return row[col.field];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <main className="p-4 md:p-6 w-full max-w-7xl mx-auto">
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
            columns={transactionColumns}
            data={transactions}
            renderActions={null}
            renderCell={(row, col) => renderRowContent(row, col)}
            keyField="id"
            striped
            hover
          />
        </div>
      </main>
    </div>
  );
}
