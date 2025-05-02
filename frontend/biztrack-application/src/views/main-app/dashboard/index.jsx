import React from 'react';
import { useState } from 'react';
import Sidebar from '../../../components/menu';
import Topbar from '../../../components/header';
import DataTable from '../../../components/datatable';
import {
  DollarSign,
  TrendingUp,
  Smartphone,
  Package
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import StatsCard from './StatsCard';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const paymentData = [
    { name: 'M-PESA', value: 68 },
    { name: 'Cash', value: 32 },
  ];

  const productData = [
    { name: 'Product A', sales: 45 },
    { name: 'Product B', sales: 32 },
    { name: 'Product C', sales: 18 },
    { name: 'Product D', sales: 10 },
  ];

  const COLORS = ['#3b82f6', '#10b981'];

  const transactions = [
    { product: 'Product A', time: '11:23 AM', amount: 'KSh 2,400', payment: 'M-PESA', status: 'Failed' },
    { product: 'Product C', time: '10:45 AM', amount: 'KSh 5,800', payment: 'Cash', status: 'Completed' },
    { product: 'Product B', time: '09:12 AM', amount: 'KSh 1,250', payment: 'M-PESA', status: 'Completed' },
    { product: 'Product D', time: '08:30 AM', amount: 'KSh 3,600', payment: 'M-PESA', status: 'Pending' },
    { product: 'Product A', time: '11:23 AM', amount: 'KSh 2,400', payment: 'M-PESA', status: 'Completed' },
    { product: 'Product C', time: '10:45 AM', amount: 'KSh 5,800', payment: 'Cash', status: 'pending' },
    { product: 'Product B', time: '09:12 AM', amount: 'KSh 1,250', payment: 'M-PESA', status: 'Failed' },
    { product: 'Product D', time: '08:30 AM', amount: 'KSh 3,600', payment: 'M-PESA', status: 'Pending' },
    { product: 'Product A', time: '11:23 AM', amount: 'KSh 2,400', payment: 'M-PESA', status: 'Completed' },
    { product: 'Product C', time: '10:45 AM', amount: 'KSh 5,800', payment: 'Cash', status: 'Failed' },
    { product: 'Product B', time: '09:12 AM', amount: 'KSh 1,250', payment: 'M-PESA', status: 'Completed' },
    { product: 'Product D', time: '08:30 AM', amount: 'KSh 3,600', payment: 'M-PESA', status: 'Pending' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'ml-0 md:ml-64'}`}>
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700">Sales Overview</h2>
            <p className="text-sm text-gray-500">Welcome back! Here's your business at a glance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Sales Today */}
            <StatsCard title="Total Sales Today" value="KSh 34,500" change="+8.2%" icon={<DollarSign />} color="blue" />
            {/* Profit Today */}
            <StatsCard title="Profit Today" value="KSh 12,350" change="+5.7%" icon={<TrendingUp />} color="green" />
            {/* Payment Methods */}
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
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Top Selling Product */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-5 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-700 font-medium">Top Selling Products</h3>
                  <Package size={20} className="text-amber-600" />
                </div>
              </div>
              <div className="px-2 py-2 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#3b82f6" barSize={12} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <DataTable transactions={transactions} />
        </main>
      </div>
    </div>
  );
}
