import React, { useState, useMemo, useCallback, useEffect } from "react";
import { RefreshCw, AlertTriangle, TrendingUp, CreditCard, CheckCircle } from "lucide-react";
import { GET, PUT, POST } from "../../../services/DatabaseServiceImp";
import URLS from "../../../utilities/Endpoints";
import Toaster from "../../../components/Toaster";
import CashPaymentModal from "../sales/kiosk/CashPaymentModal";
import MpesaPaymentModal from "../sales/kiosk/MpesaPaymentModal";
import ContentLoader from "../../../components/Loader/ContentLoader";
import { useTheme } from "../../../components/theme/ThemeContext";
import DebtSummaryCards from "./DebtSummaryCards";
import DebtControls from "./DebtControls";
import DebtDetailModal from "./DebtDetailModal";
import PaymentOptionsModal from "./PaymentOptionsModal";
import DebtDataTable from "./DebtDataTable";
import { useSelector } from "react-redux";
import { formatCurrency, formatDate } from "../../../utilities/SharedFunctions";

const DebtManagement = () => {
  const { primaryColor } = useTheme();
  const currentUser = useSelector((state) => state.auth?.value);

  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading debts...");
  const [error, setError] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentOptionsModal, setShowPaymentOptionsModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  const [showCashPaymentModal, setShowCashPaymentModal] = useState(false);
  const [showMpesaPaymentModal, setShowMpesaPaymentModal] = useState(false);
  const [amountPaid, setAmountPaid] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [mpesaLoading, setMpesaLoading] = useState(false);

  const [modalLoading, setModalLoading] = useState(false);
  const [modalLoadingText, setModalLoadingText] = useState("");
  const [operationLoading, setOperationLoading] = useState(false);
  const [operationLoadingText, setOperationLoadingText] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    title: "",
    message: "",
    type: "success",
  });

  const [businessInfo, setBusinessInfo] = useState({
    businessId: null,
    businessUUID: null,
    businessName: null
  });

  useEffect(() => {
    if (currentUser) {
      const userBusinessId = currentUser.businessId || currentUser.businessID;
      const userBusinessUUID = currentUser.businessUUID;
      const userBusinessName = currentUser.businessName;

      if (userBusinessId) {
        setBusinessInfo({
          businessId: userBusinessId,
          businessUUID: userBusinessUUID,
          businessName: userBusinessName
        });
      }
    }
  }, [currentUser]);

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
        title = "Heads Up!";
        stateValue = "";
        break;
      default:
        title = "Notification";
        stateValue = "";
    }

    setNotification({ open: true, title, message, type: stateValue });
    setTimeout(() => setNotification((prev) => ({ ...prev, open: false })), 3000);
  }, []);

  const isOverdue = useCallback((expectedDate, status) => {
    if (status === "Completed" || status === "completed" || status === "paid") return false;
    if (!expectedDate) return false;
    const today = new Date();
    const expected = new Date(expectedDate);
    return expected < today;
  }, []);

  const openModalWithLoader = async (modalType, debt = null) => {
    setModalLoading(true);
    switch (modalType) {
      case 'detail':
        setModalLoadingText("Loading debt details...");
        break;
      case 'payment':
        setModalLoadingText("Loading payment options...");
        break;
      default:
        setModalLoadingText("Loading...");
    }
    await new Promise(resolve => setTimeout(resolve, 300));
    if (debt) setSelectedDebt(debt);
    setModalLoading(false);
    switch (modalType) {
      case 'detail':
        setShowDetailModal(true);
        break;
      case 'payment':
        setShowPaymentOptionsModal(true);
        break;
    }
  };

  const generatePaymentReport = useCallback(() => {
    const paidDebts = debts.filter(debt => debt.status === "completed" || debt.paymentStatus === "paid");
    const pendingDebts = debts.filter(debt => debt.status === "pending" || debt.paymentStatus === "pending");

    const totalDebtAmount = debts.reduce((sum, debt) => sum + (debt.totalAmount || debt.amount || 0), 0);
    const totalCollected = paidDebts.reduce((sum, debt) => sum + (debt.totalAmount || debt.amount || 0), 0);
    const recoveryRate = totalDebtAmount > 0 ? ((totalCollected / totalDebtAmount) * 100).toFixed(1) : 0;

    const report = {
      generatedDate: new Date().toISOString(),
      summary: {
        totalDebts: debts.length,
        totalDebtAmount: totalDebtAmount,
        recoveredAmount: totalCollected,
        pendingAmount: pendingDebts.reduce((sum, d) => sum + (d.totalAmount || d.amount || 0), 0),
        recoveryRate: `${recoveryRate}%`
      },
      paidDebts: paidDebts.map(debt => ({
        customer: debt.customerName,
        amount: debt.totalAmount || debt.amount || 0,
        paymentMethod: debt.paymentMethod || 'Unknown',
        datePaid: debt.paidAt || debt.datePaid,
        originalTransaction: debt.transactionId
      })),
      pendingDebts: pendingDebts.map(debt => ({
        customer: debt.customerName,
        amount: debt.totalAmount || debt.amount || 0,
        dueDate: debt.dueDate || debt.expectedPaymentDate,
        overdue: isOverdue(debt.dueDate || debt.expectedPaymentDate, debt.status)
      }))
    };

    showNotification(`Payment report generated. Recovered: ${formatCurrency(totalCollected)}`, "info");
    return report;
  }, [debts, formatCurrency, isOverdue, showNotification]);

  const fetchDebts = useCallback(async () => {
    if (!businessInfo.businessId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadingText("Loading debt transactions...");
    setError(null);

    try {
      const endpoint = URLS.TRANSACTIONS.GET_TRANSACTIONS_BY_BUSINESS.replace(':businessId', businessInfo.businessId);
      console.log('📋 Fetching transactions from:', endpoint);

      const response = await GET(endpoint);

      if (response.success) {
        console.log('✅ All transactions received:', response.transactions?.length || 0);

        // Filter for debt transactions
        const debtTransactions = response.transactions.filter(transaction => {
          // Check if it's a debt transaction
          const isDebtTransaction =
            transaction.type === 'debt' ||
            transaction.transactionType === 'debt' ||
            transaction.paymentMethod === 'debt';

          console.log('Transaction check:', {
            id: transaction.transactionId,
            type: transaction.type,
            paymentMethod: transaction.paymentMethod,
            status: transaction.status,
            isDebtTransaction,
            totalAmount: transaction.totalAmount
          });

          return isDebtTransaction;
        });

        console.log('💰 Debt transactions found:', debtTransactions.length);

        // Log each debt transaction for debugging
        debtTransactions.forEach((transaction, index) => {
          console.log(`Debt ${index + 1}:`, {
            id: transaction._id,
            transactionId: transaction.transactionId,
            type: transaction.type,
            paymentMethod: transaction.paymentMethod,
            status: transaction.status,
            customerName: transaction.customerName,
            amount: transaction.totalAmount,
            itemsCount: transaction.items?.length || 0
          });
        });

        const transformedDebts = debtTransactions.map(transaction => {
          const amount = transaction.totalAmount || 0;

          // Determine if debt is paid
          const isPaid =
            transaction.status === 'completed' ||
            transaction.paymentStatus === 'paid' ||
            transaction.paymentMethod !== 'debt'; // If paymentMethod is not 'debt', it's likely paid

          // Determine status
          let status = transaction.status || 'pending';
          if (isPaid) {
            status = 'completed';
          }

          // Calculate due date (7 days from creation if not set)
          const createdAt = transaction.timestamp || transaction.createdAt;
          let dueDate = transaction.dueDate || transaction.expectedPaymentDate;
          if (!dueDate && createdAt) {
            const createdDate = new Date(createdAt);
            createdDate.setDate(createdDate.getDate() + 7); // 7 days credit
            dueDate = createdDate.toISOString();
          }

          return {
            id: transaction._id,
            _id: transaction._id,
            transactionId: transaction.transactionId,
            customerName: transaction.customerName || "Unknown Customer",
            customerPhone: transaction.customerPhone || "N/A",
            amount: amount,
            totalAmount: amount,
            total: amount,
            status: status,
            paymentStatus: transaction.paymentStatus || status,
            paymentMethod: transaction.paymentMethod,
            originalPaymentMethod: transaction.paymentMethod,
            createdDate: createdAt,
            timestamp: createdAt,
            dueDate: dueDate,
            expectedPaymentDate: dueDate,
            datePaid: transaction.datePaid || transaction.paidAt,
            paidAt: transaction.paidAt || transaction.datePaid,
            notes: transaction.notes || `Debt transaction for ${transaction.customerName || 'customer'}`,
            items: transaction.items || [],
            discount: transaction.discount || 0,
            tax: transaction.tax || 0,
            subtotal: transaction.subtotal || amount,
            businessId: transaction.businessId,
            businessUUID: transaction.businessUUID,
            isDebtTransaction: true,
            debtPaid: isPaid,
            debtPaymentMethod: transaction.paymentMethod !== 'debt' ? transaction.paymentMethod : null,
            debtPaymentDate: transaction.datePaid || transaction.paidAt,
            shopkeeperId: transaction.shopkeeperId,
            shopkeeperName: transaction.shopkeeperName,
            originalTransaction: transaction
          };
        });

        console.log('✅ Transformed debts:', transformedDebts.length);
        setDebts(transformedDebts);

      } else {
        const errorMsg = response.message || 'Failed to fetch transactions';
        setError(errorMsg);
        console.error('❌ Error fetching transactions:', errorMsg);
        showNotification(errorMsg, "error");
      }
    } catch (error) {
      console.error('❌ Error in fetchDebts:', error);
      const errorMsg = error.message || 'Failed to load debt transactions';
      setError(errorMsg);
      showNotification("Failed to load debt transactions. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [businessInfo.businessId, showNotification]);

  useEffect(() => {
    if (businessInfo.businessId) {
      fetchDebts();
    }
  }, [businessInfo.businessId, fetchDebts]);

  const filteredDebts = useMemo(() => {
    return debts.filter(debt => {
      const matchesSearch =
        debt.customerName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        debt.transactionId?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        debt.customerPhone?.includes(searchFilter);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Pending" && (debt.status === "pending" || debt.paymentStatus === "pending")) ||
        (statusFilter === "Completed" && (debt.status === "completed" || debt.paymentStatus === "paid"));

      return matchesSearch && matchesStatus;
    });
  }, [debts, searchFilter, statusFilter]);

  const summary = useMemo(() => {
    const pending = debts.filter(debt => debt.status === "pending" || debt.paymentStatus === "pending");
    const completed = debts.filter(debt => debt.status === "completed" || debt.paymentStatus === "paid");
    const overdue = pending.filter(debt => isOverdue(debt.dueDate || debt.expectedPaymentDate, debt.status));

    const totalDebtAmount = debts.reduce((sum, debt) => sum + (debt.totalAmount || debt.amount || 0), 0);
    const totalCollected = completed.reduce((sum, debt) => sum + (debt.totalAmount || debt.amount || 0), 0);
    const recoveryRate = totalDebtAmount > 0 ? (totalCollected / totalDebtAmount) * 100 : 0;

    return {
      totalPending: pending.reduce((sum, debt) => sum + (debt.totalAmount || debt.amount || 0), 0),
      totalCollected: totalCollected,
      totalOverdue: overdue.reduce((sum, debt) => sum + (debt.totalAmount || debt.amount || 0), 0),
      pendingCount: pending.length,
      completedCount: completed.length,
      overdueCount: overdue.length,
      totalDebts: debts.length,
      totalDebtAmount: totalDebtAmount,
      recoveryRate: recoveryRate.toFixed(1)
    };
  }, [debts, isOverdue]);

  const handleDebtPayment = async (paymentMethod, phone = null, cashAmount = null) => {
    if (!selectedDebt || !businessInfo.businessId) return;

    setOperationLoading(true);
    setOperationLoadingText("Processing payment...");

    try {
      const paymentAmount = cashAmount || selectedDebt.amount;
      const now = new Date().toISOString();

      const paymentData = {
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: paymentMethod,
        originalPaymentMethod: selectedDebt.originalPaymentMethod || 'debt',
        datePaid: now,
        paidAt: now,
        debtPaid: true,
        debtPaymentDate: now,
        debtPaymentMethod: paymentMethod,
        amountPaid: paymentAmount,
        updatedAt: now
      };

      if (paymentMethod === 'Cash' && cashAmount) {
        paymentData.paymentDetails = {
          type: 'cash',
          amountReceived: cashAmount,
          amountDue: selectedDebt.amount,
          changeGiven: cashAmount - selectedDebt.amount,
          paymentDate: now
        };
      }

      if (paymentMethod === 'M-PESA' && phone) {
        paymentData.paymentDetails = {
          type: 'mpesa',
          phoneNumber: phone,
          amount: selectedDebt.amount,
          timestamp: now,
          transactionReference: `MPESA-${Date.now()}`
        };
      }

      const transactionId = selectedDebt._id || selectedDebt.id;

      if (!transactionId) {
        throw new Error('Transaction ID not found');
      }

      // FIX: Check if the URL endpoint exists and has the correct format
      let updateEndpoint;
      if (URLS.TRANSACTIONS?.UPDATE_TRANSACTION) {
        updateEndpoint = URLS.TRANSACTIONS.UPDATE_TRANSACTION.replace(':id', transactionId);
      } else if (URLS.TRANSACTIONS?.UPDATE) {
        updateEndpoint = URLS.TRANSACTIONS.UPDATE.replace(':id', transactionId);
      } else {
        // Fallback to a generic endpoint
        updateEndpoint = `/api/transactions/${transactionId}`;
        console.warn('Using fallback transaction update endpoint');
      }

      console.log('Updating transaction at:', updateEndpoint);

      const updateResponse = await PUT(updateEndpoint, paymentData);

      if (!updateResponse || updateResponse.success === false) {
        const errorMsg = updateResponse?.message || 'Failed to update transaction';
        throw new Error(errorMsg);
      }

      // Handle M-PESA payment if needed
      if (paymentMethod === 'M-PESA' && phone && URLS.MPESA?.STK_PUSH) {
        setMpesaLoading(true);
        const mpesaTransactionId = selectedDebt.transactionId || transactionId;
        try {
          const mpesaResponse = await POST(URLS.MPESA.STK_PUSH, {
            phone: phone,
            amount: selectedDebt.amount,
            businessId: businessInfo.businessId,
            businessUUID: businessInfo.businessUUID,
            transactionId: `DEBT-PAY-${mpesaTransactionId}`,
            description: `Debt payment for ${selectedDebt.customerName}`,
            reference: `Debt Payment - ${selectedDebt.transactionId}`
          });

          if (!mpesaResponse?.success) {
            console.log('M-PESA notification failed but transaction saved');
          }
        } catch (mpesaError) {
          console.error('M-PESA API error:', mpesaError);
          // Continue even if M-PESA fails - transaction is still saved
        }
      }

      // Update local state
      setDebts(prevDebts =>
        prevDebts.map(debt =>
          debt.id === selectedDebt.id
            ? {
              ...debt,
              status: 'completed',
              paymentStatus: 'paid',
              paymentMethod: paymentMethod,
              datePaid: now,
              paidAt: now,
              paymentDetails: paymentData.paymentDetails || {},
              debtPaid: true,
              debtPaymentMethod: paymentMethod,
              debtPaymentDate: now,
              amountPaid: paymentAmount
            }
            : debt
        )
      );

      let notificationMessage = '';
      if (paymentMethod === 'Cash' && cashAmount) {
        const changeMessage = cashAmount > selectedDebt.amount
          ? ` Change: ${formatCurrency(cashAmount - selectedDebt.amount)}`
          : '';
        notificationMessage = `Cash payment of ${formatCurrency(selectedDebt.amount)} recorded for ${selectedDebt.customerName}.${changeMessage}`;
      } else if (paymentMethod === 'M-PESA' && phone) {
        notificationMessage = `M-PESA payment of ${formatCurrency(selectedDebt.amount)} recorded for ${selectedDebt.customerName}`;
      }

      showNotification(notificationMessage, "success");
      closeAllModals();

      // Refresh data after 1 second
      setTimeout(() => {
        fetchDebts();
      }, 1000);

    } catch (error) {
      console.error('❌ Error processing debt payment:', error);
      showNotification(`Payment failed: ${error.message}`, "error");
    } finally {
      setOperationLoading(false);
      setMpesaLoading(false);
    }
  };

  const handleCashPayment = (paidAmount) => {
    handleDebtPayment('Cash', null, paidAmount);
  };

  const handleMpesaPayment = (phone) => {
    handleDebtPayment('M-PESA', phone, null);
  };

  const handleRowSelect = (event, row) => {
    openModalWithLoader('detail', row.originalData);
  };

  const handleActionSelected = async (action, id) => {
    const debt = debts.find(d => d.id === id);
    if (!debt) return;

    if (action === 'view') {
      openModalWithLoader('detail', debt);
    } else if (action === 'pay') {
      if (debt.status === 'pending' || debt.paymentStatus === 'pending') {
        openModalWithLoader('payment', debt);
      } else {
        showNotification("This debt is already paid", "info");
      }
    }
  };

  const tableData = useMemo(() => {
    return filteredDebts.map(debt => {
      const isPaid = debt.status === "completed" || debt.paymentStatus === "paid" || debt.debtPaid;
      const isCurrentlyOverdue = isOverdue(debt.dueDate || debt.expectedPaymentDate, debt.status);

      let statusText = "";
      if (isPaid) {
        statusText = "Recovered";
      } else if (isCurrentlyOverdue) {
        statusText = "Overdue";
      } else {
        statusText = "Pending";
      }

      let paymentMethodText = "Debt";
      if (isPaid && debt.debtPaymentMethod) {
        paymentMethodText = debt.debtPaymentMethod;
      } else if (debt.paymentMethod) {
        paymentMethodText = debt.paymentMethod;
      }

      return {
        id: debt.id,
        transactionId: debt.transactionId,
        customerName: debt.customerName,
        customerPhone: debt.customerPhone,
        amount: formatCurrency(debt.totalAmount || debt.amount || 0),
        status: statusText,
        paymentMethod: paymentMethodText,
        createdDate: formatDate(debt.createdDate || debt.timestamp),
        expectedPaymentDate: formatDate(debt.dueDate || debt.expectedPaymentDate),
        datePaid: isPaid ? formatDate(debt.datePaid || debt.paidAt) : "Not Paid",
        isPaid: isPaid,
        // Make sure items are included
        items: debt.items || [],
        originalData: debt
      };
    });
  }, [filteredDebts, formatCurrency, formatDate, isOverdue]);

  const closeAllModals = () => {
    setShowDetailModal(false);
    setShowPaymentOptionsModal(false);
    setShowCashPaymentModal(false);
    setShowMpesaPaymentModal(false);
    setSelectedDebt(null);
    setAmountPaid("");
    setMpesaPhone("");
  };

  // Loading states
  if (operationLoading || modalLoading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className='main-app-view'>
            <div className="main-app-content-container">
              <ContentLoader
                state={true}
                loading={true}
                loadingText={operationLoadingText || modalLoadingText}
                loadedText=""
                color={primaryColor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading && debts.length === 0) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className='main-app-view'>
            <div className="main-app-content-container">
              <ContentLoader
                state={true}
                loading={true}
                loadingText={loadingText}
                loadedText=""
                color={primaryColor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!businessInfo.businessId && !loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Business Not Available</h2>
          <p className="text-gray-600 mb-4">Unable to load debts. Your account is not associated with any business.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isAnyModalOpen = showDetailModal || showPaymentOptionsModal ||
    showCashPaymentModal || showMpesaPaymentModal;

  if (isAnyModalOpen) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
          {showDetailModal && (
            <div className="w-full max-w-4xl">
              <DebtDetailModal
                showDetailModal={showDetailModal}
                setShowDetailModal={setShowDetailModal}
                selectedDebt={selectedDebt}
                setSelectedDebt={setSelectedDebt}
                setShowPaymentOptionsModal={setShowPaymentOptionsModal}
                actionLoading={operationLoading}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                isOverdue={isOverdue}
              />
            </div>
          )}

          {showPaymentOptionsModal && (
            <div className="w-full max-w-md">
              <PaymentOptionsModal
                showPaymentOptionsModal={showPaymentOptionsModal}
                setShowPaymentOptionsModal={setShowPaymentOptionsModal}
                selectedDebt={selectedDebt}
                setSelectedDebt={setSelectedDebt}
                setShowCashPaymentModal={setShowCashPaymentModal}
                setShowMpesaPaymentModal={setShowMpesaPaymentModal}
                actionLoading={operationLoading}
                formatCurrency={formatCurrency}
              />
            </div>
          )}

          {showCashPaymentModal && (
            <div className="w-full max-w-md">
              <CashPaymentModal
                isOpen={showCashPaymentModal}
                onClose={() => {
                  setShowCashPaymentModal(false);
                  setSelectedDebt(null);
                  setAmountPaid("");
                }}
                totalAmount={selectedDebt?.amount || 0}
                amountPaid={amountPaid}
                onAmountPaidChange={setAmountPaid}
                onConfirmPayment={handleCashPayment}
                formatCurrency={formatCurrency}
              />
            </div>
          )}

          {showMpesaPaymentModal && (
            <div className="w-full max-w-md">
              <MpesaPaymentModal
                isOpen={showMpesaPaymentModal}
                onClose={() => {
                  setShowMpesaPaymentModal(false);
                  setSelectedDebt(null);
                  setMpesaPhone("");
                }}
                totalAmount={selectedDebt?.amount || 0}
                mpesaPhone={mpesaPhone}
                onMpesaPhoneChange={setMpesaPhone}
                onConfirmPayment={handleMpesaPayment}
                mpesaLoading={mpesaLoading || operationLoading}
                formatCurrency={formatCurrency}
              />
            </div>
          )}
        </div>

        <Toaster
          open={notification.open}
          state={notification.type}
          title={notification.title}
          message={notification.message}
          action={() => setNotification((prev) => ({ ...prev, open: false }))}
          position="right"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Debt Management
              </h1>
              <p className="text-gray-600">
                Track and manage all customer debts and recoveries
              </p>
              {businessInfo.businessName && (
                <p className="text-gray-500 text-sm mt-1">
                  Business: {businessInfo.businessName}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={generatePaymentReport}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
                Generate Report
              </button>
              <button
                onClick={fetchDebts}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        <DebtSummaryCards
          summary={summary}
          formatCurrency={formatCurrency}
          debts={debts}
        />

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Debt Records</p>
                  <p className="text-xl font-bold text-blue-900">{debts.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">Recovered Debts</p>
                  <p className="text-xl font-bold text-green-900">{summary.completedCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-700">Pending Debts</p>
                  <p className="text-xl font-bold text-yellow-900">{summary.pendingCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-700">Overdue Debts</p>
                  <p className="text-xl font-bold text-red-900">{summary.overdueCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DebtControls
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {debts.length === 0 && !loading ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Debt Transactions Found</h3>
            <p className="text-gray-500">
              No debt transactions recorded for your business.
              <br />
              <span className="text-sm">Debt transactions appear when customers buy on credit in the sales system.</span>
            </p>
          </div>
        ) : (
          <DebtDataTable
            tableData={tableData}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            handleRowSelect={handleRowSelect}
            handleActionSelected={handleActionSelected}
            setSelectAll={setSelectAll}
            searchFilter={searchFilter}
          />
        )}
      </div>

      <Toaster
        open={notification.open}
        state={notification.type}
        title={notification.title}
        message={notification.message}
        action={() => setNotification((prev) => ({ ...prev, open: false }))}
        position="right"
      />
    </div>
  );
};

export default DebtManagement;