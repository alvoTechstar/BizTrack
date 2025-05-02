import React from 'react';
import { Bell, Menu, User } from 'lucide-react';

export default function Topbar({ toggleSidebar }) {
  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <button className="mr-4 text-gray-600 md:hidden" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-1 text-gray-600 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="bg-gray-200 rounded-full p-1">
            <User size={20} className="text-gray-600" />
          </div>
          <span className="hidden md:inline text-sm font-medium text-gray-700">John Smith</span>
        </div>
      </div>
    </header>
  );
}