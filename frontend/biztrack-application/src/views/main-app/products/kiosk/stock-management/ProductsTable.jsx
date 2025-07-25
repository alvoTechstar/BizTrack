// ProductsTable.jsx
import React from 'react';
import DataTable from '../../../../../components/datatable';
import { Edit, Trash, PlusCircle } from 'lucide-react';

export default function ProductsTable({ 
  products, 
  onEditProduct, 
  onRestockProduct, 
  onDeleteProduct 
}) {
  const columns = [
    { 
      field: 'name', 
      label: 'Product Name', 
      minWidth: 180,
    },
    { field: 'sku', label: 'SKU', minWidth: 100 },
    { field: 'category', label: 'Category', minWidth: 120 },
    { 
      field: 'stock', 
      label: 'Stock Level', 
      minWidth: 150,
      render: (row) => (
        <div className="flex items-center">
          <span className="text-sm text-gray-900 mr-2">{row.stock} {row.unit}</span>
          <div className="w-20 bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                row.status === 'Out of Stock' ? 'bg-red-500' : 
                row.status === 'Low Stock' ? 'bg-amber-500' : 'bg-teal-500'
              }`}
              style={{ width: `${Math.min(100, (row.stock / row.threshold) * 100)}%` }}
            ></div>
          </div>
        </div>
      )
    },
    { 
      field: 'buyingPrice', 
      label: 'Buy Price (KES)', 
      minWidth: 80,
      render: (row) => `KES ${row.buyingPrice ? row.buyingPrice.toFixed(2) : '0.00'}` 
    },
    { 
      field: 'price', 
      label: 'Sell Price (KES)', 
      minWidth: 80,
      render: (row) => `KES ${row.price.toFixed(2)}` 
    },
    { 
      field: 'potentialProfit', 
      label: 'Potential Profit (KES)', 
      minWidth: 120,
      render: (row) => {
        const profitPerUnit = row.price - row.buyingPrice;
        const totalPotentialProfit = profitPerUnit * row.stock;
        return (
            <span className={totalPotentialProfit >= 0 ? 'text-green-700' : 'text-red-700'}>
                KES {totalPotentialProfit.toFixed(2)}
            </span>
        );
      }
    },
    { field: 'status', label: 'Status', minWidth: 120 },
    { 
      field: 'actions', 
      label: 'Actions', 
      isActionColumn: true, 
      minWidth: 120,
      render: (row) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => onRestockProduct(row)}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
            title="Restock"
          >
            <PlusCircle size={16} />
          </button>
          <button 
            onClick={() => onEditProduct(row)}
            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDeleteProduct(row)}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
            title="Delete"
          >
            <Trash size={16} />
          </button>
        </div>
      )
    },
  ];

  const customStatusStyles = {
    'In Stock': { bgColor: 'bg-green-100', textColor: 'text-green-800' },
    'Low Stock': { bgColor: 'bg-amber-100', textColor: 'text-amber-800' },
    'Out of Stock': { bgColor: 'bg-red-100', textColor: 'text-red-800' },
  };

  return (
    <DataTable
      columns={columns}
      data={products} 
      statusField="status"
      customStatusStyles={customStatusStyles}
      pagination={true} 
      showToolbar={false} 
    />
  );
}