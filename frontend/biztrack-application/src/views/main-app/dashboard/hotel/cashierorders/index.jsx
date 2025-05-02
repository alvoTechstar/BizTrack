import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Chip,
  Grid,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Payment as PaymentIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const CashierOrders = () => {
  // Sample data - in a real app, this would come from an API
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      table: 'Table 5',
      waiter: 'John Doe',
      total: 45.99,
      status: 'Pending',
      timePlaced: new Date('2023-05-15T12:30:00')
    },
    {
      id: 'ORD-002',
      table: 'Room 3',
      waiter: 'Jane Smith',
      total: 89.50,
      status: 'Served',
      timePlaced: new Date('2023-05-15T13:15:00')
    },
    {
      id: 'ORD-003',
      table: 'Table 2',
      waiter: 'Mike Johnson',
      total: 32.75,
      status: 'Pending',
      timePlaced: new Date('2023-05-15T14:00:00')
    },
    {
      id: 'ORD-004',
      table: 'Table 8',
      waiter: 'Sarah Williams',
      total: 120.25,
      status: 'Served',
      timePlaced: new Date('2023-05-15T14:45:00')
    },
  ]);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [tableFilter, setTableFilter] = useState('');

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesTable = tableFilter === '' || 
      order.table.toLowerCase().includes(tableFilter.toLowerCase());
    return matchesStatus && matchesTable;
  });

  // Handle order actions
  const handleViewDetails = (orderId) => {
    // In a real app, this would open a modal or navigate to a details page
    console.log(`View details for order ${orderId}`);
    alert(`Viewing details for order ${orderId}`);
  };

  const handleProceedToPayment = (orderId) => {
    // In a real app, this would navigate to a payment page
    console.log(`Proceed to payment for order ${orderId}`);
    alert(`Proceeding to payment for order ${orderId}`);
  };

  const handleCancelOrder = (orderId) => {
    // In a real app, this would call an API to cancel the order
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrders(orders.filter(order => order.id !== orderId));
      console.log(`Order ${orderId} cancelled`);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Open Orders
      </Typography>
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Order Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Order Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Served">Served</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Table/Room #"
              variant="outlined"
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Table/Room</TableCell>
              <TableCell>Waiter</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Time Placed</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.table}</TableCell>
                  <TableCell>{order.waiter}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={order.status === 'Served' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {format(order.timePlaced, 'MMM dd, yyyy - h:mm a')}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewDetails(order.id)}
                      title="View Order Details"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="success"
                      onClick={() => handleProceedToPayment(order.id)}
                      title="Proceed to Payment"
                      disabled={order.status !== 'Served'}
                    >
                      <PaymentIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleCancelOrder(order.id)}
                      title="Cancel Order"
                      disabled={order.status === 'Served'}
                    >
                      <CancelIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No orders found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CashierOrders;