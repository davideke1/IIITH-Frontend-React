// src/components/Navadmin.js

import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navadmin = ({ handleDrawerToggle }) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          Admin Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navadmin;
