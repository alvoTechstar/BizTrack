import React, { useState } from "react";
import CreateBusiness from "./CreateBusiness";
import CreateAdmin from "./CreateAdmin";

const CreateBusinessFlow = ({ onCreate }) => {
  const [step, setStep] = useState(1);
  const [businessData, setBusinessData] = useState(null);

  const handleNextStep = (data) => {
    setBusinessData(data);
    setStep(2);
  };

  const handleCreateAdminAndBusiness = (adminData) => {
    onCreate(businessData, adminData);
  };

  const handleGoBack = () => {
    setStep(1);
  };

  return (
    <>
      {step === 1 && (
        <CreateBusiness onNext={handleNextStep} />
      )}
      {step === 2 && (
        <CreateAdmin
          businessData={businessData}
          onBack={handleGoBack}
          onNext={handleCreateAdminAndBusiness}
        />
      )}
    </>
  );
};

export default CreateBusinessFlow;