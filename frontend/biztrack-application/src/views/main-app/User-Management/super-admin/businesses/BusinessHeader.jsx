// src/components/business/BusinessHeader.jsx
import React from 'react';
import { Plus } from 'lucide-react';

const BusinessHeader = ({ filteredCount, openModal }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800">Businesses</h1>
      {filteredCount > 0 && (
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus size={20} />
          Add Business
        </button>
      )}
    </div>
  );
};

export default BusinessHeader;