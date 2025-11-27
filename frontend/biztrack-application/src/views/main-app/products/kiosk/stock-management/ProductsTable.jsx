import React from 'react';
import { Package } from 'lucide-react';
import { useTheme } from '../../../../../components/theme/ThemeContext';
import DataTable from '../../../../../components/datatable';

const PRODUCTS_TABLE_HEADERS = [
  { title: '', key: 'all' },
  { title: 'Product Name', key: 'name' },
  { title: 'SKU', key: 'sku' },
  { title: 'Category', key: 'category' },
  { title: 'Stock Level', key: 'stock' },
  { title: 'Buy Price (KES)', key: 'buyingPrice' },
  { title: 'Sell Price (KES)', key: 'price' },
  { title: 'Potential Profit (KES)', key: 'potentialProfit' },
  { title: 'Status', key: 'status' },
  { title: 'Action', key: 'action' },
];

const ProductsTable = ({
  products = [], // Changed from filteredProducts to products to match parent prop
  selectedItems = [],
  setSelectedItems,
  toggleSelectAll,
  toggleSelectItem,
  onEditProduct,
  onRestockProduct,
  onDeleteProduct,
}) => {
  const theme = useTheme();

  // Safe check for products
  const safeProducts = Array.isArray(products) ? products : [];
  const safeSelectedItems = Array.isArray(selectedItems) ? selectedItems : [];

  // No Results State
  if (safeProducts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200 mt-4">
        <Package size={48} className="text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  const getActionsForStatus = (status) => {
    // Product-specific actions - all products get these actions
    return ['View', 'Restock', 'Edit', 'Delete'];
  };

  const handleActionSelected = (action, id) => {
    const product = safeProducts.find(p => p.id === id);
    if (!product) {
      console.error('Product not found with id:', id);
      return;
    }

    console.log('Action selected:', action, 'for product:', product.name);

    switch (action.toLowerCase()) {
      case 'view':
        console.log('Opening product view for:', product.name);
        // You can add a view modal here if needed
        break;
      case 'edit':
        console.log('Opening edit modal for product:', product.name);
        onEditProduct?.(product);
        break;
      case 'restock':
        console.log('Opening restock modal for product:', product.name);
        onRestockProduct?.(product);
        break;
      case 'delete':
        console.log('Opening delete modal for product:', product.name);
        onDeleteProduct?.(product);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  };

  const handleRowClick = (column) => {
    console.log('Row clicked:', column);
    // You can implement view details on row click if needed
  };

  // Transform products data for display
  const transformedProducts = safeProducts.map(product => {
    const profitPerUnit = product.price - product.buyingPrice;
    const totalPotentialProfit = profitPerUnit * product.stock;
    
    return {
      ...product,
      buyingPrice: `KES ${product.buyingPrice ? parseFloat(product.buyingPrice).toFixed(2) : '0.00'}`,
      price: `KES ${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}`,
      potentialProfit: `KES ${totalPotentialProfit.toFixed(2)}`,
      stock: `${product.stock} ${product.unit}`,
      status: product.status, // This will work with the updated TablePill
    };
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <DataTable
        data={transformedProducts}
        headers={PRODUCTS_TABLE_HEADERS}
        type="products"
        selected={safeSelectedItems}
        selectedAction={setSelectedItems}
        selectAll={toggleSelectAll}
        all={safeSelectedItems.length === safeProducts.length && safeProducts.length > 0}
        actionSelected={handleActionSelected}
        selectedRow={handleRowClick}
        actions={getActionsForStatus}
        clickable={true}
        color={theme.primaryColor}
      />
    </div>
  );
};

export default ProductsTable;