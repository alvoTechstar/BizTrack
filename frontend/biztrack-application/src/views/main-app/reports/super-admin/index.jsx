// src/views/main-app/reports/super-admin/SuperAdminReports.jsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Import new modular components
import KPICardsSection from './KpiCardSection';
import ReportsControls from './ReportsControls';
import RevenueTrendChart from './RevenueTrendChart';
import TransactionsReportTable from './TransactionReportsTable';
import PaymentBreakdownChart from './PaymentBreakdownChart';
import BusinessPerformanceCharts from './BusinessPerformanceChart';

// Extend dayjs with necessary plugins
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

const MOCK_TRANSACTION_DATA = [
  // Past data (for trends)
  { id: 'TXN001', businessName: 'Hyatt Regency', businessType: 'Hotel', date: '2025-05-01', commission: 150.00, paymentMethod: 'M-PESA', status: 'Completed' },
  { id: 'TXN002', businessName: 'Safari Lounge', businessType: 'Restaurant', date: '2025-05-01', commission: 25.50, paymentMethod: 'Cash', status: 'Completed' },
  { id: 'TXN003', businessName: 'Acme Hardware', businessType: 'Retail', date: '2025-05-02', commission: 12.75, paymentMethod: 'Debt', status: 'Pending' },
  { id: 'TXN004', businessName: 'City Tours', businessType: 'Tour Operator', date: '2025-05-02', commission: 70.00, paymentMethod: 'M-PESA', status: 'Completed' },
  { id: 'TXN005', businessName: 'Medical Centre', businessType: 'Healthcare', date: '2025-05-03', commission: 45.00, paymentMethod: 'Cash', status: 'Failed' },
  { id: 'TXN006', businessName: 'Hotel Delta', businessType: 'Hotel', date: '2025-05-03', commission: 200.00, paymentMethod: 'M-PESA', status: 'Completed' },
  { id: 'TXN007', businessName: 'Tech Solutions', businessType: 'IT', date: '2025-05-04', commission: 100.00, paymentMethod: 'Debt', status: 'Pending' },
  { id: 'TXN008', businessName: 'Local Grocer', businessType: 'Supermarket', date: '2025-05-04', commission: 18.20, paymentMethod: 'Cash', status: 'Completed' },
  { id: 'TXN009', businessName: 'Craft Brewery', businessType: 'Bar', date: '2025-05-05', commission: 30.00, paymentMethod: 'M-PESA', status: 'Completed' },
  { id: 'TXN010', businessName: 'Quick Repairs', businessType: 'Services', date: '2025-05-05', commission: 8.50, paymentMethod: 'Cash', status: 'Completed' },
  // Recent data (up to today, June 7, 2025)
  { id: 'TXN011', businessName: 'Prime Hotel', businessType: 'Hotel', date: '2025-06-01', commission: 180.00, paymentMethod: 'M-PESA', status: 'Completed' },
  { id: 'TXN012', businessName: 'Gourmet Bites', businessType: 'Restaurant', date: '2025-06-01', commission: 30.25, paymentMethod: 'Cash', status: 'Completed' },
  { id: 'TXN013', businessName: 'Home Essentials', businessType: 'Retail', date: '2025-06-02', commission: 15.00, paymentMethod: 'Debt', status: 'Pending' },
  { id: 'TXN014', businessName: 'Adventure Safaris', businessType: 'Tour Operator', date: '2025-06-02', commission: 85.00, paymentMethod: 'M-PESA', status: 'Completed' },
  { id: 'TXN015', businessName: 'MediCare Clinic', businessType: 'Healthcare', date: '2025-06-03', commission: 50.00, paymentMethod: 'Cash', status: 'Failed' },
  { id: 'TXN016', businessName: 'Luxury Resort', businessType: 'Hotel', date: '2025-06-03', commission: 220.00, paymentMethod: 'M-PESA', status: 'Completed' },
  { id: 'TXN017', businessName: 'Code Wizards', businessType: 'IT', date: '2025-06-04', commission: 110.00, paymentMethod: 'Debt', status: 'Pending' },
  { id: 'TXN018', businessName: 'Daily Mart', businessType: 'Supermarket', date: '2025-06-04', commission: 20.00, paymentMethod: 'Cash', status: 'Completed' },
  { id: 'TXN019', businessName: 'Rooftop Bar', businessType: 'Bar', date: '2025-06-05', commission: 35.00, paymentMethod: 'M-PESA', status: 'Completed' },
  { id: 'TXN020', businessName: 'Express Laundry', businessType: 'Services', date: '2025-06-05', commission: 10.00, paymentMethod: 'Cash', status: 'Completed' },
  { id: 'TXN021', businessName: 'Safari Hotel', businessType: 'Hotel', date: '2025-06-06', commission: 190.00, paymentMethod: 'M-PESA', status: 'Completed' },
  { id: 'TXN022', businessName: 'Artisan Cafe', businessType: 'Restaurant', date: '2025-06-06', commission: 28.00, paymentMethod: 'Cash', status: 'Completed' },
  { id: 'TXN023', businessName: 'Furniture World', businessType: 'Retail', date: '2025-06-07', commission: 18.00, paymentMethod: 'Debt', status: 'Pending' },
  { id: 'TXN024', businessName: 'Wilderness Expeditions', businessType: 'Tour Operator', date: '2025-06-07', commission: 90.00, paymentMethod: 'M-PESA', status: 'Completed' },
  { id: 'TXN025', businessName: 'Health First', businessType: 'Healthcare', date: '2025-06-07', commission: 55.00, paymentMethod: 'Cash', status: 'Completed' },
];

const SuperAdminReports = () => {
  const [dateRange, setDateRange] = useState([null, null]); // [startDate, endDate]
  const [selectedTab, setSelectedTab] = useState(0); // 0 for Revenue Trend, 1 for Transactions, etc.

  // ─── Filtered Data based on Date Range ──────────────────────────────────
  const filteredTransactions = useMemo(() => {
    const [startDate, endDate] = dateRange;

    if (!startDate && !endDate) {
      return MOCK_TRANSACTION_DATA;
    }

    return MOCK_TRANSACTION_DATA.filter(transaction => {
      const transactionDate = dayjs(transaction.date);
      // Ensure both start and end dates are valid Dayjs objects for comparison
      const start = startDate ? startDate.startOf('day') : null;
      const end = endDate ? endDate.endOf('day') : null;

      if (start && end) {
        return transactionDate.isBetween(start, end, 'day', '[]'); // Inclusive
      } else if (start && !end) {
        return transactionDate.isSameOrAfter(start, 'day'); // From start date onwards
      } else if (!start && end) {
        return transactionDate.isSameOrBefore(end, 'day'); // Up to end date
      }
      return true; // Fallback if no valid date range selected
    });
  }, [dateRange]);

  // ─── Render Logic for Tabs ──────────────────────────────────────────
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0: // Revenue Trend
        return <RevenueTrendChart transactions={filteredTransactions} />;
      case 1: // Transactions
        return <TransactionsReportTable transactions={filteredTransactions} />;
      case 2: // Payment Breakdown
        return <PaymentBreakdownChart transactions={filteredTransactions} />;
      case 3: // Business Performance
        return <BusinessPerformanceCharts transactions={filteredTransactions} />;
      default:
        return null;
    }
  };

  return (
    <Box className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Typography variant="h4" component="h1" className="text-gray-800 font-bold mb-2">
          Super Admin Reports
        </Typography>
        <Typography className="text-gray-600">
          Comprehensive financial and performance insights.
        </Typography>
      </header>

      {/* KPI Cards Section */}
      <KPICardsSection transactions={filteredTransactions} />

      {/* Date Range Filter & Export Buttons */}
      <ReportsControls
        dateRange={dateRange}
        setDateRange={setDateRange}
        filteredTransactions={filteredTransactions}
        selectedTab={selectedTab}
      />

      {/* Tabs Layout */}
      <Paper elevation={2} className="p-4 rounded-lg">
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)} aria-label="super admin reports tabs">
          <Tab label="Revenue Trend" />
          <Tab label="Transactions" />
          <Tab label="Payment Breakdown" />
          <Tab label="Business Performance" />
        </Tabs>
        <Box className="pt-4"> {/* Padding below tabs */}
          {renderTabContent()}
        </Box>
      </Paper>
    </Box>
  );
};

export default SuperAdminReports;