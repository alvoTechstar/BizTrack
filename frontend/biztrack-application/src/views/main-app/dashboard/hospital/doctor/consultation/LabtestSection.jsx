import React, { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Add, Science, CheckCircle, Cancel } from "@mui/icons-material";

const LabTestsSection = ({ labTests, onAddTest, onCompleteLabs }) => {
  const [newTest, setNewTest] = useState({
    name: "",
    status: "pending",
    notes: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTest = () => {
    onAddTest(newTest);
    setNewTest({ name: "", status: "pending", notes: "" });
    setShowAddForm(false);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Laboratory Tests
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Test Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {labTests.map((test, index) => (
              <TableRow key={index}>
                <TableCell>{test.name}</TableCell>
                <TableCell>
                  <Chip
                    label={test.status}
                    color={
                      test.status === "completed"
                        ? "success"
                        : test.status === "pending"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{test.notes}</TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Cancel fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showAddForm ? (
        <Box
          sx={{
            p: 2,
            border: "1px solid #eee",
            borderRadius: 1,
            bgcolor: "background.paper",
            mb: 2,
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Add New Lab Test
          </Typography>

          <TextField
            label="Test Name"
            value={newTest.name}
            onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newTest.status}
              onChange={(e) =>
                setNewTest({ ...newTest, status: e.target.value })
              }
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Notes"
            value={newTest.notes}
            onChange={(e) => setNewTest({ ...newTest, notes: e.target.value })}
            fullWidth
            size="small"
            multiline
            rows={2}
          />

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}
          >
            <Button variant="outlined" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddTest}
              disabled={!newTest.name}
            >
              Add Test
            </Button>
          </Box>
        </Box>
      ) : (
        <Button
          startIcon={<Add />}
          onClick={() => setShowAddForm(true)}
          variant="outlined"
        >
          Add Lab Test
        </Button>
      )}

      {labTests.length > 0 && (
        <Button
          startIcon={<CheckCircle />}
          onClick={onCompleteLabs}
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
        >
          Mark All Tests Completed
        </Button>
      )}
    </Box>
  );
};

export default LabTestsSection;
