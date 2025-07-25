import React, { useState, useMemo, useCallback } from "react";
import { ShoppingCart, DollarSign, Smartphone, FileText } from "lucide-react";
import SearchInput from "../../../../components/input/SearchInput";

// Import the new components
import ProductCard from "./ProductsCard";
import CartItem from "./CartItem";
import CashPaymentModal from "./CashPaymentModal";
import MpesaPaymentModal from "./MpesaPaymentModal";
import DebtPaymentModal from "./DebtPaymentModal";
import Toaster from "../../../../components/Toaster";

// Mock data (could be moved to a separate file, e.g., src/data/products.js)
const mockProducts = [
  { id: 1, name: "Coca Cola 500ml", price: 80, availableStock: 10 },
  { id: 2, name: "Bread (Loaf)", price: 55, availableStock: 5 },
  { id: 3, name: "Milk 1L", price: 120, availableStock: 8 },
  { id: 4, name: "Rice 2kg", price: 180, availableStock: 12 },
  { id: 5, name: "Sugar 1kg", price: 150, availableStock: 7 },
  { id: 6, name: "Tea Leaves 250g", price: 95, availableStock: 15 },
  { id: 7, name: "Cooking Oil 1L", price: 280, availableStock: 6 },
  { id: 8, name: "Eggs (12 pieces)", price: 320, availableStock: 20 },
  { id: 9, name: "Bananas 1kg", price: 70, availableStock: 9 },
  { id: 10, name: "Tomatoes 1kg", price: 60, availableStock: 11 },
  { id: 11, name: "Onions 1kg", price: 85, availableStock: 14 },
  { id: 12, name: "Maize Flour 2kg", price: 140, availableStock: 4 },
];

const SalesPage = () => {
  // State management
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [debts, setDebts] = useState([]);
  const [productsInStock, setProductsInStock] = useState(mockProducts);

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

  // Notification state (now configured for Toaster props)
  const [notification, setNotification] = useState({
    open: false,
    title: "",
    message: "",
    type: "success", // Maps to 'state' in Toaster ('success', 'error', 'info')
  });

  // Utility functions
  const formatCurrency = useCallback((amount) => {
    return `KSh ${amount.toLocaleString()}`;
  }, []);

  const showNotification = useCallback((message, type = "success") => {
    let title = "";
    let stateValue = "";

    switch (type) {
      case "success":
        title = "Success!";
        stateValue = "true";
        break;
      case "error":
        title = "Error!";
        stateValue = "false";
        break;
      case "info":
        title = "Heads Up!"; // 'info' maps to the default/warning style
        stateValue = ""; // Empty string triggers the warning style in Toaster
        break;
      default:
        title = "Notification";
        stateValue = "";
    }

    setNotification({ open: true, title, message, type: stateValue }); // Map 'type' to 'state'
    setTimeout(
      () => setNotification((prev) => ({ ...prev, open: false })), // Just close it
      3000
    );
  }, []);

  const generateTransactionId = useCallback(() => {
    return "TXN" + Date.now().toString().slice(-6);
  }, []);

  // Filter products based on search term and current stock
  const filteredProducts = useMemo(() => {
    return productsInStock.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, productsInStock]);

  // Calculate total amount in cart
  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  // --- Handlers for cart and product interactions ---

  const handleQuantityChange = useCallback(
    (productId, value) => {
      const quantity = Math.max(0, parseInt(value) || 0); // Ensure quantity is non-negative integer
      const productInStock = productsInStock.find((p) => p.id === productId);

      if (productInStock && quantity > productInStock.availableStock) {
        showNotification(
          `Only ${productInStock.availableStock} of ${productInStock.name} available.`,
          "error"
        );
        // Cap the quantity at the available stock
        setQuantities((prev) => ({
          ...prev,
          [productId]: productInStock.availableStock,
        }));
        return;
      }

      setQuantities((prev) => ({
        ...prev,
        [productId]: quantity,
      }));
    },
    [productsInStock, showNotification]
  );

  const addToCart = useCallback(
    (product) => {
      const quantityToAdd = quantities[product.id] || 1;
      const currentCartItem = cart.find((item) => item.id === product.id);
      const currentQuantityInCart = currentCartItem
        ? currentCartItem.quantity
        : 0;

      const productInActualStock = productsInStock.find(
        (p) => p.id === product.id
      );

      if (!productInActualStock || productInActualStock.availableStock <= 0) {
        showNotification(`${product.name} is out of stock!`, "error");
        return;
      }

      if (quantityToAdd <= 0) {
        showNotification("Please enter a valid quantity", "error");
        return;
      }

      // Check if adding this quantity (plus what's already in cart) exceeds total available stock
      if (
        currentQuantityInCart + quantityToAdd >
        productInActualStock.availableStock
      ) {
        showNotification(
          `Cannot add ${quantityToAdd} of ${product.name}. Only ${
            productInActualStock.availableStock - currentQuantityInCart
          } more available.`,
          "error"
        );
        // Optionally, reset input quantity to max additional available
        setQuantities((prev) => ({
          ...prev,
          [product.id]:
            productInActualStock.availableStock - currentQuantityInCart,
        }));
        return;
      }

      setCart((prev) => {
        if (currentCartItem) {
          // If item exists in cart, update its quantity
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantityToAdd }
              : item
          );
        } else {
          // If new item, add to cart
          return [...prev, { ...product, quantity: quantityToAdd }];
        }
      });

      // Crucially, decrement the available stock for the product in `productsInStock`
      setProductsInStock((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id
            ? { ...p, availableStock: p.availableStock - quantityToAdd }
            : p
        )
      );

      // Reset the quantity input for the product after adding to cart
      setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
      showNotification(`${product.name} added to cart`, "success");
    },
    [cart, quantities, productsInStock, showNotification]
  );

  const updateCartQuantity = useCallback(
    (productId, newQuantity) => {
      const currentCartItem = cart.find((item) => item.id === productId);
      if (!currentCartItem) return;

      const oldQuantity = currentCartItem.quantity;
      const productInActualStock = productsInStock.find(
        (p) => p.id === productId
      );

      if (!productInActualStock) {
        showNotification("Product stock information not found.", "error");
        return;
      }

      // If newQuantity is 0 or less, remove item from cart
      if (newQuantity <= 0) {
        setCart((prev) => prev.filter((item) => item.id !== productId));
        // Return the old quantity to stock
        setProductsInStock((prevProducts) =>
          prevProducts.map((p) =>
            p.id === productId
              ? { ...p, availableStock: p.availableStock + oldQuantity }
              : p
          )
        );
        showNotification("Item removed from cart", "info");
        return;
      }

      // Calculate how much stock needs to be adjusted
      // Positive if increasing, negative if decreasing
      const quantityDifference = newQuantity - oldQuantity;

      // Check if increasing quantity exceeds available stock (stock not yet in cart)
      if (
        quantityDifference > 0 &&
        quantityDifference > productInActualStock.availableStock
      ) {
        showNotification(
          `Cannot add more ${productInActualStock.name}. Only ${productInActualStock.availableStock} more available.`,
          "error"
        );
        // Set the quantity to the maximum allowed (current cart quantity + remaining stock)
        setCart((prev) =>
          prev.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity: oldQuantity + productInActualStock.availableStock,
                }
              : item
          )
        );
        // Deduct all remaining available stock as it's now in the cart
        setProductsInStock((prevProducts) =>
          prevProducts.map((p) =>
            p.id === productId ? { ...p, availableStock: 0 } : p
          )
        );
        return;
      }

      // Update cart item quantity
      setCart((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );

      // Adjust the actual stock based on the quantity change
      setProductsInStock((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId
            ? { ...p, availableStock: p.availableStock - quantityDifference }
            : p
        )
      );
    },
    [cart, productsInStock, showNotification]
  );

  const removeFromCart = useCallback(
    (productId) => {
      const itemToRemove = cart.find((item) => item.id === productId);
      if (itemToRemove) {
        setCart((prev) => prev.filter((item) => item.id !== productId));
        // Return the quantity of the removed item to stock
        setProductsInStock((prevProducts) =>
          prevProducts.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  availableStock: p.availableStock + itemToRemove.quantity,
                }
              : p
          )
        );
        showNotification("Item removed from cart", "info");
      }
    },
    [cart, productsInStock, showNotification]
  );

  const clearCart = useCallback(() => {
    // When clearing the cart, return all items' quantities to the productsInStock
    setProductsInStock((prevProducts) => {
      const updatedProducts = [...prevProducts];
      cart.forEach((cartItem) => {
        const productIndex = updatedProducts.findIndex(
          (p) => p.id === cartItem.id
        );
        if (productIndex > -1) {
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            availableStock:
              updatedProducts[productIndex].availableStock + cartItem.quantity,
          };
        }
      });
      return updatedProducts;
    });
    setCart([]);
    setQuantities({});
    showNotification("Cart cleared, items returned to stock.", "info");
  }, [cart, showNotification]);

  // --- Payment handlers ---
  const handleCashPayment = useCallback(() => {
    const paid = parseFloat(amountPaid);
    if (!paid || paid < totalAmount) {
      showNotification("Invalid amount or insufficient payment", "error");
      return;
    }

    const transaction = {
      id: generateTransactionId(),
      items: [...cart], // Capture items at the time of transaction
      total: totalAmount,
      paymentMethod: "Cash",
      status: "Completed",
      amountPaid: paid,
      change: paid - totalAmount,
      timestamp: new Date().toISOString(),
    };

    setTransactions((prev) => [...prev, transaction]);
    clearCart();
    setCashModal(false);
    setAmountPaid("");
    showNotification(
      `Payment successful! Change: ${formatCurrency(paid - totalAmount)}`,
      "success"
    );
  }, [
    amountPaid,
    totalAmount,
    cart,
    generateTransactionId,
    clearCart,
    formatCurrency,
    showNotification,
    setTransactions,
  ]);

  const handleMpesaPayment = useCallback(async () => {
    if (!mpesaPhone || mpesaPhone.length < 10) {
      showNotification("Please enter a valid phone number", "error");
      return;
    }

    setMpesaLoading(true);

    // Simulate M-PESA STK Push
    setTimeout(() => {
      const transaction = {
        id: generateTransactionId(),
        items: [...cart], // Capture items at the time of transaction
        total: totalAmount,
        paymentMethod: "M-PESA",
        status: "Completed",
        phone: mpesaPhone,
        timestamp: new Date().toISOString(),
      };

      setTransactions((prev) => [...prev, transaction]);
      clearCart();
      setMpesaModal(false);
      setMpesaPhone("");
      setMpesaLoading(false);
      showNotification("M-PESA payment successful!", "success");
    }, 3000);
  }, [
    mpesaPhone,
    totalAmount,
    cart,
    generateTransactionId,
    clearCart,
    showNotification,
    setTransactions,
  ]);

  const handleDebtPayment = useCallback(() => {
    if (!debtCustomerName.trim()) {
      showNotification("Customer name is required", "error");
      return;
    }

    const transaction = {
      id: generateTransactionId(),
      items: [...cart], // Capture items at the time of transaction
      total: totalAmount,
      paymentMethod: "Debt",
      status: "Pending", // Debt transactions are pending until paid
      timestamp: new Date().toISOString(),
    };

    const debtRecord = {
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

    setTransactions((prev) => [...prev, transaction]); // Store transaction record
    setDebts((prev) => [...prev, debtRecord]); // Store debt record
    clearCart(); // This already handles stock return
    setDebtModal(false);
    setDebtCustomerName("");
    setDebtPhone("");
    setDebtNotes("");
    showNotification("Debt transaction recorded successfully!", "success");
  }, [
    debtCustomerName,
    debtPhone,
    debtNotes,
    totalAmount,
    cart,
    generateTransactionId,
    clearCart,
    showNotification,
    setTransactions,
    setDebts,
  ]);
  const handleSearch = useCallback((searchValue) => {
    setSearchTerm(searchValue);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-2 ">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Kiosk Sales System
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Selection Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <SearchInput
                input={searchTerm} // Your component uses 'input' prop
                handleInput={handleSearch} // Your component uses 'handleInput' prop
                placeholder="Search products..."
                handleClear={() => setSearchTerm("")} // Add clear functionality
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={quantities[product.id]}
                  onQuantityChange={handleQuantityChange}
                  onAddToCart={addToCart}
                  formatCurrency={formatCurrency}
                />
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
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={updateCartQuantity}
                        onRemoveFromCart={removeFromCart}
                        formatCurrency={formatCurrency}
                      />
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
                        disabled={cart.length === 0} // Disable if cart is empty
                      >
                        <DollarSign className="h-5 w-5" />
                        Pay with Cash
                      </button>
                      <button
                        onClick={() => setMpesaModal(true)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        disabled={cart.length === 0} // Disable if cart is empty
                      >
                        <Smartphone className="h-5 w-5" />
                        Pay with M-PESA
                      </button>
                      <button
                        onClick={() => setDebtModal(true)}
                        className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                        disabled={cart.length === 0} // Disable if cart is empty
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

        {/* Modals */}
        <CashPaymentModal
          isOpen={cashModal}
          onClose={() => setCashModal(false)}
          totalAmount={totalAmount}
          amountPaid={amountPaid}
          onAmountPaidChange={setAmountPaid}
          onConfirmPayment={handleCashPayment}
          formatCurrency={formatCurrency}
        />

        <MpesaPaymentModal
          isOpen={mpesaModal}
          onClose={() => setMpesaModal(false)}
          totalAmount={totalAmount}
          mpesaPhone={mpesaPhone}
          onMpesaPhoneChange={setMpesaPhone}
          onConfirmPayment={handleMpesaPayment}
          mpesaLoading={mpesaLoading}
          formatCurrency={formatCurrency}
        />

        <DebtPaymentModal
          isOpen={debtModal}
          onClose={() => setDebtModal(false)}
          totalAmount={totalAmount}
          debtCustomerName={debtCustomerName}
          onDebtCustomerNameChange={setDebtCustomerName}
          debtPhone={debtPhone}
          onDebtPhoneChange={setDebtPhone}
          debtNotes={debtNotes}
          onDebtNotesChange={setDebtNotes}
          onConfirmPayment={handleDebtPayment}
          formatCurrency={formatCurrency}
        />

        {/* Toaster Notification */}
        <Toaster
          open={notification.open}
          state={notification.type}
          title={notification.title}
          message={notification.message}
          action={() => setNotification((prev) => ({ ...prev, open: false }))}
          position="right"
        />

        {/* --- Debug/Dev Info Section (Optional: Remove in production) --- */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Developer Info (Remove in Production)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Current Product Stock
              </h3>
              <pre className="bg-white p-3 rounded text-xs overflow-auto max-h-64">
                {JSON.stringify(productsInStock, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                All Transactions
              </h3>
              <pre className="bg-white p-3 rounded text-xs overflow-auto max-h-64">
                {JSON.stringify(transactions, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                All Debts
              </h3>
              <pre className="bg-white p-3 rounded text-xs overflow-auto max-h-64">
                {JSON.stringify(debts, null, 2)}
              </pre>
            </div>
          </div>
        </div>
        {/* --- End Debug/Dev Info Section --- */}
      </div>
  );
};

export default SalesPage;
