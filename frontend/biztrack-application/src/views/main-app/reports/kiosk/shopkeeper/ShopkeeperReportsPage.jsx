import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  ArrowUpDown,
  Clock,
  Calendar,
} from "lucide-react";

// Mock data - replace with actual data from your backend
const mockTransactions = [
  {
    id: 1,
    customerId: 1,
    customerName: "John Doe",
    phone: "+254701234567",
    amount: 1500,
    paymentMethod: "Cash",
    status: "Completed",
    date: new Date().toISOString().split('T')[0], // Today's date
    time: "09:15",
    products: [{ name: "Rice 2kg", quantity: 2, price: 750 }],
  },
  {
    id: 2,
    customerId: 2,
    customerName: "Jane Smith",
    phone: "+254709876543",
    amount: 2300,
    paymentMethod: "M-PESA",
    status: "Completed",
    date: new Date().toISOString().split('T')[0], // Today's date
    time: "10:30",
    products: [
      { name: "Sugar 1kg", quantity: 1, price: 150 },
      { name: "Cooking Oil 1L", quantity: 1, price: 350 },
    ],
  },
  {
    id: 3,
    customerId: 3,
    customerName: "Peter Kamau",
    phone: "+254712345678",
    amount: 850,
    paymentMethod: "Debt",
    status: "Pending",
    date: new Date().toISOString().split('T')[0], // Today's date
    time: "11:45",
    products: [
      { name: "Bread", quantity: 3, price: 80 },
      { name: "Milk 500ml", quantity: 2, price: 65 },
    ],
  },
  {
    id: 4,
    customerId: 4,
    customerName: "Mary Wanjiku",
    phone: "+254723456789",
    amount: 1200,
    paymentMethod: "Debt",
    status: "Completed",
    date: new Date().toISOString().split('T')[0], // Today's date
    time: "12:20",
    products: [{ name: "Rice 2kg", quantity: 1, price: 750 }],
  },
  {
    id: 5,
    customerId: 1,
    customerName: "John Doe",
    phone: "+254701234567",
    amount: 650,
    paymentMethod: "Cash",
    status: "Completed",
    date: new Date().toISOString().split('T')[0], // Today's date
    time: "13:15",
    products: [{ name: "Sugar 1kg", quantity: 2, price: 150 }],
  },
  {
    id: 6,
    customerId: 5,
    customerName: "David Kiprop",
    phone: "+254734567890",
    amount: 1800,
    paymentMethod: "Debt",
    status: "Pending",
    date: new Date().toISOString().split('T')[0], // Today's date
    time: "14:45",
    products: [{ name: "Cooking Oil 1L", quantity: 2, price: 350 }],
  },
  {
    id: 7,
    customerId: 2,
    customerName: "Jane Smith",
    phone: "+254709876543",
    amount: 950,
    paymentMethod: "M-PESA",
    status: "Completed",
    date: new Date().toISOString().split('T')[0], // Today's date
    time: "15:30",
    products: [{ name: "Bread", quantity: 5, price: 80 }],
  },
  {
    id: 8,
    customerId: 6,
    customerName: "Grace Achieng",
    phone: "+254745678901",
    amount: 2100,
    paymentMethod: "Cash",
    status: "Completed",
    date: new Date().toISOString().split('T')[0], // Today's date
    time: "16:10",
    products: [
      { name: "Rice 2kg", quantity: 2, price: 750 },
      { name: "Sugar 1kg", quantity: 1, price: 150 },
    ],
  },
];

const formatCurrency = (amount) => `KSh ${amount.toLocaleString()}`;

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
  iconColor,
  description,
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className={`p-3 rounded-full ${bgColor}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status, type = "status" }) => {
  const getStatusColor = () => {
    if (type === "payment") {
      switch (status) {
        case "Cash":
          return "bg-green-100 text-green-800";
        case "M-PESA":
          return "bg-blue-100 text-blue-800";
        case "Debt":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } else {
      switch (status) {
        case "Completed":
          return "bg-green-100 text-green-800";
        case "Pending":
          return "bg-yellow-100 text-yellow-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}
    >
      {status}
    </span>
  );
};

export default function ShopkeeperDailyReports() {
  const [activeTab, setActiveTab] = useState(0);
  const [sortBy, setSortBy] = useState("time");
  const [sortOrder, setSortOrder] = useState("desc");

  // Get current date information
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const startTime = "08:00 AM";
  const endTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Filter data for today only
  const todayData = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return mockTransactions.filter(transaction => transaction.date === today);
  }, []);

  // Calculate sales report data
  const salesData = useMemo(() => {
    const completedTransactions = todayData.filter(
      (t) => t.status === "Completed" && t.paymentMethod !== "Debt"
    );
    const totalRevenue = completedTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const totalTransactions = completedTransactions.length;

    // Calculate most sold product
    const productSales = {};
    completedTransactions.forEach((transaction) => {
      transaction.products.forEach((product) => {
        if (productSales[product.name]) {
          productSales[product.name] += product.quantity;
        } else {
          productSales[product.name] = product.quantity;
        }
      });
    });

    const mostSoldProduct = Object.entries(productSales).reduce(
      (max, [name, quantity]) =>
        quantity > max.quantity ? { name, quantity } : max,
      { name: "None", quantity: 0 }
    );

    return {
      totalRevenue,
      totalTransactions,
      mostSoldProduct,
      completedTransactions,
    };
  }, [todayData]);

  // Calculate debt report data
  const debtData = useMemo(() => {
    const debtTransactions = todayData.filter(
      (t) => t.paymentMethod === "Debt"
    );
    const pendingDebt = debtTransactions.filter((t) => t.status === "Pending");
    const recoveredDebt = debtTransactions.filter(
      (t) => t.status === "Completed"
    );

    const totalOutstanding = pendingDebt.reduce((sum, t) => sum + t.amount, 0);
    const totalRecovered = recoveredDebt.reduce((sum, t) => sum + t.amount, 0);

    return { totalOutstanding, totalRecovered, debtTransactions };
  }, [todayData]);

  // Calculate product summary data
  const productSummary = useMemo(() => {
    const productData = {};

    todayData
      .filter((t) => t.status === "Completed")
      .forEach((transaction) => {
        transaction.products.forEach((product) => {
          if (productData[product.name]) {
            productData[product.name].quantity += product.quantity;
            productData[product.name].revenue +=
              product.quantity * product.price;
          } else {
            productData[product.name] = {
              name: product.name,
              quantity: product.quantity,
              revenue: product.quantity * product.price,
            };
          }
        });
      });

    return Object.values(productData).sort((a, b) => {
      if (sortBy === "name")
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      if (sortBy === "quantity")
        return sortOrder === "asc"
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
      if (sortBy === "revenue")
        return sortOrder === "asc"
          ? a.revenue - b.revenue
          : b.revenue - a.revenue;
      return 0;
    });
  }, [todayData, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const tabs = ["Sales Report", "Debt Report", "Product Summary"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daily Reports
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">{dateString}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{startTime} - {endTime}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === index
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Sales Report Tab */}
        {activeTab === 0 && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryCard
                title="Today's Revenue"
                value={formatCurrency(salesData.totalRevenue)}
                icon={TrendingUp}
                bgColor="bg-blue-100"
                iconColor="text-blue-600"
                description="From completed transactions"
              />
              <SummaryCard
                title="Total Transactions"
                value={salesData.totalTransactions}
                icon={ShoppingCart}
                bgColor="bg-green-100"
                iconColor="text-green-600"
                description="Cash & M-PESA payments"
              />
              <SummaryCard
                title="Top Product Today"
                value={`${salesData.mostSoldProduct.name}`}
                icon={DollarSign}
                bgColor="bg-purple-100"
                iconColor="text-purple-600"
                description={`${salesData.mostSoldProduct.quantity} units sold`}
              />
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Today's Completed Transactions
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesData.completedTransactions
                      .sort((a, b) => b.time.localeCompare(a.time))
                      .map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge
                            status={transaction.paymentMethod}
                            type="payment"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.products
                            .map((p) => `${p.name} (${p.quantity})`)
                            .join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {salesData.completedTransactions.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No completed transactions today</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Debt Report Tab */}
        {activeTab === 1 && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SummaryCard
                title="Outstanding Debt Today"
                value={formatCurrency(debtData.totalOutstanding)}
                icon={Users}
                bgColor="bg-red-100"
                iconColor="text-red-600"
                description="Pending payments"
              />
              <SummaryCard
                title="Recovered Debt Today"
                value={formatCurrency(debtData.totalRecovered)}
                icon={TrendingUp}
                bgColor="bg-green-100"
                iconColor="text-green-600"
                description="Completed payments"
              />
            </div>

            {/* Debt Transactions Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Today's Debt Transactions
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount Owed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {debtData.debtTransactions
                      .sort((a, b) => b.time.localeCompare(a.time))
                      .map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={transaction.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {debtData.debtTransactions.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No debt transactions today</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Summary Tab */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Today's Product Sales Summary
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("name")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Product Name
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("quantity")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Quantity Sold
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("revenue")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Total Revenue
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productSummary.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(product.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {productSummary.length === 0 && (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No product sales today</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}