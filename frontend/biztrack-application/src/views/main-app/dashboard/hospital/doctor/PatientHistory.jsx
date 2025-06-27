import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';

const PatientHistory = ({ patientHistory, onGoToDashboard }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReason, setFilterReason] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const availableReasons = [...new Set(patientHistory.map(h => h.reason))];

  const filteredHistory = patientHistory.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.prescriptions.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesReason = filterReason ? record.reason === filterReason : true;
    const matchesDate = filterDate ? record.date === filterDate : true;

    return matchesSearch && matchesReason && matchesDate;
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Patient Consultation History</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <TextField
          label="Search by Name/Diagnosis/Medication"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-lg bg-white shadow-sm"
        />
        <FormControl fullWidth variant="outlined" className="rounded-lg bg-white shadow-sm">
          <InputLabel>Filter by Visit Reason</InputLabel>
          <Select
            value={filterReason}
            onChange={(e) => setFilterReason(e.target.value)}
            label="Filter by Visit Reason"
          >
            <MenuItem value=""><em>All Reasons</em></MenuItem>
            {availableReasons.map((reason, index) => (
              <MenuItem key={index} value={reason}>{reason}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Filter by Date"
          type="date"
          variant="outlined"
          fullWidth
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          className="rounded-lg bg-white shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((record) => (
            <Card key={record.id} className="rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardContent>
                <Typography variant="h6" className="font-semibold text-blue-600 mb-2">
                  {record.name} - {record.date}
                </Typography>
                <Typography variant="body2" className="text-gray-700 mb-2">
                  <span className="font-medium">Reason:</span> {record.reason}
                </Typography>
                <Typography variant="body2" className="text-gray-700 mb-2">
                  <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                </Typography>
                <div className="mb-2">
                  <Typography variant="subtitle2" className="font-medium text-gray-800">Prescriptions:</Typography>
                  {record.prescriptions.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {record.prescriptions.map((p, pIdx) => (
                        <li key={pIdx}>{p.name} ({p.dosage}, {p.frequency})</li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body2" className="text-sm text-gray-500 italic">No prescriptions recorded.</Typography>
                  )}
                </div>
                <div>
                  <Typography variant="subtitle2" className="font-medium text-gray-800">Lab Results:</Typography>
                  {record.labResults.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {record.labResults.map((lr, lrIdx) => (
                        <li key={lrIdx}>{lr}</li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body2" className="text-sm text-gray-500 italic">No lab results recorded.</Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            <Typography variant="h6">No matching consultation records found.</Typography>
            <Typography variant="body1">Try adjusting your search or filters.</Typography>
          </div>
        )}
      </div>
      <Box className="flex justify-center mt-6">
        <Button
          variant="outlined"
          color="primary"
          onClick={onGoToDashboard}
          startIcon={<DashboardIcon />}
          className="rounded-lg"
        >
          Back to Dashboard
        </Button>
      </Box>
    </div>
  );
};

export default PatientHistory;