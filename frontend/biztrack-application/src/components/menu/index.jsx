import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, DollarSign, Package, BarChart2, Settings, X } from 'lucide-react';

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { name: 'Sales', icon: <DollarSign size={20} />, path: '/sales' },
    { name: 'Products', icon: <Package size={20} />, path: '/products' },
    { name: 'Inventory', icon: <Package size={20} />, path: '/inventory' },
    { name: 'Staff', icon: <BarChart2 size={20} />, path: '/staff' },
    { name: 'Reports', icon: <BarChart2 size={20} />, path: '/cashier-orders' },
    { name: 'User Management', icon: <BarChart2 size={20} />, path: '/user-management' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    { name: 'Modal', icon: <Settings size={20} />, path: '/modal' },

  ];

  return (
    <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-700 to-blue-800 text-white z-30 transition-all duration-300 ease-in-out ${
      sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-blue-600">
        <div className="flex items-center space-x-2">
          <div className="bg-white rounded-md p-1">
            <Package size={20} className="text-blue-700" />
          </div>
          <span className="font-bold text-lg">BizManager</span>
        </div>
        <button className="md:hidden text-white" onClick={toggleSidebar}>
          <X size={24} />
        </button>
      </div>

      <nav className="mt-6">
        <ul>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-6 py-3 text-sm hover:bg-blue-600 transition ${
                    isActive ? 'bg-blue-600 font-medium' : ''
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-blue-600 rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Need help?</p>
          <p className="text-xs opacity-80">Contact support to get assistance with your business dashboard.</p>
          <button className="mt-3 w-full bg-white text-blue-700 text-sm font-medium py-2 rounded-md">
            Contact Support
          </button>
        </div>
      </div>
    </aside>
  );
}
