// src/components/Layout.js

import React from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Container } from '@mui/material';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: (theme) => theme.palette.background.default,
          padding: (theme) => theme.spacing(3),
          marginTop: 8,
        }}
      >
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
};

export default Layout;
