import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Download, 
  Printer, 
  FileText, 
  Calendar,
  TrendingUp,
  Users,
  ShoppingCart,
  AlertCircle
} from 'lucide-react';

// Mock data
const mockSalesData = {
  totalRevenue: 485650,
  transactionCount: 342,
  paymentMethods: [
    { method: 'M-Pesa', amount: 285430, count: 198 },
    { method: 'Cash', amount: 142850, count: 89 },
    { method: 'Card', amount: 57370, count: 55 }
  ]
};

const mockProductData = [
  { name: 'Coca Cola 500ml', quantitySold: 145, revenue: 21750 },
  { name: 'Bread Loaf', quantitySold: 89, revenue: 13350 },
  { name: 'Milk 1L', quantitySold: 67, revenue: 8040 },
  { name: 'Rice 2kg', quantitySold: 34, revenue: 8500 },
  { name: 'Cooking Oil 1L', quantitySold: 28, revenue: 9800 }
];

const mockDebtData = [
  { customer: 'John Kamau', amount: 2500, status: 'Pending', date: '2024-01-15' },
  { customer: 'Mary Wanjiku', amount: 1800, status: 'Completed', date: '2024-01-10' },
  { customer: 'Peter Otieno', amount: 3200, status: 'Pending', date: '2024-01-20' },
  { customer: 'Grace Njeri', amount: 950, status: 'Completed', date: '2024-01-18' }
];

const mockStaffData = [
  { name: 'Alice Muthoni', transactions: 89, totalSales: 145630, avgSale: 1637 },
  { name: 'David Kiprop', transactions: 76, totalSales: 125890, avgSale: 1656 },
  { name: 'Sarah Achieng', transactions: 92, totalSales: 168420, avgSale: 1831 },
  { name: 'James Mwangi', transactions: 85, totalSales: 142760, avgSale: 1679 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function KioskAdminReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [dateFilter, setDateFilter] = useState('today');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

  const formatCurrency = (amount) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  const handleExport = (format) => {
    console.log(`Exporting as ${format}`);
    // Implementation would depend on your backend/export library
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate totals for debt report
  const totalOutstanding = mockDebtData
    .filter(item => item.status === 'Pending')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const totalRecovered = mockDebtData
    .filter(item => item.status === 'Completed')
    .reduce((sum, item) => sum + item.amount, 0);

  const tabs = [
    { id: 0, label: 'Sales Summary' },
    { id: 1, label: 'Product Sales' },
    { id: 2, label: 'Debt Report' },
    { id: 3, label: 'Staff Performance' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Reports Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive business analytics and reporting
          </p>
        </div>

        {/* Export Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Period</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              {dateFilter === 'custom' && (
                <div className="flex gap-2">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">From</label>
                    <input
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">To</label>
                    <input
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <FileText size={16} />
                Export PDF
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <Download size={16} />
                Export CSV
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <Printer size={16} />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Tab 1: Overall Sales Summary */}
            {activeTab === 0 && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-700">
                          Total Revenue
                        </h3>
                        <p className="text-3xl font-bold text-blue-800">
                          {formatCurrency(mockSalesData.totalRevenue)}
                        </p>
                      </div>
                      <TrendingUp className="text-blue-600" size={40} />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-green-700">
                          Transactions
                        </h3>
                        <p className="text-3xl font-bold text-green-800">
                          {mockSalesData.transactionCount}
                        </p>
                      </div>
                      <ShoppingCart className="text-green-600" size={40} />
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-purple-700">
                          Average Sale
                        </h3>
                        <p className="text-3xl font-bold text-purple-800">
                          {formatCurrency(Math.round(mockSalesData.totalRevenue / mockSalesData.transactionCount))}
                        </p>
                      </div>
                      <Calendar className="text-purple-600" size={40} />
                    </div>
                  </div>
                </div>

                {/* Payment Methods Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Methods Breakdown</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockSalesData.paymentMethods}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="method" />
                          <YAxis />
                          <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                          <Bar dataKey="amount" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
                    <div className="space-y-4">
                      {mockSalesData.paymentMethods.map((method, index) => (
                        <div key={method.method} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{method.method}</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {method.count} txns
                            </span>
                          </div>
                          <p className="text-xl font-semibold text-green-600">
                            {formatCurrency(method.amount)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Product Sales Report */}
            {activeTab === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Sales Table</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product Name
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity Sold
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Revenue
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Avg. Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockProductData.map((product, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              {product.quantitySold}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              {formatCurrency(product.revenue)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              {formatCurrency(Math.round(product.revenue / product.quantitySold))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Best Selling Products</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockProductData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="quantitySold"
                        >
                          {mockProductData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Debt Report */}
            {activeTab === 2 && (
              <div className="space-y-6">
                {/* Debt Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-red-700">
                          Total Outstanding
                        </h3>
                        <p className="text-3xl font-bold text-red-800">
                          {formatCurrency(totalOutstanding)}
                        </p>
                      </div>
                      <AlertCircle className="text-red-600" size={40} />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-green-700">
                          Total Recovered
                        </h3>
                        <p className="text-3xl font-bold text-green-800">
                          {formatCurrency(totalRecovered)}
                        </p>
                      </div>
                      <TrendingUp className="text-green-600" size={40} />
                    </div>
                  </div>
                </div>

                {/* Debt Table */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Debt Details</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer Name
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount Owed
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockDebtData.map((debt, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {debt.customer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              {formatCurrency(debt.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                debt.status === 'Completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {debt.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                              {debt.date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Staff Performance */}
            {activeTab === 3 && (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Staff Performance Summary</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Staff Name
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transactions
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Sales
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Average Sale
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockStaffData.map((staff, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              <Users size={20} className="text-gray-500" />
                              {staff.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {staff.transactions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatCurrency(staff.totalSales)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatCurrency(staff.avgSale)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              staff.avgSale > 1700 
                                ? 'bg-green-100 text-green-800' 
                                : staff.avgSale > 1600 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {staff.avgSale > 1700 ? 'Excellent' : staff.avgSale > 1600 ? 'Good' : 'Average'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}