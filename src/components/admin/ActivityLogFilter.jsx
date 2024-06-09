// src/components/ActivityLogFilter.js

import React from 'react';
import { TextField, Button, Grid } from '@mui/material';

const ActivityLogFilter = ({ onFilterChange }) => {
  const handleInputChange = (e) => {
    onFilterChange(e.target.name, e.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <TextField
          label="User Email"
          name="userEmail"
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Action"
          name="action"
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onFilterChange('reset', '')}
          fullWidth
        >
          Reset Filters
        </Button>
      </Grid>
    </Grid>
  );
};

export default ActivityLogFilter;
