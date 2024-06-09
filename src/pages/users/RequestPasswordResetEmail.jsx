import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomTextField from '../../components/users/CustomStyledText';


const RequestPasswordResetEmail = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/password-reset/request-password-reset-email/', { email:email });
      setSuccessMessage(response.data.detail);
      setEmail('');
      setErrorMessage('');

    } catch (error) {
        let errorMessage = "An unexpected error occurred.";
        if (error.response) {
          // Backend responded with an error
          if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data) {
            // Try to get the first error message if it's an object of errors
            const data = error.response.data;
            errorMessage = data[Object.keys(data)[0]] || errorMessage;
          }
        } else if (error.message) {
          // General error message
          errorMessage = error.message;
        }
    
        setErrorMessage(errorMessage);
    //   setErrorMessage(error.response.data.error || 'An error occurred');
      setSuccessMessage('');
    }
  };
  const handleHomePage = () => {
    navigate('/');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Box width="100%" maxWidth="400px" p={3} boxShadow={3} borderRadius={2}>
        <Typography variant="h5" mb={2}>
          Request Password Reset
        </Typography>
        <form onSubmit={handleSubmit}>
          <CustomTextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            type="email"
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Send Reset Link
          </Button>
        </form>
        {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}

        <Button variant="outlined" color="secondary" fullWidth onClick={handleHomePage} sx={{ mt: 2 }}>
          Back to Homepage
        </Button>
      </Box>
    </Box>
  );
};

export default RequestPasswordResetEmail;
