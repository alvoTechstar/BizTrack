import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Typography, Box, IconButton, Modal, Tabs, Tab, Autocomplete,
  FormControl, InputLabel, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails,
  CircularProgress, Chip
} from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Close from '@mui/icons-material/Close';
import Science from '@mui/icons-material/Science';
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedIn';

const ConsultationPage = ({ 
  currentPatient, 
  finishConsultation, 
  onCancelConsultation, 
  mockLabTestOptions, 
  mockReferralDepartments 
}) => {
  // Form states
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescriptions, setPrescriptions] = useState([{ name: '', dosage: '', frequency: '' }]);
  const [requestedLabTests, setRequestedLabTests] = useState([]);
  const [referral, setReferral] = useState('');
  
  // UI states
  const [openFinishModal, setOpenFinishModal] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Workflow states
  const [consultationStatus, setConsultationStatus] = useState('in_progress'); // 'in_progress', 'awaiting_labs', 'completed'
  const [labResults, setLabResults] = useState([]);
  const [showLabResultsForm, setShowLabResultsForm] = useState(false);
  const [newLabResult, setNewLabResult] = useState({
    testName: '',
    value: '',
    unit: 'mg/dL',
    status: 'normal',
    notes: ''
  });

  useEffect(() => {
    // Reset form when patient changes
    setSymptoms('');
    setDiagnosis('');
    setPrescriptions([{ name: '', dosage: '', frequency: '' }]);
    setRequestedLabTests([]);
    setReferral('');
    setTabValue(0);
    setConsultationStatus('in_progress');
    setLabResults([]);
  }, [currentPatient]);

  if (!currentPatient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <Typography variant="h6" className="text-gray-600 mb-6">
            No patient selected for consultation.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onCancelConsultation}
            className="mt-4 rounded-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg transition-all transform hover:scale-105"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleAddPrescription = () => {
    setPrescriptions([...prescriptions, { name: '', dosage: '', frequency: '' }]);
  };

  const handleRemovePrescription = (index) => {
    const newPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(newPrescriptions);
  };

  const handlePrescriptionChange = (index, field, value) => {
    const newPrescriptions = prescriptions.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    setPrescriptions(newPrescriptions);
  };

  const handleSaveProgress = () => {
    // In a real app, you would save to backend/database here
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleFinishConsultation = () => {
    if (requestedLabTests.length > 0 && labResults.length < requestedLabTests.length) {
      setConsultationStatus('awaiting_labs');
    }
    setOpenFinishModal(true);
  };

  const confirmFinishConsultation = async () => {
    setIsSubmitting(true);
    try {
      await finishConsultation(currentPatient.id, {
        symptoms,
        diagnosis,
        prescriptions,
        requestedLabTests,
        referral,
        labResults,
        status: consultationStatus
      });
      setOpenFinishModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddLabResult = () => {
    if (newLabResult.testName && newLabResult.value) {
      setLabResults([...labResults, newLabResult]);
      setNewLabResult({
        testName: '',
        value: '',
        unit: 'mg/dL',
        status: 'normal',
        notes: ''
      });
      setShowLabResultsForm(false);
      
      // If we've received all requested tests, update status
      if (labResults.length + 1 >= requestedLabTests.length) {
        setConsultationStatus('in_progress');
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const LabResultsSection = () => (
    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
      <div className="flex justify-between items-center mb-3">
        <Typography variant="h6" className="text-blue-800 font-medium">
          Lab Test Results
        </Typography>
        {requestedLabTests.length > 0 && labResults.length < requestedLabTests.length && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={() => setShowLabResultsForm(true)}
            className="rounded-full"
          >
            Add Results
          </Button>
        )}
      </div>
      
      {showLabResultsForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
          <Typography variant="subtitle2" className="mb-3">Add New Lab Result</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth size="small">
              <InputLabel>Test Name</InputLabel>
              <Select
                value={newLabResult.testName}
                onChange={(e) => setNewLabResult({...newLabResult, testName: e.target.value})}
                label="Test Name"
              >
                {requestedLabTests
                  .filter(test => !labResults.some(r => r.testName === test))
                  .map((test, index) => (
                    <MenuItem key={index} value={test}>{test}</MenuItem>
                  ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Value"
              value={newLabResult.value}
              onChange={(e) => setNewLabResult({...newLabResult, value: e.target.value})}
              size="small"
            />
            
            <TextField
              label="Unit"
              value={newLabResult.unit}
              onChange={(e) => setNewLabResult({...newLabResult, unit: e.target.value})}
              size="small"
            />
            
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={newLabResult.status}
                onChange={(e) => setNewLabResult({...newLabResult, status: e.target.value})}
                label="Status"
              >
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="abnormal">Abnormal</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Notes"
              value={newLabResult.notes}
              onChange={(e) => setNewLabResult({...newLabResult, notes: e.target.value})}
              size="small"
              className="md:col-span-2"
              multiline
              rows={2}
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-3">
            <Button
              variant="outlined"
              onClick={() => setShowLabResultsForm(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddLabResult}
              className="rounded-full"
            >
              Add Result
            </Button>
          </div>
        </div>
      )}
      
      {labResults.length > 0 ? (
        <div className="space-y-3">
          {labResults.map((result, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center">
                <Typography className="font-medium">{result.testName}</Typography>
                <Chip 
                  label={result.status === 'normal' ? 'Normal' : 'Abnormal'} 
                  size="small"
                  color={result.status === 'normal' ? 'success' : 'error'}
                />
              </div>
              <Typography variant="body2" className="text-gray-600 mt-1">
                Result: {result.value} {result.unit}
              </Typography>
              {result.notes && (
                <Typography variant="body2" className="text-gray-600 mt-1">
                  Notes: {result.notes}
                </Typography>
              )}
              <div className="flex justify-end mt-2">
                <IconButton size="small" onClick={() => {
                  setLabResults(labResults.filter((_, i) => i !== index));
                }}>
                  <Remove fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      ) : requestedLabTests.length > 0 ? (
        <div className="text-center py-4">
          <Science className="text-gray-400 text-4xl mx-auto mb-2" />
          <Typography className="text-gray-600 mb-3">
            Waiting for {requestedLabTests.length} lab test result(s)...
          </Typography>
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {requestedLabTests.map((test, index) => (
              <Chip key={index} label={test} size="small" />
            ))}
          </div>
        </div>
      ) : (
        <Typography className="text-gray-500 italic text-center py-4">
          No lab tests requested
        </Typography>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Patient Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-2xl shadow-xl mb-8">
        <Typography variant="h4" className="font-bold mb-2 text-white">
          Consultation Session
        </Typography>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <Typography variant="h5" className="mb-1 font-semibold">
              {currentPatient.name}
            </Typography>
            <Typography variant="body1" className="opacity-90">
              Age: {currentPatient.age} | Gender: {currentPatient.gender} | Queue No: {currentPatient.queueNo}
            </Typography>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-block bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium shadow-md">
              {consultationStatus === 'awaiting_labs' ? 'Awaiting Lab Results' : 'Active Consultation'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs for larger screens */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="consultation tabs" 
          className="mb-6 rounded-lg bg-white shadow-md"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#7c3aed',
              height: '4px',
              borderRadius: '4px 4px 0 0'
            }
          }}
        >
          <Tab label="Symptoms & Notes" className={`${tabValue === 0 ? 'text-purple-600 font-medium' : 'text-gray-600'}`} />
          <Tab label="Diagnosis" className={`${tabValue === 1 ? 'text-purple-600 font-medium' : 'text-gray-600'}`} />
          <Tab label="Prescriptions" className={`${tabValue === 2 ? 'text-purple-600 font-medium' : 'text-gray-600'}`} />
          <Tab label="Lab Tests" className={`${tabValue === 3 ? 'text-purple-600 font-medium' : 'text-gray-600'}`} />
          <Tab label="Referrals" className={`${tabValue === 4 ? 'text-purple-600 font-medium' : 'text-gray-600'}`} />
        </Tabs>
        
        <Box className="p-6 rounded-2xl bg-white shadow-lg">
          {tabValue === 0 && (
            <div className="space-y-4">
              <Typography variant="h6" className="text-gray-700 font-medium">
                Record Patient Symptoms
              </Typography>
              <TextField
                label="Symptoms & Clinical Notes"
                multiline
                rows={8}
                fullWidth
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                variant="outlined"
                className="mb-4"
                margin="normal"
                InputProps={{
                  className: 'rounded-lg border-gray-300 focus:border-purple-500'
                }}
              />
              <div className="flex justify-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setTabValue(1)}
                  className="rounded-full py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md"
                >
                  Next: Diagnosis
                </Button>
              </div>
            </div>
          )}
          
          {tabValue === 1 && (
            <div className="space-y-4">
              <Typography variant="h6" className="text-gray-700 font-medium">
                Enter Diagnosis
              </Typography>
              <TextField
                label="Diagnosis"
                fullWidth
                multiline
                rows={4}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                variant="outlined"
                className="mb-4"
                margin="normal"
                InputProps={{
                  className: 'rounded-lg border-gray-300 focus:border-purple-500'
                }}
              />
              <div className="flex justify-between">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setTabValue(0)}
                  className="rounded-full py-2 px-6 border-gray-300 hover:border-purple-500"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setTabValue(2)}
                  className="rounded-full py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md"
                >
                  Next: Prescriptions
                </Button>
              </div>
            </div>
          )}
          
          {tabValue === 2 && (
            <div className="space-y-6">
              <Typography variant="h6" className="text-gray-700 font-medium">
                Prescription Management
              </Typography>
              {prescriptions.map((p, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 mb-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <TextField
                    label="Medication Name"
                    value={p.name}
                    onChange={(e) => handlePrescriptionChange(index, 'name', e.target.value)}
                    variant="outlined"
                    className="flex-1"
                    InputProps={{
                      className: 'rounded-lg bg-white'
                    }}
                  />
                  <TextField
                    label="Dosage"
                    value={p.dosage}
                    onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                    variant="outlined"
                    className="flex-1"
                    InputProps={{
                      className: 'rounded-lg bg-white'
                    }}
                  />
                  <TextField
                    label="Frequency"
                    value={p.frequency}
                    onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                    variant="outlined"
                    className="flex-1"
                    InputProps={{
                      className: 'rounded-lg bg-white'
                    }}
                  />
                  {prescriptions.length > 1 && (
                    <IconButton 
                      onClick={() => handleRemovePrescription(index)} 
                      color="error" 
                      className="shadow-md rounded-full bg-red-50 hover:bg-red-100"
                    >
                      <Remove className="text-red-500" />
                    </IconButton>
                  )}
                </div>
              ))}
              <div className="flex justify-between items-center">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Add />}
                  onClick={handleAddPrescription}
                  className="rounded-full py-2 px-4 border-purple-500 text-purple-600 hover:border-purple-600 hover:text-purple-700"
                >
                  Add Medication
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setTabValue(3)}
                  className="rounded-full py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md"
                >
                  Next: Lab Tests
                </Button>
              </div>
            </div>
          )}
          
          {tabValue === 3 && (
            <div className="space-y-6">
              <Typography variant="h6" className="text-gray-700 font-medium">
                Laboratory Test Requests
              </Typography>
              <Autocomplete
                multiple
                options={mockLabTestOptions}
                getOptionLabel={(option) => option}
                value={requestedLabTests}
                onChange={(event, newValue) => {
                  setRequestedLabTests(newValue);
                  if (consultationStatus === 'awaiting_labs') {
                    setConsultationStatus('in_progress');
                  }
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Select Lab Tests" 
                    variant="outlined" 
                    margin="normal"
                    InputProps={{
                      ...params.InputProps,
                      className: 'rounded-lg bg-white'
                    }}
                  />
                )}
                className="mb-4"
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <div 
                      key={index}
                      {...getTagProps({ index })}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {option}
                    </div>
                  ))
                }
              />
              <LabResultsSection />
              <div className="flex justify-between">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setTabValue(2)}
                  className="rounded-full py-2 px-6 border-gray-300 hover:border-purple-500"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setTabValue(4)}
                  className="rounded-full py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md"
                >
                  Next: Referrals
                </Button>
              </div>
            </div>
          )}
          
          {tabValue === 4 && (
            <div className="space-y-6">
              <Typography variant="h6" className="text-gray-700 font-medium">
                Referral to Department
              </Typography>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel className="text-gray-600">Referral Department</InputLabel>
                <Select
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                  label="Referral Department"
                  className="rounded-lg bg-white"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {mockReferralDepartments.map((dept, index) => (
                    <MenuItem key={index} value={dept} className="hover:bg-purple-50">
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="flex justify-between">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setTabValue(3)}
                  className="rounded-full py-2 px-6 border-gray-300 hover:border-purple-500"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFinishConsultation}
                  className="rounded-full py-2 px-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-md"
                >
                  Complete Consultation
                </Button>
              </div>
            </div>
          )}
        </Box>
      </Box>

      {/* Accordions for mobile screens */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Accordion className="rounded-xl shadow-md mb-4 overflow-hidden" defaultExpanded>
          <AccordionSummary 
            expandIcon={<ExpandMore className="text-purple-600" />}
            className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100"
          >
            <Typography className="font-semibold text-purple-700">Symptoms & Notes</Typography>
          </AccordionSummary>
          <AccordionDetails className="bg-white">
            <TextField
              label="Symptoms & Clinical Notes"
              multiline
              rows={6}
              fullWidth
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              variant="outlined"
              margin="normal"
              InputProps={{
                className: 'rounded-lg border-gray-300 focus:border-purple-500'
              }}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion className="rounded-xl shadow-md mb-4 overflow-hidden">
          <AccordionSummary 
            expandIcon={<ExpandMore className="text-purple-600" />}
            className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100"
          >
            <Typography className="font-semibold text-purple-700">Diagnosis</Typography>
          </AccordionSummary>
          <AccordionDetails className="bg-white">
            <TextField
              label="Diagnosis"
              fullWidth
              multiline
              rows={4}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              variant="outlined"
              margin="normal"
              InputProps={{
                className: 'rounded-lg border-gray-300 focus:border-purple-500'
              }}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion className="rounded-xl shadow-md mb-4 overflow-hidden">
          <AccordionSummary 
            expandIcon={<ExpandMore className="text-purple-600" />}
            className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100"
          >
            <Typography className="font-semibold text-purple-700">Prescriptions</Typography>
          </AccordionSummary>
          <AccordionDetails className="bg-white space-y-4">
            {prescriptions.map((p, index) => (
              <div key={index} className="flex flex-col gap-4 mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <TextField
                  label="Medication Name"
                  value={p.name}
                  onChange={(e) => handlePrescriptionChange(index, 'name', e.target.value)}
                  variant="outlined"
                  InputProps={{
                    className: 'rounded-lg bg-white'
                  }}
                />
                <TextField
                  label="Dosage"
                  value={p.dosage}
                  onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                  variant="outlined"
                  InputProps={{
                    className: 'rounded-lg bg-white'
                  }}
                />
                <TextField
                  label="Frequency"
                  value={p.frequency}
                  onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                  variant="outlined"
                  InputProps={{
                    className: 'rounded-lg bg-white'
                  }}
                />
                {prescriptions.length > 1 && (
                  <Button 
                    onClick={() => handleRemovePrescription(index)} 
                    startIcon={<Remove />} 
                    color="error" 
                    variant="outlined" 
                    className="mt-2 rounded-full border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50"
                  >
                    Remove Medication
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddPrescription}
              className="rounded-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md"
            >
              Add Prescription
            </Button>
          </AccordionDetails>
        </Accordion>

        <Accordion className="rounded-xl shadow-md mb-4 overflow-hidden">
          <AccordionSummary 
            expandIcon={<ExpandMore className="text-purple-600" />}
            className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100"
          >
            <Typography className="font-semibold text-purple-700">Lab Tests</Typography>
          </AccordionSummary>
          <AccordionDetails className="bg-white space-y-4">
            <Autocomplete
              multiple
              options={mockLabTestOptions}
              getOptionLabel={(option) => option}
              value={requestedLabTests}
              onChange={(event, newValue) => {
                setRequestedLabTests(newValue);
                if (consultationStatus === 'awaiting_labs') {
                  setConsultationStatus('in_progress');
                }
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Select Lab Tests" 
                  variant="outlined" 
                  margin="normal"
                  InputProps={{
                    ...params.InputProps,
                    className: 'rounded-lg bg-white'
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <div 
                    key={index}
                    {...getTagProps({ index })}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {option}
                  </div>
                ))
              }
            />
            
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex justify-between items-center mb-3">
                <Typography variant="subtitle2" className="text-blue-800 font-medium">
                  Lab Test Results
                </Typography>
                {requestedLabTests.length > 0 && labResults.length < requestedLabTests.length && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => setShowLabResultsForm(true)}
                    className="rounded-full"
                  >
                    Add Results
                  </Button>
                )}
              </div>
              
              {labResults.length > 0 ? (
                <div className="space-y-3">
                  {labResults.map((result, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center">
                        <Typography className="font-medium">{result.testName}</Typography>
                        <Chip 
                          label={result.status === 'normal' ? 'Normal' : 'Abnormal'} 
                          size="small"
                          color={result.status === 'normal' ? 'success' : 'error'}
                        />
                      </div>
                      <Typography variant="body2" className="text-gray-600 mt-1">
                        Result: {result.value} {result.unit}
                      </Typography>
                    </div>
                  ))}
                </div>
              ) : requestedLabTests.length > 0 ? (
                <div className="text-center py-2">
                  <Typography className="text-gray-600">
                    {requestedLabTests.length} test(s) pending
                  </Typography>
                </div>
              ) : (
                <Typography className="text-gray-500 italic text-center py-2">
                  No lab tests requested
                </Typography>
              )}
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion className="rounded-xl shadow-md mb-4 overflow-hidden">
          <AccordionSummary 
            expandIcon={<ExpandMore className="text-purple-600" />}
            className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100"
          >
            <Typography className="font-semibold text-purple-700">Referrals</Typography>
          </AccordionSummary>
          <AccordionDetails className="bg-white">
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel className="text-gray-600">Referral Department</InputLabel>
              <Select
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
                label="Referral Department"
                className="rounded-lg bg-white"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {mockReferralDepartments.map((dept, index) => (
                  <MenuItem key={index} value={dept} className="hover:bg-purple-50">
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            variant="outlined"
            onClick={handleSaveProgress}
            className="py-3 px-6 text-lg rounded-full border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-700"
          >
            {isSaved ? (
              <span className="flex items-center">
                <AssignmentTurnedIn className="mr-2 text-green-500" />
                Saved!
              </span>
            ) : 'Save Progress'}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={handleFinishConsultation}
            disabled={isSubmitting}
            className="py-3 px-8 text-lg rounded-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            {consultationStatus === 'awaiting_labs' ? 'Complete with Lab Results' : 'Finish Consultation'}
            {isSubmitting && <CircularProgress size={24} className="ml-2 text-white" />}
          </Button>
        </div>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancelConsultation}
          startIcon={<Close />}
          className="py-3 px-8 text-lg rounded-full border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          Cancel
        </Button>
      </div>

      {/* Finish Consultation Modal */}
      <Modal
        open={openFinishModal}
        onClose={() => setOpenFinishModal(false)}
        className="flex items-center justify-center p-4"
      >
        <Box className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full mx-auto border-4 border-purple-100">
          {consultationStatus === 'awaiting_labs' ? (
            <>
              <div className="text-center mb-4">
                <Science className="text-blue-500 text-5xl mx-auto" />
              </div>
              <Typography variant="h6" className="mb-4 text-center font-bold text-gray-800">
                Awaiting Lab Results
              </Typography>
              <Typography className="text-gray-700 mb-6 text-center">
                You've requested {requestedLabTests.length} lab test(s). The consultation will be marked as pending until results are received.
              </Typography>
              <div className="space-y-3 mb-6">
                {requestedLabTests.map((test, index) => (
                  <div key={index} className="bg-blue-50 p-2 rounded-lg flex items-center">
                    <div className="bg-blue-100 p-1 rounded-full mr-3">
                      <CheckCircle className="text-blue-500 text-lg" />
                    </div>
                    <Typography>{test}</Typography>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  variant="outlined"
                  onClick={() => setOpenFinishModal(false)}
                  className="rounded-full py-2 px-6 border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-700"
                >
                  Continue Editing
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={confirmFinishConsultation}
                  disabled={isSubmitting}
                  className="rounded-full py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Pending Status'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-4">
                <CheckCircle className="text-green-500 text-5xl mx-auto" />
              </div>
              <Typography variant="h6" className="mb-4 text-center font-bold text-gray-800">
                Confirm Consultation Completion
              </Typography>
              <Typography className="text-gray-700 mb-6 text-center">
                You're about to complete the consultation for <span className="font-semibold text-purple-700">{currentPatient.name}</span>.
              </Typography>
              {labResults.length > 0 && (
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <Typography className="text-green-800 font-medium text-center">
                    {labResults.length} lab result(s) included
                  </Typography>
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  variant="outlined"
                  onClick={() => setOpenFinishModal(false)}
                  className="rounded-full py-2 px-6 border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-700"
                >
                  Review Details
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={confirmFinishConsultation}
                  disabled={isSubmitting}
                  startIcon={<CheckCircle />}
                  className="rounded-full py-2 px-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-md"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Completion'}
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>

      {/* Lab Results Form Modal (for mobile) */}
      <Modal
        open={showLabResultsForm}
        onClose={() => setShowLabResultsForm(false)}
        className="flex items-center justify-center p-4"
      >
        <Box className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full mx-auto">
          <Typography variant="h6" className="mb-4">
            Add Lab Test Result
          </Typography>
          <div className="space-y-4">
            <FormControl fullWidth>
              <InputLabel>Test Name</InputLabel>
              <Select
                value={newLabResult.testName}
                onChange={(e) => setNewLabResult({...newLabResult, testName: e.target.value})}
                label="Test Name"
              >
                {requestedLabTests
                  .filter(test => !labResults.some(r => r.testName === test))
                  .map((test, index) => (
                    <MenuItem key={index} value={test}>{test}</MenuItem>
                  ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Value"
              value={newLabResult.value}
              onChange={(e) => setNewLabResult({...newLabResult, value: e.target.value})}
              fullWidth
            />
            
            <TextField
              label="Unit"
              value={newLabResult.unit}
              onChange={(e) => setNewLabResult({...newLabResult, unit: e.target.value})}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newLabResult.status}
                onChange={(e) => setNewLabResult({...newLabResult, status: e.target.value})}
                label="Status"
              >
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="abnormal">Abnormal</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Notes"
              value={newLabResult.notes}
              onChange={(e) => setNewLabResult({...newLabResult, notes: e.target.value})}
              fullWidth
              multiline
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outlined"
              onClick={() => setShowLabResultsForm(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddLabResult}
              className="rounded-full"
            >
              Add Result
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ConsultationPage;