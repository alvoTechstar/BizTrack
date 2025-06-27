import React from 'react';
import { Button, ButtonGroup, Box, Typography } from '@mui/material';
import {
  LocalPharmacy,
  Science,
  MedicalServices,
  TransferWithinAStation,
  CheckCircle
} from '@mui/icons-material';

const WorkflowActions = ({ 
  currentStatus, 
  onPrescribeOnly, 
  onRequestLabs,
  onSendToNurse,
  onReferToSpecialist,
  onCompleteConsultation,
  onContinueAfterLabs
}) => {
  const getActionsForStatus = () => {
    switch(currentStatus) {
      case 'in_consultation':
        return (
          <>
            <Button 
              startIcon={<LocalPharmacy />}
              onClick={onPrescribeOnly}
              variant="contained"
              color="primary"
            >
              Prescribe Only
            </Button>
            <Button 
              startIcon={<Science />}
              onClick={onRequestLabs}
              variant="contained"
              color="secondary"
            >
              Request Lab Tests
            </Button>
            <Button 
              startIcon={<MedicalServices />}
              onClick={onSendToNurse}
              variant="contained"
            >
              Send to Nurse
            </Button>
            <Button 
              startIcon={<TransferWithinAStation />}
              onClick={onReferToSpecialist}
              variant="outlined"
            >
              Refer to Specialist
            </Button>
          </>
        );
      case 'awaiting_labs':
        return (
          <Typography variant="body1" color="textSecondary">
            Waiting for lab results...
          </Typography>
        );
      case 'labs_completed':
        return (
          <>
            <Button 
              onClick={onContinueAfterLabs}
              variant="contained"
              color="primary"
            >
              Continue Consultation
            </Button>
            <Button 
              startIcon={<LocalPharmacy />}
              onClick={onPrescribeOnly}
              variant="contained"
            >
              Prescribe Medication
            </Button>
          </>
        );
      case 'in_treatment':
        return (
          <Button 
            startIcon={<CheckCircle />}
            onClick={onCompleteConsultation}
            variant="contained"
            color="success"
          >
            Complete Treatment
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: 2,
      p: 2,
      border: '1px solid #eee',
      borderRadius: 2,
      bgcolor: 'background.paper'
    }}>
      <Typography variant="h6" gutterBottom>
        Next Actions
      </Typography>
      <ButtonGroup
        orientation="vertical"
        variant="contained"
        sx={{ gap: 1 }}
        fullWidth
      >
        {getActionsForStatus()}
      </ButtonGroup>
    </Box>
  );
};

export default WorkflowActions;