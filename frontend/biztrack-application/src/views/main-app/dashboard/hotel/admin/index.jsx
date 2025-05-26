import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Button,
  Stack,
  Avatar,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  Warning as WarningIcon,
  Menu as MenuIcon,
  BarChart as BarChartIcon,
  PersonAdd as PersonAddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Sample data
const revenueData = [
  { name: 'Mon', value: 4200 },
  { name: 'Tue', value: 3800 },
  { name: 'Wed', value: 5100 },
  { name: 'Thu', value: 4700 },
  { name: 'Fri', value: 6200 },
  { name: 'Sat', value: 7800 },
  { name: 'Sun', value: 7200 },
];

const ordersByCategoryData = [
  { name: 'Food', value: 67 },
  { name: 'Beverage', value: 33 },
];

const COLORS = ['#0088FE', '#00C49F'];

const recentOrders = [
  { id: 'ORD-5678', waiter: 'John Smith', amount: '$124.50', time: '12:45 PM', status: 'Completed' },
  { id: 'ORD-5677', waiter: 'Sarah Lee', amount: '$78.25', time: '12:30 PM', status: 'In Progress' },
  { id: 'ORD-5676', waiter: 'Mike Chen', amount: '$95.00', time: '12:15 PM', status: 'Completed' },
  { id: 'ORD-5675', waiter: 'Lisa Johnson', amount: '$43.75', time: '11:50 AM', status: 'Completed' },
  { id: 'ORD-5674', waiter: 'Robert Davis', amount: '$112.80', time: '11:30 AM', status: 'Completed' },
];

// KPI Card Component
const KpiCard = ({ icon, title, value, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

function HotelAdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Hotel Overview
        </Typography>
        <Box>
          <Typography variant="subtitle1">
            {formatDate(currentTime)}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Last updated: {currentTime.toLocaleTimeString()}
          </Typography>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <KpiCard 
            icon={<ShoppingCartIcon />} 
            title="Total Orders Today" 
            value="142" 
            color="#3f51b5" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <KpiCard 
            icon={<AttachMoneyIcon />} 
            title="Total Revenue Today" 
            value="$8,245" 
            color="#f44336" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <KpiCard 
            icon={<PeopleIcon />} 
            title="Active Staff" 
            value="18" 
            color="#4caf50" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <KpiCard 
            icon={<RestaurantIcon />} 
            title="Menu Items Available" 
            value="84" 
            color="#ff9800" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <KpiCard 
            icon={<WarningIcon />} 
            title="Low Stock Alerts" 
            value="5" 
            color="#e91e63" 
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Revenue (Last 7 Days)</Typography>
              <IconButton size="small">
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" name="Revenue" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Orders by Category</Typography>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box display="flex" justifyContent="center" height={300} alignItems="center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={ordersByCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {ordersByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Orders']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders and Quick Links */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Recent Orders</Typography>
              <Button variant="text" size="small">View All</Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Waiter</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.waiter}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>{order.time}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={order.status === 'Completed' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Quick Links</Typography>
            <Stack spacing={2}>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<MenuIcon />}
                sx={{ justifyContent: 'flex-start', py: 1 }}
              >
                Manage Menu
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<BarChartIcon />}
                sx={{ justifyContent: 'flex-start', py: 1 }}
              >
                View Sales
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<PersonAddIcon />}
                sx={{ justifyContent: 'flex-start', py: 1 }}
              >
                Add Staff
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<WarningIcon />}
                sx={{ justifyContent: 'flex-start', py: 1 }}
              >
                Manage Inventory
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default HotelAdminDashboard;