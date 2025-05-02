import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import {
  AttachMoney,
  Receipt,
  HourglassEmpty,
  CreditCard,
  Visibility,
  Payments
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Mock data for the dashboard
const paymentData = {
  totalPayments: 12750.50,
  ordersProcessed: 87,
  pendingPayments: 4,
  paymentMethods: [
    { name: 'Cash', value: 34, color: '#4CAF50' },
    { name: 'Card', value: 45, color: '#2196F3' },
    { name: 'Mpesa', value: 21, color: '#FF9800' }
  ],
  recentPayments: [
    { orderId: 'ORD-1234', amount: 345.00, time: '10:25 AM', method: 'Card', status: 'Completed' },
    { orderId: 'ORD-1235', amount: 180.50, time: '10:40 AM', method: 'Cash', status: 'Completed' },
    { orderId: 'ORD-1236', amount: 520.75, time: '11:15 AM', method: 'Mpesa', status: 'Pending' },
    { orderId: 'ORD-1237', amount: 95.25, time: '11:30 AM', method: 'Card', status: 'Completed' },
    { orderId: 'ORD-1238', amount: 210.00, time: '12:05 PM', method: 'Cash', status: 'Completed' }
  ]
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'Pending':
      return 'warning';
    default:
      return 'default';
  }
};

const KPICard = ({ icon, title, value, subtext }) => (
  <Card elevation={2} sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={1}>
        {icon}
        <Typography variant="h6" component="div" ml={1}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" fontWeight="bold">
        {value}
      </Typography>
      {subtext && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          {subtext}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const CashierDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Container maxWidth="xl">
      <Box py={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Cashier Dashboard
          </Typography>
          <Typography variant="h6">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard 
              icon={<AttachMoney fontSize="large" color="primary" />}
              title="Total Payments Today"
              value={`$${paymentData.totalPayments.toLocaleString()}`}
              subtext="From 87 orders"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <KPICard 
              icon={<Receipt fontSize="large" color="secondary" />}
              title="Orders Processed"
              value={paymentData.ordersProcessed}
              subtext="Today's transactions"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <KPICard 
              icon={<HourglassEmpty fontSize="large" sx={{ color: '#FF9800' }} />}
              title="Pending Payments"
              value={paymentData.pendingPayments}
              subtext="Awaiting confirmation"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <KPICard 
              icon={<CreditCard fontSize="large" sx={{ color: '#4CAF50' }} />}
              title="Payment Methods"
              value="3 Types"
              subtext="Cash, Card, Mpesa"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Payment Methods Chart */}
          <Grid item xs={12} md={5}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Method Usage
                </Typography>
                <Box height={300} display="flex" justifyContent="center" alignItems="center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentData.paymentMethods}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentData.paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Payments Table */}
          <Grid item xs={12} md={7}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Payments
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Payment Method</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paymentData.recentPayments.map((payment) => (
                        <TableRow key={payment.orderId} hover>
                          <TableCell component="th" scope="row">
                            {payment.orderId}
                          </TableCell>
                          <TableCell align="right">${payment.amount.toFixed(2)}</TableCell>
                          <TableCell>{payment.time}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>
                            <Chip 
                              label={payment.status} 
                              size="small" 
                              color={getStatusColor(payment.status)} 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Shortcuts/Actions */}
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<Visibility />}
          >
            View Orders
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Payments />}
          >
            Go to Payments
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CashierDashboard;