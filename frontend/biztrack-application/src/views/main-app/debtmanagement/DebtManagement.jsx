import React, { useState, useMemo } from 'react';
import { Search, Filter, Eye, CheckCircle, AlertTriangle, Calendar, DollarSign } from 'lucide-react';

const DebtManagement = () => {
  // Mock data for debts
  const [debts, setDebts] = useState([
    {
      id: 'TXN001',
      customerName: 'John Smith',
      customerPhone: '+1 (555) 123-4567',
      amount: 1250.00,
      status: 'Pending',
      createdDate: '2024-01-15',
      expectedPaymentDate: '2024-01-30',
      datePaid: null
    },
    {
      id: 'TXN002',
      customerName: 'Sarah Johnson',
      customerPhone: '+1 (555) 987-6543',
      amount: 875.50,
      status: 'Completed',
      createdDate: '2024-01-10',
      expectedPaymentDate: '2024-01-25',
      datePaid: '2024-01-24'
    },
    {
      id: 'TXN003',
      customerName: 'Mike Davis',
      customerPhone: '+1 (555) 456-7890',
      amount: 2100.75,
      status: 'Pending',
      createdDate: '2024-01-20',
      expectedPaymentDate: '2024-02-05',
      datePaid: null
    },
    {
      id: 'TXN004',
      customerName: 'Emily Wilson',
      customerPhone: '+1 (555) 321-0987',
      amount: 450.25,
      status: 'Completed',
      createdDate: '2024-01-08',
      expectedPaymentDate: '2024-01-22',
      datePaid: '2024-01-21'
    },
    {
      id: 'TXN005',
      customerName: 'Robert Brown',
      customerPhone: '+1 (555) 654-3210',
      amount: 3200.00,
      status: 'Pending',
      createdDate: '2024-01-05',
      expectedPaymentDate: '2024-01-20',
      datePaid: null
    },
    {
      id: 'TXN006',
      customerName: 'Lisa Anderson',
      customerPhone: '+1 (555) 789-0123',
      amount: 675.80,
      status: 'Pending',
      createdDate: '2024-01-25',
      expectedPaymentDate: '2024-02-10',
      datePaid: null
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  // Check if debt is overdue
  const isOverdue = (expectedDate, status) => {
    if (status === 'Completed') return false;
    const today = new Date();
    const expected = new Date(expectedDate);
    return expected < today;
  };

  // Filter and search debts
  const filteredDebts = useMemo(() => {
    return debts.filter(debt => {
      const matchesSearch = 
        debt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debt.customerPhone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'All' || debt.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [debts, searchTerm, statusFilter]);

  // Sort debts
  const sortedDebts = useMemo(() => {
    if (!sortConfig.key) return filteredDebts;

    return [...filteredDebts].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (sortConfig.key === 'id') {
        aValue = parseInt(aValue.replace('TXN', ''));
        bValue = parseInt(bValue.replace('TXN', ''));
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredDebts, sortConfig]);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Calculate summary statistics
  const summary = useMemo(() => {
    const pending = debts.filter(debt => debt.status === 'Pending');
    const completed = debts.filter(debt => debt.status === 'Completed');
    
    return {
      totalPending: pending.reduce((sum, debt) => sum + debt.amount, 0),
      totalCollected: completed.reduce((sum, debt) => sum + debt.amount, 0),
      pendingCount: pending.length,
      completedCount: completed.length
    };
  }, [debts]);

  // Mark debt as paid
  const markAsPaid = () => {
    const today = new Date().toISOString().split('T')[0];
    setDebts(prev => prev.map(debt => 
      debt.id === selectedDebt.id 
        ? { ...debt, status: 'Completed', datePaid: today }
        : debt
    ));
    setShowConfirmModal(false);
    setSelectedDebt(null);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Debt Management</h1>
          <p className="text-gray-600">Track and manage customer debts and payments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Pending</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalPending)}</p>
                <p className="text-xs text-gray-500">{summary.pendingCount} debts</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Collected</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalCollected)}</p>
                <p className="text-xs text-gray-500">{summary.completedCount} debts</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Debts</p>
                <p className="text-2xl font-bold text-blue-600">{debts.length}</p>
                <p className="text-xs text-gray-500">All transactions</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Collection Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((summary.completedCount / debts.length) * 100)}%
                </p>
                <p className="text-xs text-gray-500">Success rate</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by customer name, transaction ID, or phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Debt Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('id')}
                  >
                    Transaction ID
                    {sortConfig.key === 'id' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('amount')}
                  >
                    Debt Amount
                    {sortConfig.key === 'amount' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDebts.map((debt) => (
                  <tr key={debt.id} className={`hover:bg-gray-50 ${isOverdue(debt.expectedPaymentDate, debt.status) ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {debt.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {debt.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {debt.customerPhone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(debt.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        debt.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {debt.status}
                      </span>
                      {isOverdue(debt.expectedPaymentDate, debt.status) && (
                        <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Overdue
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(debt.createdDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={isOverdue(debt.expectedPaymentDate, debt.status) ? 'text-red-600 font-semibold' : ''}>
                        {formatDate(debt.expectedPaymentDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(debt.datePaid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedDebt(debt);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      {debt.status === 'Pending' && (
                        <button
                          onClick={() => {
                            setSelectedDebt(debt);
                            setShowConfirmModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {sortedDebts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No debts found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && selectedDebt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Payment</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to mark debt <strong>{selectedDebt.id}</strong> from{' '}
                <strong>{selectedDebt.customerName}</strong> as paid?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Amount: <strong>{formatCurrency(selectedDebt.amount)}</strong>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={markAsPaid}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm Payment
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedDebt(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedDebt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Debt Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Transaction ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDebt.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Amount</label>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(selectedDebt.amount)}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Customer Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDebt.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDebt.customerPhone}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedDebt.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedDebt.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created Date</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedDebt.createdDate)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Expected Payment</label>
                    <p className={`mt-1 text-sm ${isOverdue(selectedDebt.expectedPaymentDate, selectedDebt.status) ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                      {formatDate(selectedDebt.expectedPaymentDate)}
                      {isOverdue(selectedDebt.expectedPaymentDate, selectedDebt.status) && (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">OVERDUE</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Date Paid</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedDebt.datePaid)}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedDebt(null);
                  }}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtManagement;