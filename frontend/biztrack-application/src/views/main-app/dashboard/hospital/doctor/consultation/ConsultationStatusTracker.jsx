import React from 'react';
import { Box, Stepper, Step, StepLabel, StepConnector, styled } from '@mui/material';
import { CheckCircle, Science, LocalHospital, Payment, AssignmentTurnedIn } from '@mui/icons-material';

const statusSteps = [
  { id: 'registered', label: 'Registered', icon: <AssignmentTurnedIn /> },
  { id: 'in_consultation', label: 'Consultation', icon: <LocalHospital /> },
  { id: 'awaiting_labs', label: 'Lab Tests', icon: <Science /> },
  { id: 'in_treatment', label: 'Treatment', icon: <LocalHospital /> },
  { id: 'awaiting_payment', label: 'Payment', icon: <Payment /> },
  { id: 'completed', label: 'Completed', icon: <CheckCircle /> }
];

const StatusConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: theme.palette.primary.main,
    borderTopWidth: 2,
    borderRadius: 1,
  },
}));

const ConsultationStatusTracker = ({ currentStatus }) => {
  const activeStep = statusSteps.findIndex(step => step.id === currentStatus);

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel
        connector={<StatusConnector />}
      >
        {statusSteps.map((step) => (
          <Step key={step.id}>
            <StepLabel 
              icon={step.icon}
              sx={{
                '& .MuiStepLabel-label': {
                  fontWeight: step.id === currentStatus ? 'bold' : 'normal',
                  color: step.id === currentStatus ? 'primary.main' : 'text.secondary'
                }
              }}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ConsultationStatusTracker;