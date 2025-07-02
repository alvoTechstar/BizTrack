import React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from "../../../../../../components/theme/ThemeContext";

// Styled TextField for consistent focus behavior and color
const StyledTextField = styled(TextField)(({ PrimaryColor }) => ({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: PrimaryColor, // Uses the primary color from your theme
    },
  },
}));

const DiagnosisSection = ({ diagnosis, setDiagnosis, disabled, isMobile }) => {
  const theme = useTheme();
  const PrimaryColor = theme.primaryColor;
  return (
    <StyledTextField
      placeholder="Enter your diagnosis here..." // Explicit placeholder text
      multiline
      rows={isMobile ? 6 : 10}
      fullWidth
      value={diagnosis}
      onChange={(e) => setDiagnosis(e.target.value)}
      variant="outlined"
      margin="normal"
      disabled={disabled}
      InputLabelProps={{
        shrink: false, // Prevents the label from moving up on focus/fill
      }}
      PrimaryColor={PrimaryColor} // Pass the theme's primary color to the styled component
    />
  );
};

export default DiagnosisSection;