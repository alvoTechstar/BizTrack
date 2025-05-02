import React from 'react';
import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, DollarSign } from 'lucide-react';

export default function SalesPage() {
  const [inventory] = useState([
    { id: 1, name: 'Product A', price: 25.99 },
    { id: 2, name: 'Product B', price: 14.50 },
    { id: 3, name: 'Product C', price: 39.99 },
    { id: 4, name: 'Product D', price: 9.99 },
    { id: 5, name: 'Product E', price: 19.95 },
  ]);
  
  const [cart, setCart] = useState([]);
  const [customProduct, setCustomProduct] = useState({ name: '', price: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const updatePrice = (productId, newPrice) => {
    setCart(cart.map(item => 
      item.id === productId ? { ...item, price: newPrice } : item
    ));
  };
  
  const addCustomProduct = () => {
    if (customProduct.name && customProduct.price) {
      const newProduct = {
        id: Date.now(),
        name: customProduct.name,
        price: parseFloat(customProduct.price),
        quantity: 1
      };
      setCart([...cart, newProduct]);
      setCustomProduct({ name: '', price: '' });
    }
  };
  
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };
  
  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
  };
  
  const confirmSale = () => {
    if (cart.length === 0 || !paymentMethod) return;
    setShowConfirmation(true);
    // In a real app, this would process the sale
  };
  
  const resetSale = () => {
    setCart([]);
    setPaymentMethod('');
    setShowConfirmation(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Business Manager POS</h1>
          <div className="flex items-center space-x-2">
            <ShoppingCart size={24} />
            <span className="font-bold">{cart.length} items</span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 flex flex-col md:flex-row gap-6 flex-grow">
        {/* Product Selection */}
        <div className="md:w-1/2 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Products</h2>
          
          {/* Custom Product Input */}
          <div className="mb-6 bg-gray-50 p-4 rounded-md">
            <h3 className="font-bold mb-2">Add Custom Product</h3>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="Product name"
                className="flex-1 p-2 border rounded"
                value={customProduct.name}
                onChange={(e) => setCustomProduct({...customProduct, name: e.target.value})}
              />
              <input
                type="number"
                placeholder="Price"
                className="w-24 p-2 border rounded"
                value={customProduct.price}
                onChange={(e) => setCustomProduct({...customProduct, price: e.target.value})}
              />
              <button 
                className="bg-green-500 text-white py-2 px-4 rounded font-bold hover:bg-green-600 transition-colors"
                onClick={addCustomProduct}
              >
                Add
              </button>
            </div>
          </div>
          
          {/* Product List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {inventory.map(product => (
              <div key={product.id} className="border p-3 rounded hover:bg-blue-50 transition-colors">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{product.name}</span>
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                </div>
                <button 
                  className="w-full bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600 transition-colors"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cart and Checkout */}
        <div className="md:w-1/2 bg-white p-4 rounded-lg shadow-md flex flex-col">
          <h2 className="text-xl font-bold mb-4">Cart</h2>
          
          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500 flex-grow">
              Cart is empty. Add some products to get started.
            </div>
          ) : (
            <div className="mb-4 overflow-y-auto max-h-64 flex-grow">
              {cart.map(item => (
                <div key={item.id} className="border-b py-3 flex flex-col md:flex-row">
                  <div className="flex-grow">
                    <div className="font-bold">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <div className="flex items-center border rounded">
                      <button 
                        className="px-2 py-1 text-blue-500"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        className="w-12 text-center border-x"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      />
                      <button 
                        className="px-2 py-1 text-blue-500"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <input
                      type="number"
                      className="w-20 p-1 border rounded"
                      value={item.price}
                      onChange={(e) => updatePrice(item.id, parseFloat(e.target.value) || 0)}
                    />
                    
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Summary and Payment */}
          <div className="border-t pt-4 mt-auto">
            <div className="flex justify-between text-xl font-bold mb-4">
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </div>
            
            <div className="mb-4">
              <h3 className="font-bold mb-2">Payment Method</h3>
              <div className="flex gap-2">
                <button 
                  className={`flex-1 py-3 border rounded-lg flex items-center justify-center gap-2 ${paymentMethod === 'Cash' ? 'bg-green-100 border-green-500' : 'hover:bg-gray-50'}`}
                  onClick={() => handlePaymentSelection('Cash')}
                >
                  <DollarSign size={20} />
                  <span className="font-medium">Cash</span>
                </button>
                <button 
                  className={`flex-1 py-3 border rounded-lg flex items-center justify-center gap-2 ${paymentMethod === 'M-PESA' ? 'bg-green-100 border-green-500' : 'hover:bg-gray-50'}`}
                  onClick={() => handlePaymentSelection('M-PESA')}
                >
                  <CreditCard size={20} />
                  <span className="font-medium">M-PESA</span>
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors"
                onClick={resetSale}
              >
                Clear Cart
              </button>
              <button 
                className={`flex-1 py-3 rounded-lg font-bold transition-colors ${cart.length > 0 && paymentMethod ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                onClick={confirmSale}
                disabled={cart.length === 0 || !paymentMethod}
              >
                Confirm Sale
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Sale Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-green-600">Sale Completed!</h2>
            <p className="mb-4">Total amount: <span className="font-bold">${calculateTotal()}</span></p>
            <p className="mb-4">Payment method: <span className="font-bold">{paymentMethod}</span></p>
            <button 
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
              onClick={resetSale}
            >
              New Sale
            </button>
          </div>
        </div>
      )}
    </div>
  );
}