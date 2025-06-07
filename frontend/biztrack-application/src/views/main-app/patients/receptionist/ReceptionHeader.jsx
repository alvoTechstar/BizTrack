// src/components/Header.jsx

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const ReceptionHeader = ({ currentDate, onTogglePanel }) => {
  return (
    <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
      {/* Left: Date heading */}
      <Box className="md:col-span-2">
        <Typography
          variant="h5"
          component="h1"
          className="text-gray-800 font-semibold"
        >
          Queue for {currentDate}
        </Typography>
      </Box>

      {/* Right: Button */}
      <Box className="md:col-span-1 flex justify-start md:justify-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={onTogglePanel}
          className="w-full md:w-auto normal-case"
        >
          New Queue Entry
        </Button>
      </Box>
    </Box>
  );
};

export default ReceptionHeader;
