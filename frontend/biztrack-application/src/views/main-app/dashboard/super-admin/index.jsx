import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  SupervisorAccount as AdminIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [businessData, setBusinessData] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  
  useEffect(() => {
    // Simulating API calls
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = () => {
    // Mocked data - would be replaced with actual API calls
    setBusinessData([
      { id: 1, name: 'Tech Solutions Inc.', revenue: 2450000, growth: 12.5, status: 'active', users: 145 },
      { id: 2, name: 'Marketing Experts LLC', revenue: 1850000, growth: -3.2, status: 'active', users: 87 },
      { id: 3, name: 'Retail Chain Co.', revenue: 3200000, growth: 8.7, status: 'active', users: 230 },
      { id: 4, name: 'Global Consulting', revenue: 5100000, growth: 15.3, status: 'active', users: 320 },
      { id: 5, name: 'Healthcare Solutions', revenue: 2750000, growth: 5.1, status: 'pending', users: 112 },
    ]);
    
    setAdminUsers([
      { id: 1, name: 'John Smith', email: 'john@example.com', role: 'ADMIN', business: 'Tech Solutions Inc.', lastActive: '2 hours ago' },
      { id: 2, name: 'Emma Wilson', email: 'emma@example.com', role: 'ADMIN', business: 'Marketing Experts LLC', lastActive: '1 day ago' },
      { id: 3, name: 'Robert Chen', email: 'robert@example.com', role: 'ADMIN', business: 'Retail Chain Co.', lastActive: '3 hours ago' },
      { id: 4, name: 'Sarah Taylor', email: 'sarah@example.com', role: 'ADMIN', business: 'Global Consulting', lastActive: '5 mins ago' },
    ]);
    
    setRecentAlerts([
      { id: 1, type: 'warning', message: 'Unusual login activity detected for Admin ID #12', time: '10 mins ago' },
      { id: 2, type: 'info', message: 'System update scheduled for tonight at 2:00 AM', time: '2 hours ago' },
      { id: 3, type: 'error', message: 'Failed integration with payment gateway for Business ID #5', time: '1 day ago' },
      { id: 4, type: 'success', message: 'New admin created for Healthcare Solutions', time: '3 days ago' },
    ]);
  };
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Chart data
  const revenueData = [
    { month: 'Jan', revenue: 4000000 },
    { month: 'Feb', revenue: 4200000 },
    { month: 'Mar', revenue: 3800000 },
    { month: 'Apr', revenue: 4500000 },
    { month: 'May', revenue: 5100000 },
    { month: 'Jun', revenue: 4800000 },
    { month: 'Jul', revenue: 5500000 },
  ];
  
  const userDistributionData = [
    { name: 'Tech Solutions', value: 145 },
    { name: 'Marketing Experts', value: 87 },
    { name: 'Retail Chain', value: 230 },
    { name: 'Global Consulting', value: 320 },
    { name: 'Healthcare Solutions', value: 112 },
  ];
  
  const businessGrowthData = [
    { name: 'Tech Solutions', growth: 12.5 },
    { name: 'Marketing Experts', growth: -3.2 },
    { name: 'Retail Chain', growth: 8.7 },
    { name: 'Global Consulting', growth: 15.3 },
    { name: 'Healthcare Solutions', growth: 5.1 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const totalRevenue = businessData.reduce((sum, business) => sum + business.revenue, 0);
  const totalUsers = businessData.reduce((sum, business) => sum + business.users, 0);
  const averageGrowth = businessData.length > 0 
    ? businessData.reduce((sum, business) => sum + business.growth, 0) / businessData.length 
    : 0;
  
  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Super Admin Dashboard
        </Typography>
        
        <Box className="flex items-center gap-4">
          <TextField
            placeholder="Search..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            className="bg-white"
          />
          
          <IconButton>
            <NotificationsIcon />
          </IconButton>
          
          <Box className="flex items-center gap-2">
            <Avatar className="bg-blue-600">SA</Avatar>
            <Typography variant="subtitle1">Super Admin</Typography>
            <IconButton onClick={handleMenuClick} size="small">
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>
      
      {/* KPI Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={3}>
          <Paper className="p-4 flex flex-col h-full" elevation={2}>
            <Box className="flex justify-between items-start mb-2">
              <Typography variant="subtitle2" color="textSecondary">
                Total Revenue
              </Typography>
              <PieChartIcon className="text-blue-500" />
            </Box>
            <Typography variant="h4" className="mb-1 font-bold">
              ${(totalRevenue / 1000000).toFixed(2)}M
            </Typography>
            <Box className="flex items-center">
              <Chip 
                icon={<TrendingUpIcon fontSize="small" />} 
                label="12.3% vs last month" 
                size="small" 
                className="bg-green-100 text-green-700"
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper className="p-4 flex flex-col h-full" elevation={2}>
            <Box className="flex justify-between items-start mb-2">
              <Typography variant="subtitle2" color="textSecondary">
                Total Businesses
              </Typography>
              <BusinessIcon className="text-purple-500" />
            </Box>
            <Typography variant="h4" className="mb-1 font-bold">
              {businessData.length}
            </Typography>
            <Box className="flex items-center">
              <Chip 
                icon={<AddIcon fontSize="small" />} 
                label="2 new this month" 
                size="small" 
                className="bg-purple-100 text-purple-700"
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper className="p-4 flex flex-col h-full" elevation={2}>
            <Box className="flex justify-between items-start mb-2">
              <Typography variant="subtitle2" color="textSecondary">
                Total Users
              </Typography>
              <AdminIcon className="text-amber-500" />
            </Box>
            <Typography variant="h4" className="mb-1 font-bold">
              {totalUsers}
            </Typography>
            <Box className="flex items-center">
              <Chip 
                icon={<TrendingUpIcon fontSize="small" />} 
                label="8.7% growth" 
                size="small" 
                className="bg-amber-100 text-amber-700"
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper className="p-4 flex flex-col h-full" elevation={2}>
            <Box className="flex justify-between items-start mb-2">
              <Typography variant="subtitle2" color="textSecondary">
                Average Growth
              </Typography>
              <BarChartIcon className="text-green-500" />
            </Box>
            <Typography variant="h4" className="mb-1 font-bold">
              {averageGrowth.toFixed(1)}%
            </Typography>
            <Box className="flex items-center">
              {averageGrowth > 0 ? (
                <Chip 
                  icon={<ArrowUpwardIcon fontSize="small" />} 
                  label="Positive growth" 
                  size="small" 
                  className="bg-green-100 text-green-700"
                />
              ) : (
                <Chip 
                  icon={<ArrowDownwardIcon fontSize="small" />} 
                  label="Negative growth" 
                  size="small" 
                  className="bg-red-100 text-red-700"
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts & Tables */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper className="p-4" elevation={2}>
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6">Revenue Trend</Typography>
              <Box>
                <Button variant="outlined" size="small" className="mr-2">
                  This Year
                </Button>
                <Button variant="text" size="small">
                  Export
                </Button>
              </Box>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value) => [`$${(value / 1000000).toFixed(2)}M`, 'Revenue']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* User Distribution */}
        <Grid item xs={12} md={4}>
          <Paper className="p-4" elevation={2}>
            <Typography variant="h6" className="mb-4">User Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} users`, 'User Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Business Growth */}
        <Grid item xs={12} md={6}>
          <Paper className="p-4" elevation={2}>
            <Typography variant="h6" className="mb-4">Business Growth Rate</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={businessGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, 'Growth Rate']} />
                <Bar dataKey="growth">
                  {businessGrowthData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.growth >= 0 ? '#10b981' : '#ef4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* System Alerts */}
        <Grid item xs={12} md={6}>
          <Paper className="p-4" elevation={2}>
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6">Recent System Alerts</Typography>
              <Button 
                variant="text" 
                size="small" 
                endIcon={<MoreVertIcon />}
              >
                View All
              </Button>
            </Box>
            <Box>
              {recentAlerts.map((alert) => (
                <Box key={alert.id} className="mb-3 pb-3 border-b border-gray-200 last:border-0">
                  <Box className="flex items-start">
                    {alert.type === 'warning' && (
                      <WarningIcon className="text-amber-500 mr-2" />
                    )}
                    {alert.type === 'info' && (
                      <InfoIcon className="text-blue-500 mr-2" />
                    )}
                    {alert.type === 'error' && (
                      <ErrorIcon className="text-red-500 mr-2" />
                    )}
                    {alert.type === 'success' && (
                      <CheckIcon className="text-green-500 mr-2" />
                    )}
                    <Box>
                      <Typography variant="body2">{alert.message}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {alert.time}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        
        {/* Businesses Table */}
        <Grid item xs={12}>
          <Paper className="p-4" elevation={2}>
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6">Managed Businesses</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
              >
                Add Business
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Business Name</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="right">Growth</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="right">Users</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {businessData.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell>
                        <Box className="flex items-center">
                          <Avatar className="mr-2 bg-indigo-100 text-indigo-600">
                            {business.name.charAt(0)}
                          </Avatar>
                          {business.name}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        ${(business.revenue / 1000).toFixed(0)}k
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          className={business.growth >= 0 ? 'text-green-600' : 'text-red-600'}
                        >
                          {business.growth >= 0 ? '+' : ''}{business.growth}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={business.status} 
                          size="small"
                          className={
                            business.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-amber-100 text-amber-700'
                          }
                        />
                      </TableCell>
                      <TableCell align="right">{business.users}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Admin Users */}
        <Grid item xs={12}>
          <Paper className="p-4" elevation={2}>
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6">Admin Users</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
              >
                Create Admin
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Business</TableCell>
                    <TableCell>Last Active</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adminUsers.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <Box className="flex items-center">
                          <Avatar className="mr-2">
                            {admin.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          {admin.name}
                        </Box>
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={admin.role} 
                          size="small"
                          className="bg-blue-100 text-blue-700"
                        />
                      </TableCell>
                      <TableCell>{admin.business}</TableCell>
                      <TableCell>{admin.lastActive}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Fix missing icons from imports
const InfoIcon = ({ className }) => {
  return <Typography className={className}>i</Typography>;
};

const ErrorIcon = ({ className }) => {
  return <Typography className={className}>!</Typography>;
};

export default SuperAdminDashboard;