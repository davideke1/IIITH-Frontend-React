import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, Alert } from '@mui/material';
import axios from 'axios';
import CustomTextField from '../../components/users/CustomStyledText';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ loading: true, verified: null, error: null });
  const [email, setEmail] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`http://127.0.0.1:8000/api/activations/email-verify/?token=${token}`);
        setStatus({ loading: false, verified: true, error: null });
        setTimeout(() => {
          navigate('/login'); // Redirect to login after successful verification
        }, 2000);
      } catch (error) {
        setStatus({ loading: false, verified: false, error: 'Verification failed. Invalid or expired token.' });
      }
    };

    verifyToken();
  }, [token, navigate]);

  const resendActivationLink = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/activations/resend-activation-link/', { email });
      setStatus({ loading: false, verified: false, error:null });
      navigate('/check-email')

    } catch (error) {
      if (error.response) {
        // Access error data from Axios response
        const errorMessage = error.response.data.error || 'Failed to resend activation link.';
        setStatus({ loading: false, verified: false, error: errorMessage });
      } else {
        console.error('Error:', error);
        setStatus({ loading: false, verified: false, error: 'Failed to resend activation link.' }); // Generic error handling
      }
    }
  };

  if (status.loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
        <Typography variant="h6" mt={2}>Verifying your email...</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
      {status.verified ? (
        <Alert severity="success">Email verified successfully. Redirecting to login...</Alert>
      ) : (
        <>
          {status.error && <Alert severity="error">{status.error}</Alert>}
          <CustomTextField
            label="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={resendActivationLink} sx={{ mt: 2 }}>
            Resend Activation Link
          </Button>
        </>
      )}
    </Box>
  );
};

export default VerifyEmail;