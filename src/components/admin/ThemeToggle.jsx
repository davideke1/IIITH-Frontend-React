// src/components/ThemeToggle.js

import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <FormControlLabel
      control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
      label="Dark Mode"
    />
  );
};

export default ThemeToggle;
