import React from "react";
import { Plus } from "lucide-react";

const ProductCard = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  formatCurrency,
}) => {
  const isOutOfStock = product.availableStock <= 0;
  const isLowStock = product.availableStock > 0 && product.availableStock <= 5; // Define "low stock" threshold

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-2">
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="text-xl font-semibold text-gray-800 flex-grow">
          {product.name}
        </h3>
        {/* Updated Stock Display */}
        <p
          className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
            ${
              isOutOfStock
                ? "bg-red-100 text-red-700"
                : isLowStock
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }
          `}
        >
          {isOutOfStock
            ? "Out of Stock"
            : isLowStock
            ? `Low Stock (${product.availableStock})`
            : `In Stock (${product.availableStock})`}
        </p>
      </div>

      <p className="text-sm font-bold text-green-600 mb-3">
        {formatCurrency(product.price)}
      </p>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="number"
          min="1"
          placeholder="Qty"
          className="w-15 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          value={quantity || 1}
          onChange={(e) => onQuantityChange(product.id, e.target.value)}
          disabled={isOutOfStock}
        />
        <button
          onClick={() => onAddToCart(product)}
          className="flex-1 bg-blue-500 text-white w-20 px-2 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isOutOfStock}
        >
          <Plus className="h-3 w-3" />
          Sell
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
