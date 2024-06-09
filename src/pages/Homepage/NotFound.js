// src/pages/NotFound.js
import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <Box className="not-found" display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
      <Container textAlign="center" style={{ backgroundColor: '#0f0f0f' }}> {/* Set background color */}
  <Typography variant="h1" gutterBottom>404</Typography>
  <Typography variant="h4" gutterBottom>Page Not Found</Typography>
  <Typography variant="body1" paragraph>The page you are looking for might have been removed or is temporarily unavailable.</Typography>
  <Button variant="contained" color="primary" component={Link} to="/" mb={2}>Go Home</Button>
</Container>
    </Box>
  );
};

export default NotFound;
