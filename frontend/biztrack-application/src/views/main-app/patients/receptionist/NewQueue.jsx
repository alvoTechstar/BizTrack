import React, { useState } from "react";
import {
  Paper,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Collapse,
} from "@mui/material"; // Removed Modal and Box imports
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import {
  SEARCH_BY_PHONE,
  SEARCH_BY_ID,
  STATUS_OPTIONS,
  VISIT_TYPES_QUEUE,
} from "./Constants";

import TextInput from "../../../../components/Input/TextInput";
import AppFormButton from "../../../../components/buttons/AppFormButton";
import SelectInput from "../../../../components/input/SelectInput";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import NaviButton from "../../../../components/buttons/Navibutton";

// Define UI states
const UI_STATE = {
  SEARCH: "search",
  RESULTS: "results",
  NOT_FOUND: "notFound",
};

const NewQueue = ({
  isOpen,
  onClose,
  patients, // This prop should ideally always be an array, even if empty
  queue,
  onAddExistingPatientToQueue,
  onOpenRegisterModal,
}) => {
  const [searchType, setSearchType] = useState(SEARCH_BY_PHONE);
  const [searchValue, setSearchValue] = useState("");
  const [foundPatient, setFoundPatient] = useState(null);
  const [errorPanelMessage, setErrorPanelMessage] = useState("");
  const [selectedVisitTypePanel, setSelectedVisitTypePanel] = useState(
    VISIT_TYPES_QUEUE[0]
  );
  const [uiState, setUiState] = useState(UI_STATE.SEARCH);

  const handleSearchPatient = () => {
    setErrorPanelMessage("");
    setFoundPatient(null);
    setUiState(UI_STATE.SEARCH);

    if (!searchValue.trim()) {
      setErrorPanelMessage("Please enter a search value.");
      return;
    }

    if (!Array.isArray(patients)) {
      console.error(
        "NewQueue: 'patients' prop is not an array or is null/undefined. Received:",
        patients
      );
      setErrorPanelMessage(
        "An internal error occurred. Patient data is currently unavailable."
      );
      return;
    }

    const patient = patients.find((p) =>
      searchType === SEARCH_BY_PHONE
        ? p.phoneNumber === searchValue.trim()
        : p.nationalId === searchValue.trim()
    );

    if (patient) {
      const inActiveQueue = queue.find(
        (q) =>
          q.patientId === patient.id &&
          q.status !== STATUS_OPTIONS.DONE &&
          q.status !== STATUS_OPTIONS.CANCELLED
      );
      if (inActiveQueue) {
        setErrorPanelMessage(
          `Patient ${patient.fullName} is already in the queue (Status: ${inActiveQueue.status}).`
        );
        setFoundPatient(null);
        setUiState(UI_STATE.SEARCH);
        return;
      }
      setFoundPatient(patient);
      setUiState(UI_STATE.RESULTS);
    } else {
      setUiState(UI_STATE.NOT_FOUND);
    }
  };

  const handleAddPatient = () => {
    if (foundPatient && selectedVisitTypePanel) {
      onAddExistingPatientToQueue(foundPatient, selectedVisitTypePanel);
      resetPanelState();
    }
  };

  const resetPanelState = () => {
    setSearchValue("");
    setFoundPatient(null);
    setSelectedVisitTypePanel(VISIT_TYPES_QUEUE[0]);
    setErrorPanelMessage("");
    setUiState(UI_STATE.SEARCH);
    onClose();
  };

  const getAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return "N/A";

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  // Only render if isOpen is true
  if (!isOpen) return null;

  return (
    // Removed the backdrop div and its styles.
    // The positioning (absolute, inset-0, flex, items-center, justify-center)
    // now directly applies to the Paper component's container if you want it centered.
    // If you want it positioned relative to its parent, you'll need to adjust.
    // For now, this centers the paper within its direct parent (likely the main content area).
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <Paper
        elevation={4}
        className="p-4 md:p-6 mb-6 relative z-10 w-full md:max-w-2xl bg-white rounded-lg shadow-xl"
        // Removed sx for overflowY and maxHeight to allow content to dictate height
        // and prevent internal scrollbar.
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Patient to Queue</h2>
          <IconButton onClick={resetPanelState} size="small">
            <CloseIcon />
          </IconButton>
        </div>

        {errorPanelMessage && (
          <Alert severity="error" className="mb-4">
            {errorPanelMessage}
          </Alert>
        )}

        {/* Search UI */}
        <Collapse in={uiState === UI_STATE.SEARCH}>
          <div className="flex flex-col gap-4">
            <RadioGroup
              row
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSearchValue("");
                setFoundPatient(null);
                setErrorPanelMessage("");
              }}
            >
              <FormControlLabel
                value={SEARCH_BY_PHONE}
                control={<Radio />}
                label="Phone Number"
              />
              <FormControlLabel
                value={SEARCH_BY_ID}
                control={<Radio />}
                label="National ID"
              />
            </RadioGroup>
            <div className="justify-end flex space-x-2">
              <NaviButton
                text="Register Patient"
                to="/hospital/register"
                color="info"
                size="small"
              />
            </div>

            <TextInput
              label={`Enter ${searchType}`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              size="small"
            />

            <AppFormButton
              text="Search"
              color="#1976d2"
              icon={<SearchIcon />}
              action={handleSearchPatient}
              validation={!!searchValue}
              isLoading={false}
            />
          </div>
        </Collapse>

        {/* Results UI */}
        <Collapse in={uiState === UI_STATE.RESULTS}>
          {foundPatient && (
            <div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-6 font-sans text-gray-700">
              <h3 className="text-xl font-semibold text-gray-800">
                Patient Found
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <span className="font-bold text-gray-600">Full Name:</span>{" "}
                  {foundPatient.fullName}
                </div>
                <div>
                  <span className="font-bold text-gray-600">Gender:</span>{" "}
                  {foundPatient.gender}
                </div>
                <div>
                  <span className="font-bold text-gray-600">Age:</span>{" "}
                  {getAge(foundPatient.dob)} yrs
                </div>
                <div>
                  <span className="font-bold text-gray-600">Phone:</span>{" "}
                  {foundPatient.phoneNumber}
                </div>
                <div>
                  <span className="font-bold text-gray-600">National ID:</span>{" "}
                  {foundPatient.nationalId}
                </div>
                <div>
                  <span className="font-bold text-gray-600">Address:</span>{" "}
                  {foundPatient.address || "N/A"}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-bold text-gray-600">Insurance:</span>{" "}
                  {foundPatient.insuranceProvider || "Not provided"}
                </div>
              </div>

              <div className="w-full max-w-xs">
                <SelectInput
                  id="visit-type"
                  name="visitType"
                  label="Visit Type"
                  options={VISIT_TYPES_QUEUE.map((type) => ({
                    label: type,
                    value: type,
                  }))}
                  value={selectedVisitTypePanel}
                  onChange={(e) => setSelectedVisitTypePanel(e.target.value)}
                  required
                  error={false}
                  errorMessage=""
                  color="#2563EB"
                />
              </div>

              <div className="pt-2">
                <AppFormButton
                  text="Add to Queue"
                  color="#10b981"
                  icon={null}
                  action={handleAddPatient}
                  validation={true}
                  isLoading={false}
                />
              </div>
            </div>
          )}
        </Collapse>

        {/* Patient Not Found UI */}
        <Collapse in={uiState === UI_STATE.NOT_FOUND}>
          <div className="mt-6 border border-red-500 bg-red-50 rounded-2xl p-6 text-center space-y-4 font-sans">
            <div className="flex justify-center">
              <ReportProblemOutlinedIcon
                className="text-red-500"
                style={{ fontSize: "3rem" }}
              />
            </div>
            <h3 className="text-lg font-semibold text-red-700">
              Oops! No patient found
            </h3>
            <p className="text-sm text-red-600">
              We couldn't locate any patient with the details you provided. You
              can register them below.
            </p>
            <div className="flex justify-center">
              <AppFormButton
                text="Register New Patient"
                color="#ef4444"
                icon={null}
                action={() => {
                  onOpenRegisterModal();
                  onClose();
                }}
                validation={true}
                isLoading={false}
              />
            </div>
          </div>
        </Collapse>
      </Paper>
    </div>
  );
};

export default NewQueue;
