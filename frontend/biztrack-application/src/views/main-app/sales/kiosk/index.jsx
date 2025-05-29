import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  DollarSign,
  Smartphone,
  FileText,
  X,
  CheckCircle,
  Loader,
} from "lucide-react";
import SearchInput from "../../../../components/input/SearchInput";
// Mock data
const mockProducts = [
  { id: 1, name: "Coca Cola 500ml", price: 80 },
  { id: 2, name: "Bread (Loaf)", price: 55 },
  { id: 3, name: "Milk 1L", price: 120 },
  { id: 4, name: "Rice 2kg", price: 180 },
  { id: 5, name: "Sugar 1kg", price: 150 },
  { id: 6, name: "Tea Leaves 250g", price: 95 },
  { id: 7, name: "Cooking Oil 1L", price: 280 },
  { id: 8, name: "Eggs (12 pieces)", price: 320 },
  { id: 9, name: "Bananas 1kg", price: 70 },
  { id: 10, name: "Tomatoes 1kg", price: 60 },
  { id: 11, name: "Onions 1kg", price: 85 },
  { id: 12, name: "Maize Flour 2kg", price: 140 },
];

const SalesPage = () => {
  // State management
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState({});
  const [mockTransactions, setMockTransactions] = useState([]);
  const [mockDebts, setMockDebts] = useState([]);

  // Modal states
  const [cashModal, setCashModal] = useState(false);
  const [mpesaModal, setMpesaModal] = useState(false);
  const [debtModal, setDebtModal] = useState(false);

  // Payment form states
  const [amountPaid, setAmountPaid] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [debtCustomerName, setDebtCustomerName] = useState("");
  const [debtPhone, setDebtPhone] = useState("");
  const [debtNotes, setDebtNotes] = useState("");

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  // Format currency
  const formatCurrency = (amount) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "success" }),
      3000
    );
  };

  // Handle quantity change for products
  const handleQuantityChange = (productId, value) => {
    const quantity = Math.max(0, parseInt(value) || 0);
    setQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  // Add product to cart
  const addToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    if (quantity <= 0) {
      showNotification("Please enter a valid quantity", "error");
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart((prev) => [...prev, { ...product, quantity }]);
    }

    // Reset quantity input
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
    showNotification(`${product.name} added to cart`, "success");
  };

  // Update cart item quantity
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showNotification("Item removed from cart", "info");
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setQuantities({});
  };

  // Generate transaction ID
  const generateTransactionId = () => {
    return "TXN" + Date.now().toString().slice(-6);
  };

  // Handle cash payment
  const handleCashPayment = () => {
    const paid = parseFloat(amountPaid);
    if (!paid || paid < totalAmount) {
      showNotification("Invalid amount or insufficient payment", "error");
      return;
    }

    const transaction = {
      id: generateTransactionId(),
      items: [...cart],
      total: totalAmount,
      paymentMethod: "Cash",
      status: "Completed",
      amountPaid: paid,
      change: paid - totalAmount,
      timestamp: new Date().toISOString(),
    };

    setMockTransactions((prev) => [...prev, transaction]);
    clearCart();
    setCashModal(false);
    setAmountPaid("");
    showNotification(
      `Payment successful! Change: ${formatCurrency(paid - totalAmount)}`,
      "success"
    );
  };

  // Handle M-PESA payment
  const handleMpesaPayment = async () => {
    if (!mpesaPhone || mpesaPhone.length < 10) {
      showNotification("Please enter a valid phone number", "error");
      return;
    }

    setMpesaLoading(true);

    // Simulate M-PESA STK Push
    setTimeout(() => {
      const transaction = {
        id: generateTransactionId(),
        items: [...cart],
        total: totalAmount,
        paymentMethod: "M-PESA",
        status: "Completed",
        phone: mpesaPhone,
        timestamp: new Date().toISOString(),
      };

      setMockTransactions((prev) => [...prev, transaction]);
      clearCart();
      setMpesaModal(false);
      setMpesaPhone("");
      setMpesaLoading(false);
      showNotification("M-PESA payment successful!", "success");
    }, 3000);
  };

  // Handle debt payment
  const handleDebtPayment = () => {
    if (!debtCustomerName.trim()) {
      showNotification("Customer name is required", "error");
      return;
    }

    const transaction = {
      id: generateTransactionId(),
      items: [...cart],
      total: totalAmount,
      paymentMethod: "Debt",
      status: "Pending",
      timestamp: new Date().toISOString(),
    };

    const debt = {
      id: transaction.id,
      customerName: debtCustomerName,
      customerPhone: debtPhone,
      amount: totalAmount,
      status: "Pending",
      createdDate: new Date().toISOString().split("T")[0],
      expectedPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 7 days from now
      notes: debtNotes,
      datePaid: null,
    };

    setMockTransactions((prev) => [...prev, transaction]);
    setMockDebts((prev) => [...prev, debt]);
    clearCart();
    setDebtModal(false);
    setDebtCustomerName("");
    setDebtPhone("");
    setDebtNotes("");
    showNotification("Debt transaction recorded successfully!", "success");
  };

  // Modal component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Kiosk Sales System
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Selection Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="relative">
                {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" /> */}
                <SearchInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-2"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm font-bold text-green-600 mb-3">
                    {formatCurrency(product.price)}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      className="w-15 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={quantities[product.id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(product.id, e.target.value)
                      }
                    />
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-blue-500 text-white w-20 px-2 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 "
                    >
                      <Plus className="h-3 w-3" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Area */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-800">
                  Shopping Cart
                </h2>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Your cart is empty
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-800 flex-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity - 1)
                              }
                              className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-semibold px-2">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity + 1)
                              }
                              className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {formatCurrency(item.price)} each
                            </p>
                            <p className="font-semibold text-green-600">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-right mb-4">
                      <p className="text-2xl font-bold text-green-600">
                        Total: {formatCurrency(totalAmount)}
                      </p>
                    </div>

                    {/* Payment Options */}
                    <div className="space-y-2">
                      <button
                        onClick={() => setCashModal(true)}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <DollarSign className="h-5 w-5" />
                        Pay with Cash
                      </button>
                      <button
                        onClick={() => setMpesaModal(true)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Smartphone className="h-5 w-5" />
                        Pay with M-PESA
                      </button>
                      <button
                        onClick={() => setDebtModal(true)}
                        className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FileText className="h-5 w-5" />
                        Buy on Debt
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cash Payment Modal */}
        <Modal
          isOpen={cashModal}
          onClose={() => setCashModal(false)}
          title="Cash Payment"
        >
          <div className="space-y-4">
            <p className="text-lg font-semibold">
              Total Amount: {formatCurrency(totalAmount)}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Paid
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="Enter amount paid"
              />
            </div>
            {amountPaid && parseFloat(amountPaid) >= totalAmount && (
              <p className="text-lg font-semibold text-green-600">
                Change: {formatCurrency(parseFloat(amountPaid) - totalAmount)}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setCashModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCashPayment}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Complete Payment
              </button>
            </div>
          </div>
        </Modal>

        {/* M-PESA Payment Modal */}
        <Modal
          isOpen={mpesaModal}
          onClose={() => setMpesaModal(false)}
          title="M-PESA Payment"
        >
          <div className="space-y-4">
            <p className="text-lg font-semibold">
              Total Amount: {formatCurrency(totalAmount)}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                placeholder="0712345678"
              />
            </div>
            {mpesaLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader className="h-5 w-5 animate-spin" />
                <span>Sending STK Push...</span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setMpesaModal(false)}
                disabled={mpesaLoading}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMpesaPayment}
                disabled={mpesaLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Send STK Push
              </button>
            </div>
          </div>
        </Modal>

        {/* Debt Payment Modal */}
        <Modal
          isOpen={debtModal}
          onClose={() => setDebtModal(false)}
          title="Buy on Debt"
        >
          <div className="space-y-4">
            <p className="text-lg font-semibold">
              Total Amount: {formatCurrency(totalAmount)}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={debtCustomerName}
                onChange={(e) => setDebtCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={debtPhone}
                onChange={(e) => setDebtPhone(e.target.value)}
                placeholder="0712345678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={debtNotes}
                onChange={(e) => setDebtNotes(e.target.value)}
                placeholder="Additional notes..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDebtModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDebtPayment}
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Record Debt
              </button>
            </div>
          </div>
        </Modal>

        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>{notification.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPage;
