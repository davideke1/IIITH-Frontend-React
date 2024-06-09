import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const CheckEmail = () => {
  return ( 
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        textAlign="center"
      >
        <Typography variant="h5" gutterBottom>
          A verification email has been sent to your email address. Please check your email and follow the instructions to verify your account.
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default CheckEmail;
