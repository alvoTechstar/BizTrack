import React, { useMemo, useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Smartphone,
  Package,
  Eye,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StatsCard from "./StatsCard";
import DataTable from "../../../../../components/datatable";
import { GET } from "../../../../../services/DatabaseServiceImp";
import URLS from "../../../../../utilities/Endpoints";
import ContentLoader from "../../../../../components/Loader/ContentLoader";

// Transaction Details Modal Component
const TransactionDetailsModal = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Transaction Details
            </h2>
            <p className="text-sm text-gray-600">
              ID: {transaction.transactionId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Transaction Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Business Information</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm"><span className="font-medium">Business:</span> {transaction.businessName}</p>
                  <p className="text-sm"><span className="font-medium">Type:</span> {transaction.businessType}</p>
                  <p className="text-sm"><span className="font-medium">Business ID:</span> {transaction.businessId}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Shopkeeper Information</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm"><span className="font-medium">Name:</span> {transaction.shopkeeperName}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {transaction.shopkeeperEmail}</p>
                  <p className="text-sm"><span className="font-medium">Role:</span> {transaction.shopkeeperRole}</p>
                  <p className="text-sm"><span className="font-medium">ID:</span> {transaction.shopkeeperId}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Transaction Summary</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>{" "}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${transaction.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                      {transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1)}
                    </span>
                  </p>
                  <p className="text-sm"><span className="font-medium">Type:</span> {transaction.type?.charAt(0).toUpperCase() + transaction.type?.slice(1)}</p>
                  <p className="text-sm"><span className="font-medium">Payment Method:</span> {transaction.paymentMethod?.charAt(0).toUpperCase() + transaction.paymentMethod?.slice(1)}</p>
                  <p className="text-sm"><span className="font-medium">Date:</span> {new Date(transaction.timestamp).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  <p className="text-sm"><span className="font-medium">Time:</span> {new Date(transaction.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm"><span className="font-medium">Name:</span> {transaction.customerName || 'Walk-in Customer'}</p>
                  <p className="text-sm"><span className="font-medium">Phone:</span> {transaction.customerPhone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Items Purchased ({transaction.items?.length || 0})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transaction.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.productName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        KSh {item.unitPrice?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        KSh {item.totalPrice?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-semibold text-gray-900">
                KSh {transaction.totalAmount?.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Amount Paid</p>
              <p className="text-xl font-semibold text-gray-900">
                KSh {transaction.amountPaid?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Change Given</p>
              <p className="text-xl font-semibold text-gray-900">
                KSh {transaction.change?.toLocaleString() || '0'}
              </p>
            </div>
          </div>

          {/* Notes */}
          {transaction.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{transaction.notes}</p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {new Date(transaction.createdAt).toLocaleString('en-US')}
              </div>
              {transaction.updatedAt && (
                <div>
                  <span className="font-medium">Last Updated:</span>{' '}
                  {new Date(transaction.updatedAt).toLocaleString('en-US')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper to format date for display
const formatDisplayDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper to format time for display
const formatDisplayTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth?.value);
  const token = localStorage.getItem('token');

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [userData, setUserData] = useState({
    user: null,
    businessId: null,
    businessUUID: null,
    shopkeeperInfo: null,
    initialized: false
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayDate = getTodayDateString();
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const startTime = "08:00 AM";
  const endTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Check authentication and extract user data
  useEffect(() => {
    console.log("🔍 Checking authentication status...");

    // Set a timeout to show content even if authentication takes time
    const authTimeout = setTimeout(() => {
      if (loading) {
        console.log("⚠️ Authentication check taking too long, proceeding...");
        setLoading(false);
      }
    }, 2000);

    // Check if user is authenticated
    if (!currentUser || !token) {
      console.log("❌ User not authenticated, redirecting to login");
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      clearTimeout(authTimeout);
      return;
    }

    console.log("✅ User authenticated:", {
      id: currentUser.id,
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      email: currentUser.email,
      role: currentUser.role
    });

    // Extract business information from user
    const businessId = currentUser.businessId;
    const businessUUID = currentUser.businessUUID;

    if (!businessId || !businessUUID) {
      console.error("❌ No business information found in user data");
      setError("No business assigned to your account. Please contact administrator.");
      setLoading(false);
      clearTimeout(authTimeout);
      return;
    }

    console.log("🏢 Business information:", {
      businessId,
      businessUUID,
      businessName: currentUser.businessName,
      businessType: currentUser.businessType
    });

    // Get shopkeeper information from user
    const shopkeeperInfo = {
      shopkeeperId: currentUser.id,
      shopkeeperName: `${currentUser.firstName} ${currentUser.lastName}`,
      shopkeeperEmail: currentUser.email || "",
      shopkeeperRole: currentUser.role || "Kiosk_Shopkeeper",
      businessId: businessId,
      businessUUID: businessUUID,
      businessName: currentUser.businessName,
      businessType: currentUser.businessType
    };

    console.log("👤 Derived user data:", shopkeeperInfo);

    setUserData({
      user: currentUser,
      businessId,
      businessUUID,
      shopkeeperInfo,
      initialized: true
    });

    clearTimeout(authTimeout);

  }, [currentUser, token, navigate]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      setContentLoaded(false);

      // Check if user data is ready
      if (!userData.businessId) {
        console.log("⏳ Waiting for business data initialization...");
        setTimeout(() => {
          setContentLoaded(true);
          setLoading(false);
        }, 500);
        return;
      }

      console.log('🔍 Fetching transactions for business:', userData.businessId);

      // Try to use business-specific endpoint
      let endpoint;
      if (URLS.TRANSACTIONS?.GET_TRANSACTIONS_BY_BUSINESS) {
        endpoint = URLS.TRANSACTIONS.GET_TRANSACTIONS_BY_BUSINESS.replace(
          ':businessId',
          userData.businessId
        );
        console.log('🌐 Using business endpoint:', endpoint);
      }
      // Fallback to kiosk endpoint
      else if (URLS.TRANSACTIONS?.GET_TRANSACTIONS_BY_KIOSK) {
        endpoint = URLS.TRANSACTIONS.GET_TRANSACTIONS_BY_KIOSK.replace(
          ':kioskId',
          userData.businessId
        );
        console.log('🌐 Using kiosk endpoint with businessId:', endpoint);
      } else {
        throw new Error('No transaction endpoints configured');
      }

      const result = await GET(endpoint);

      if (!result || result.success === false) {
        // If business endpoint fails, try to get all and filter client-side
        console.log('⚠️ Business endpoint failed, trying alternative...');
        await fetchAllTransactionsAndFilter();
        return;
      }

      const transactionData = result.transactions || result.data || [];
      console.log('✅ Transactions data received:', transactionData.length, 'transactions');

      setTransactions(transactionData);

      setTimeout(() => {
        setContentLoaded(true);
      }, 500);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Try alternative method
      await fetchAllTransactionsAndFilter();
    } finally {
      setLoading(false);
    }
  };

  // Alternative method: fetch all transactions and filter
  const fetchAllTransactionsAndFilter = async () => {
    try {
      console.log('🔄 Trying to fetch all transactions and filter...');

      // First check if we have a GET_ALL endpoint
      if (URLS.TRANSACTIONS?.GET_ALL_TRANSACTIONS) {
        const result = await GET(URLS.TRANSACTIONS.GET_ALL_TRANSACTIONS);

        if (result && result.success) {
          const allTransactions = result.transactions || result.data || [];
          console.log('📋 All transactions loaded:', allTransactions.length);

          // Filter by businessId
          const filteredTransactions = allTransactions.filter(t =>
            t.businessId === userData.businessId ||
            t.businessId?.toString() === userData.businessId?.toString()
          );

          console.log('✅ Filtered by businessId:', filteredTransactions.length);
          setTransactions(filteredTransactions);
          setTimeout(() => {
            setContentLoaded(true);
          }, 500);
          return;
        }
      }

      // If no GET_ALL endpoint or it failed, show empty state
      console.log('⚠️ No transactions available or endpoints not working');
      setTransactions([]);
      setTimeout(() => {
        setContentLoaded(true);
      }, 500);

    } catch (fetchError) {
      console.error('Error in alternative fetch method:', fetchError);
      setError('Unable to load transactions. Please check backend configuration.');
      setContentLoaded(true);
    }
  };

  useEffect(() => {
    if (userData.initialized) {
      fetchTransactions();
    }
  }, [userData.initialized]);

  // Filter today's transactions
  const todayTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.timestamp || transaction.createdAt).toISOString().split('T')[0];
      return transactionDate === todayDate;
    });
  }, [transactions, todayDate]);

  // Calculate total sales from only completed cash/mpesa transactions today
  const totalSalesToday = useMemo(() => {
    return todayTransactions
      .filter(
        (t) =>
          t.status?.toLowerCase() === "completed" &&
          (t.paymentMethod?.toLowerCase() === "cash" ||
            t.paymentMethod?.toLowerCase() === "mpesa" ||
            t.paymentMethod?.toLowerCase() === "m-pesa")
      )
      .reduce((sum, t) => sum + (t.totalAmount || 0), 0);
  }, [todayTransactions]);

  // Calculate profit (you can adjust the profit margin as needed)
  const totalProfitToday = useMemo(() => {
    // Assuming 35% profit margin for demo
    return Math.round(totalSalesToday * 0.35);
  }, [totalSalesToday]);

  // Count payments for pie chart (only completed cash/mpesa today)
  const paymentCounts = useMemo(() => {
    return todayTransactions.reduce(
      (acc, t) => {
        if (t.status?.toLowerCase() !== "completed") return acc;
        const paymentMethod = t.paymentMethod?.toLowerCase();
        if (paymentMethod === "cash") acc.cash++;
        else if (paymentMethod === "mpesa" || paymentMethod === "m-pesa") acc.mpesa++;
        return acc;
      },
      { cash: 0, mpesa: 0 }
    );
  }, [todayTransactions]);

  const paymentData = [
    { name: "M-PESA", value: paymentCounts.mpesa },
    { name: "Cash", value: paymentCounts.cash },
  ];

  // Calculate top selling products from today's transactions
  const productSales = useMemo(() => {
    const productMap = {};

    todayTransactions.forEach(transaction => {
      if (transaction.status?.toLowerCase() === "completed" &&
        transaction.items && Array.isArray(transaction.items)) {
        transaction.items.forEach(item => {
          const productName = item.productName || 'Unknown Product';
          const quantity = item.quantity || 0;

          if (!productMap[productName]) {
            productMap[productName] = 0;
          }
          productMap[productName] += quantity;
        });
      }
    });

    // Convert to array and sort by sales (quantity sold)
    return Object.entries(productMap)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4); // Top 4 products
  }, [todayTransactions]);

  // Prepare table data from today's transactions
  const tableData = useMemo(() => {
    return todayTransactions.map(transaction => {
      const datetime = transaction.timestamp || transaction.createdAt;
      return {
        id: transaction.transactionId || transaction._id?.substring(0, 8) || 'N/A',
        datetime: `${formatDisplayDate(datetime)} ${formatDisplayTime(datetime)}`,
        products: transaction.items
          ? transaction.items.map(item => item.productName).join(", ")
          : "No items",
        amount: (transaction.totalAmount || 0).toLocaleString(),
        payment: transaction.paymentMethod?.charAt(0).toUpperCase() + transaction.paymentMethod?.slice(1) || 'Unknown',
        status: transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1) || 'Unknown',
        shopkeeper: transaction.shopkeeperName || 'N/A',
        shopkeeperEmail: transaction.shopkeeperEmail || 'N/A',
        // Store transaction ID for view action
        transactionId: transaction.transactionId || transaction._id,
        // Include original data for modal
        _originalData: transaction
      };
    });
  }, [todayTransactions]);

  // Define headers for DataTable
  const headers = [
    { key: "id", title: "Transaction ID" },
    { key: "datetime", title: "Date & Time" },
    { key: "products", title: "Products" },
    { key: "amount", title: "Total Amount" },
    { key: "payment", title: "Payment Method" },
    { key: "shopkeeper", title: "Shopkeeper" },
    { key: "shopkeeperEmail", title: "Shopkeeper Email" },
    { key: "status", title: "Status" },
    { key: "actions", title: "Actions" },
  ];

  // Define actions for DataTable - only "view" action
  const actions = ["view"];

  // Custom render function for actions column
  const renderActionsCell = (row) => {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleViewAction(row);
        }}
        className="flex items-center justify-center p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </button>
    );
  };

  // Handle view action
  const handleViewAction = (row) => {
    console.log("View action clicked for row:", row);
    
    // Use the original data from the row
    if (row._originalData) {
      setSelectedTransaction(row._originalData);
      setIsModalOpen(true);
    } else {
      // Fallback: try to find transaction by ID
      const transaction = todayTransactions.find(t => 
        t.transactionId === row.transactionId || 
        t._id === row.transactionId ||
        t.transactionId === row.id ||
        t._id?.includes(row.id)
      );
      
      if (transaction) {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
      } else {
        console.error("Transaction not found for row:", row);
      }
    }
  };

  // Required callback functions for your DataTable
  const handleSelectedRow = (e, row) => {
    console.log("Row selected:", row);
  };

  const handleSelectedAction = (selected) => {
    console.log("Selected actions:", selected);
  };

  const handleActionSelected = (action, id, rowData) => {
    console.log("Action:", action, "ID:", id, "Row Data:", rowData);
    if (action === "view") {
      // If rowData is provided, use it directly
      if (rowData && rowData._originalData) {
        setSelectedTransaction(rowData._originalData);
        setIsModalOpen(true);
      } else {
        // Otherwise find by ID
        handleViewAction({ id, transactionId: id, ...rowData });
      }
    }
  };

  const handleRefresh = () => {
    setContentLoaded(false);
    fetchTransactions();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Combined loading state
  const isLoading = loading || !contentLoaded || (!userData.initialized && loading);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-2 flex items-center justify-center">
        <div className="text-center">
          <ContentLoader
            state={true}
            loading={true}
            loadingText="Loading dashboard..."
            loadedText=""
            color="#3b82f6" // Blue color matching your theme
          />
        </div>
      </div>
    );
  }

  // Error state - no user or no business assigned
  if (!userData.user || !userData.businessId) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-4">
              {!userData.user ? "User Not Logged In" : "No Business Assigned"}
            </div>
            <div className="text-gray-600 mb-6">
              {!userData.user
                ? "Please log in to access the dashboard."
                : "Your account is not assigned to any business. Please contact your administrator."}
            </div>
            {!userData.user && (
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If error loading data, show error
  if (error) {
    return (
      <div className="min-h-screen bg-white p-2">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700">Sales Overview</h2>
          <p className="text-sm text-gray-500">
            {userData.shopkeeperInfo?.businessName || "Dashboard"}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white p-2">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-700">Sales Overview</h2>
              <p className="text-sm text-gray-500">
                Welcome back, {userData.shopkeeperInfo?.shopkeeperName}! Here's your business at a glance
              </p>
              <div className="flex items-center gap-4 text-gray-600 mt-1">
                <div className="flex items-center gap-1 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>{dateString}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{startTime} - {endTime}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Sales Today"
            value={`KSh ${totalSalesToday.toLocaleString()}`}
            change="+8.2%"
            icon={<DollarSign />}
            color="blue"
          />
          <StatsCard
            title="Profit Today"
            value={`KSh ${totalProfitToday.toLocaleString()}`}
            change="+5.7%"
            icon={<TrendingUp />}
            color="green"
          />
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-5 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-700 font-medium">M-PESA vs Cash</h3>
                <Smartphone size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="px-5 py-2 h-36">
              {paymentCounts.cash > 0 || paymentCounts.mpesa > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {paymentData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#3b82f6", "#10b981"][index % 2]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No payment data available
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-5 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-700 font-medium">
                  Top Selling Products
                </h3>
                <Package size={20} className="text-amber-600" />
              </div>
            </div>
            <div className="px-2 py-2 h-36">
              {productSales.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productSales}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      opacity={0.3}
                    />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <RechartsTooltip />
                    <Bar
                      dataKey="sales"
                      fill="#3b82f6"
                      barSize={12}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No product sales data
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Today's Transactions ({todayTransactions.length})
            </h3>
            <div className="text-sm text-gray-500">
              Showing {todayTransactions.length} transaction{todayTransactions.length !== 1 ? 's' : ''}
            </div>
          </div>
          {todayTransactions.length > 0 ? (
            <DataTable
              data={tableData}
              headers={headers}
              type="default"
              pagination={false}
              searchFilter=""
              actions={actions} // Only "view" action
              selected={[]}
              selectAll={false}
              // Required callback functions
              selectedRow={handleSelectedRow}
              selectedAction={handleSelectedAction}
              actionSelected={handleActionSelected}
              // Optional props with safe defaults
              clickable={true}
              color="primary"
              // Add custom render for cells
              customRenderCell={(column, header) => {
                if (header.key === "amount") {
                  return `KSh ${column[header.key]}`;
                }
                if (header.key === "actions") {
                  return renderActionsCell(column);
                }
                return column[header.key];
              }}
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions today</h3>
              <p className="text-gray-500">No sales transactions have been recorded for today yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}

// Add Calendar icon component if not already imported
const Calendar = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);