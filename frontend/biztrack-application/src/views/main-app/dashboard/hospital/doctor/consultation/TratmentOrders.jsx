import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import { Add, Remove, LocalPharmacy, Vaccines, Healing } from '@mui/icons-material';

const TreatmentOrders = ({ orders, onAddOrder, onRemoveOrder }) => {
  const [newOrder, setNewOrder] = useState({
    type: 'medication',
    details: '',
    dosage: '',
    frequency: '',
    instructions: ''
  });

  const handleAddOrder = () => {
    onAddOrder(newOrder);
    setNewOrder({
      type: 'medication',
      details: '',
      dosage: '',
      frequency: '',
      instructions: ''
    });
  };

  const getOrderIcon = (type) => {
    switch(type) {
      case 'medication': return <LocalPharmacy fontSize="small" />;
      case 'injection': return <Vaccines fontSize="small" />;
      case 'procedure': return <Healing fontSize="small" />;
      default: return <LocalPharmacy fontSize="small" />;
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Treatment Orders
      </Typography>
      
      {/* Existing Orders */}
      {orders.map((order, index) => (
        <Box 
          key={index}
          sx={{
            p: 2,
            mb: 2,
            border: '1px solid #eee',
            borderRadius: 1,
            bgcolor: 'background.paper'
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              {getOrderIcon(order.type)}
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {order.type === 'medication' ? 'Medication' : 
                 order.type === 'injection' ? 'Injection' : 'Procedure'}
              </Typography>
              <Chip label={order.details} size="small" sx={{ ml: 2 }} />
            </Box>
            <IconButton onClick={() => onRemoveOrder(index)} size="small">
              <Remove />
            </IconButton>
          </Box>
          
          {order.type === 'medication' && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                <strong>Dosage:</strong> {order.dosage}
              </Typography>
              <Typography variant="body2">
                <strong>Frequency:</strong> {order.frequency}
              </Typography>
            </Box>
          )}
          {order.instructions && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Instructions:</strong> {order.instructions}
            </Typography>
          )}
        </Box>
      ))}
      
      {/* Add New Order */}
      <Box sx={{ 
        p: 2,
        border: '1px dashed #ccc',
        borderRadius: 1,
        bgcolor: 'background.paper'
      }}>
        <Typography variant="subtitle2" gutterBottom>
          Add New Treatment Order
        </Typography>
        
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Order Type</InputLabel>
          <Select
            value={newOrder.type}
            onChange={(e) => setNewOrder({...newOrder, type: e.target.value})}
            label="Order Type"
          >
            <MenuItem value="medication">Medication</MenuItem>
            <MenuItem value="injection">Injection</MenuItem>
            <MenuItem value="procedure">Procedure</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          label={newOrder.type === 'medication' ? 'Medication Name' : 
                newOrder.type === 'injection' ? 'Injection Type' : 'Procedure Name'}
          value={newOrder.details}
          onChange={(e) => setNewOrder({...newOrder, details: e.target.value})}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        
        {newOrder.type === 'medication' && (
          <>
            <TextField
              label="Dosage"
              value={newOrder.dosage}
              onChange={(e) => setNewOrder({...newOrder, dosage: e.target.value})}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Frequency"
              value={newOrder.frequency}
              onChange={(e) => setNewOrder({...newOrder, frequency: e.target.value})}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />
          </>
        )}
        
        <TextField
          label="Special Instructions"
          value={newOrder.instructions}
          onChange={(e) => setNewOrder({...newOrder, instructions: e.target.value})}
          fullWidth
          size="small"
          multiline
          rows={2}
        />
        
        <Button
          startIcon={<Add />}
          onClick={handleAddOrder}
          variant="outlined"
          sx={{ mt: 2 }}
          disabled={!newOrder.details}
        >
          Add Order
        </Button>
      </Box>
    </Box>
  );
};

export default TreatmentOrders;