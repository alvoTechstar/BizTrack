// src/components/business/BusinessTable.jsx
import React from 'react';
import { Edit, Power, Trash2, Building2 } from 'lucide-react';

const BusinessBulkActions = ({ selectedItems }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
    <span className="text-blue-700 font-medium">
      {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
    </span>
    <div className="flex gap-2">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
        Bulk Activate
      </button>
      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium">
        Bulk Deactivate
      </button>
      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
        Bulk Delete
      </button>
    </div>
  </div>
);

const BusinessTable = ({
  filteredBusinesses,
  selectedItems,
  toggleSelectAll,
  toggleSelectItem,
  openModalForEdit,
  handleToggleStatus,
  handleDelete,
  getStatusColor,
}) => {
  if (filteredBusinesses.length === 0 && selectedItems.length > 0) {
    // This state shouldn't happen if filteredBusinesses updates correctly, but good for safety
    return null; 
  }

  // No Results State (for search/filter)
  if (filteredBusinesses.length === 0) {
    return (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 mt-4">
            <Building2 size={48} className="text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No businesses found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
    );
  }

  return (
    <>
      {selectedItems.length > 0 && <BusinessBulkActions selectedItems={selectedItems} />}
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedItems.length === filteredBusinesses.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Business Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBusinesses.map((business) => (
                <tr key={business.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedItems.includes(business.id)}
                      onChange={() => toggleSelectItem(business.id)}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{business.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: business.primaryColor }}
                      >
                        {business.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{business.name}</div>
                        <div className="text-sm text-gray-500">{business.type} • {business.registrationNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{business.address}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{business.phoneNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{business.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(business.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {business.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openModalForEdit(business)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" 
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(business.id)}
                        className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition" 
                        title={business.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                      >
                        <Power size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(business.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition" 
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BusinessTable;