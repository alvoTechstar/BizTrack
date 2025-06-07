import React, { useState } from "react";
import { Paper, Stepper, Step, StepLabel, Typography, Box } from "@mui/material";

import CreateBusiness from "./CreateBusiness";
import CreateAdmin from "./CreateAdmin";

const steps = ["Create Business", "Create Admin"];

export default function CreateBusinessFlow({ onCreate }) {
  const [activeStep, setActiveStep] = useState(0);
  const [businessData, setBusinessData] = useState(null);

  const handleNext = (stepData) => {
    if (activeStep === 0) {
      // Generate a businessId if not provided
      const bizId = stepData.businessId || `BIZ-${Date.now()}`;
      const bizWithId = { ...stepData, businessId: bizId };
      setBusinessData(bizWithId);
      setActiveStep(1);
    } else {
      // Step 2: create admin, build admin with business info
      const newAdmin = {
        ...stepData,
        businessName: businessData.businessName,
        associatedBusinessId: businessData.businessId,
        role: `${businessData.businessType}_ADMIN`,
      };

      onCreate?.(businessData, newAdmin); // Pass up to parent
    }
  };

  const handleBack = () => setActiveStep(0);

  const content =
    activeStep === 0 ? (
      <CreateBusiness onNext={handleNext} initialData={businessData} />
    ) : (
      <CreateAdmin
        onNext={handleNext}
        onBack={handleBack}
        businessData={businessData}
      />
    );

  return (
    <>
      <Typography variant="h5" align="center" gutterBottom>
        {steps[activeStep]}
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box>{content}</Box>
    </>
  );
}
