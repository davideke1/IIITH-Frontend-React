// src/pages/PasswordTokenCheck.js

import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PasswordTokenCheck = () => {
  const { uidb64, token } = useParams();
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await axios.get(`http://127.0.0.1:8000/api/password-reset/password-token-check/${uidb64}/${token}/`);
        setIsValid(true);
        navigate(`/set-new-password/${uidb64}/${token}`);
      } catch (error) {
        setIsValid(false);
      }
    };

    checkToken();
  }, [uidb64, token, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      {isValid === null && <CircularProgress />}
      {isValid === false && <Alert severity="error">Invalid or expired token.</Alert>}
    </Box>
  );
};

export default PasswordTokenCheck;
