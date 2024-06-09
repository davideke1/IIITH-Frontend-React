// src/pages/SetNewPassword.js

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomTextField from '../../components/users/CustomStyledText';

const SetNewPassword = () => {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const Navigate = useNavigate();
  console.log(token)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      await axios.patch('http://127.0.0.1:8000/api/password-reset/set-new-password/', { uidb64, token, password });
      setSuccessMessage('Password reset successful. Redirecting to login...');
      setErrorMessage('');
      setTimeout(() => {
        Navigate('/login');
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || 'An error occurred');
      setSuccessMessage('');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Box width="100%" maxWidth="1000px" p={3} boxShadow={3} borderRadius={2}>
        <Typography variant="h5" mb={2}>
          Set New Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <CustomTextField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <CustomTextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Reset Password
          </Button>
        </form>
        {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
      </Box>
    </Box>
  );
};

export default SetNewPassword;
