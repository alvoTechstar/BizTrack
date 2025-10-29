// src/components/business/BusinessListControls.jsx
import React from 'react';
import { Search } from 'lucide-react';

const BusinessListControls = ({ searchTerm, setSearchTerm, filters, setFilters, businessTypes }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex gap-4 flex-wrap">
      {/* Search Input */}
      <div className="flex-1 min-w-64 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, email, or registration number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>
      
      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      >
        <option value="">All Status</option>
        <option value="NEW">NEW</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </select>

      {/* Type Filter */}
      <select
        value={filters.type}
        onChange={(e) => setFilters(prev => ({...prev, type: e.target.value}))}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      >
        <option value="">All Types</option>
        {businessTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
};

export default BusinessListControls;