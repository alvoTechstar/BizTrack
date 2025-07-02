import React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from "../../../../../../components/theme/ThemeContext"; // Correct import path

// Styled TextField to control focus behavior and color
const StyledTextField = styled(TextField)(({ PrimaryColor }) => ({ // Accept PrimaryColor as a prop
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: PrimaryColor, // Use the dynamic PrimaryColor here
    },
  },
}));

const SymptomsNotesSection = ({ symptomsNotes, setSymptomsNotes, disabled, isMobile }) => {
  const theme = useTheme();
  const PrimaryColor = theme.primaryColor;

  return (
    <StyledTextField
      placeholder="Enter detailed symptoms, patient history, and observations..."
      multiline
      rows={isMobile ? 6 : 10}
      fullWidth
      value={symptomsNotes}
      onChange={(e) => setSymptomsNotes(e.target.value)}
      variant="outlined"
      margin="normal"
      disabled={disabled}
      InputLabelProps={{
        shrink: false, // Keeps the label inside, acting as a permanent placeholder
      }}
      PrimaryColor={PrimaryColor} // Pass PrimaryColor as a prop to StyledTextField
    />
  );
};

export default SymptomsNotesSection;