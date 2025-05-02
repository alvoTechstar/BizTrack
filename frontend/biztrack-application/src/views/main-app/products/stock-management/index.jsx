import React from 'react';
import { useState } from 'react';
import { AlertCircle, Edit, Trash, PlusCircle, Search, ArrowDown, ArrowUp, Package, BarChart2, Filter } from 'lucide-react';

export default function StockManagementPage() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Premium Coffee Beans', sku: 'PCB001', category: 'Beverages', stock: 45, unit: 'kg', price: 24.99, threshold: 10, status: 'In Stock' },
    { id: 2, name: 'Organic Green Tea', sku: 'OGT002', category: 'Beverages', stock: 8, unit: 'boxes', price: 12.50, threshold: 15, status: 'Low Stock' },
    { id: 3, name: 'Whole Wheat Flour', sku: 'WWF003', category: 'Baking', stock: 25, unit: 'kg', price: 3.99, threshold: 20, status: 'Low Stock' },
    { id: 4, name: 'Stainless Steel Mug', sku: 'SSM004', category: 'Kitchenware', stock: 32, unit: 'pieces', price: 18.75, threshold: 10, status: 'In Stock' },
    { id: 5, name: 'Cotton Dish Towels', sku: 'CDT005', category: 'Home', stock: 54, unit: 'pieces', price: 7.99, threshold: 20, status: 'In Stock' },
    { id: 6, name: 'Eco-friendly Detergent', sku: 'EFD006', category: 'Cleaning', stock: 0, unit: 'bottles', price: 9.99, threshold: 5, status: 'Out of Stock' },
    { id: 7, name: 'Artisanal Chocolate', sku: 'ACH007', category: 'Confectionery', stock: 18, unit: 'bars', price: 5.50, threshold: 15, status: 'In Stock' },
    { id: 8, name: 'Scented Candles', sku: 'SCA008', category: 'Home', stock: 7, unit: 'pieces', price: 14.25, threshold: 10, status: 'Low Stock' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const categories = [...new Set(products.map(product => product.category))];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => filterStatus === 'All' ? true : product.status === filterStatus)
    .filter(product => filterCategory === 'All' ? true : product.category === filterCategory)
    .sort((a, b) => {
      if (sortField === 'stock' || sortField === 'price') {
        return sortDirection === 'asc' 
          ? a[sortField] - b[sortField] 
          : b[sortField] - a[sortField];
      } else {
        return sortDirection === 'asc'
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
    });

  const lowStockCount = products.filter(p => p.status === 'Low Stock').length;
  const outOfStockCount = products.filter(p => p.status === 'Out of Stock').length;

  const handleEdit = (product) => {
    setCurrentProduct({...product});
    setShowEditModal(true);
  };

  const handleRestock = (product) => {
    setCurrentProduct({...product});
    setShowRestockModal(true);
  };

  const saveEdit = () => {
    setProducts(products.map(p => 
      p.id === currentProduct.id ? {...currentProduct} : p
    ));
    setShowEditModal(false);
  };

  const saveRestock = () => {
    const updatedProduct = {
      ...currentProduct,
      status: currentProduct.stock >= currentProduct.threshold ? 'In Stock' : 
              currentProduct.stock > 0 ? 'Low Stock' : 'Out of Stock'
    };
    
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
    setShowRestockModal(false);
  };

  const deleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Stock Management</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Stock Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="bg-teal-100 p-3 rounded-full mr-4">
              <Package size={24} className="text-teal-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <AlertCircle size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold">{lowStockCount}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Out of Stock Items</p>
              <p className="text-2xl font-bold">{outOfStockCount}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 lg:w-96 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center">
                <Filter size={18} className="text-gray-500 mr-2" />
                <select
                  className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <select
                  className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <PlusCircle size={18} />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Product Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center">
                      Stock Level
                      {sortField === 'stock' && (
                        sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Price
                      {sortField === 'price' && (
                        sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">{product.stock} {product.unit}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              product.status === 'Out of Stock' ? 'bg-red-500' : 
                              product.status === 'Low Stock' ? 'bg-amber-500' : 'bg-teal-500'
                            }`}
                            style={{ width: `${Math.min(100, (product.stock / product.threshold) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                        product.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="text-teal-600 hover:text-teal-900"
                          onClick={() => handleRestock(product)}
                        >
                          <PlusCircle size={18} />
                        </button>
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Product Modal */}
      {showEditModal && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg p-2" 
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                  <input 
                    type="number" 
                    className="w-full border rounded-lg p-2" 
                    value={currentProduct.stock}
                    onChange={(e) => setCurrentProduct({
                      ...currentProduct, 
                      stock: parseInt(e.target.value) || 0,
                      status: parseInt(e.target.value) >= currentProduct.threshold ? 'In Stock' : 
                              parseInt(e.target.value) > 0 ? 'Low Stock' : 'Out of Stock'
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
                  <input 
                    type="text" 
                    className="w-full border rounded-lg p-2" 
                    value={currentProduct.unit}
                    onChange={(e) => setCurrentProduct({...currentProduct, unit: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full border rounded-lg p-2" 
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                  <input 
                    type="number" 
                    className="w-full border rounded-lg p-2" 
                    value={currentProduct.threshold}
                    onChange={(e) => setCurrentProduct({...currentProduct, threshold: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full border rounded-lg p-2"
                  value={currentProduct.category}
                  onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                onClick={saveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Restock Product</h2>
            <p className="mb-4">{currentProduct.name} - Current stock: {currentProduct.stock} {currentProduct.unit}</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add Stock Quantity</label>
              <input 
                type="number" 
                className="w-full border rounded-lg p-2" 
                placeholder="Enter quantity to add"
                onChange={(e) => {
                  const addQty = parseInt(e.target.value) || 0;
                  const newStock = currentProduct.stock + addQty;
                  setCurrentProduct({
                    ...currentProduct,
                    stock: newStock,
                    status: newStock >= currentProduct.threshold ? 'In Stock' : 
                            newStock > 0 ? 'Low Stock' : 'Out of Stock'
                  });
                }}
              />
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setShowRestockModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                onClick={saveRestock}
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}