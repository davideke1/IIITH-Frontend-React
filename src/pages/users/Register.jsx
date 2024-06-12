// src/pages/RegistrationForm.js
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,

  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';

const RegistrationSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const initialValues={
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFormSubmit=async (values, { setSubmitting, setStatus }) => {
    try {
      const { confirmPassword, ...submitValues } = values; // Exclude confirmPassword
      await axios.post('http://127.0.0.1:8000/api/activations/register/', submitValues);
      setStatus({ success: true });
      setSnackbarSeverity('success');
      setSnackbarMessage('Verification email sent. Please check your email.');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/check-email');
      }, 2000);
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
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
      setStatus({ success: false });
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="registration-page">
      <Box className="registration-form-container">
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={RegistrationSchema}
   
        >
          {({ 
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting, // This is used to show a loading indicator while the form is being submitted
         }) => (
            <Form onSubmit={handleSubmit}className="registration-form">

              <TextField
              variant="filled"
                name="first_name"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.first_name}
                error={!!touched.first_name && !!errors.first_name}
                helperText={touched.first_name && errors.first_name}
                // sx={{ gridColumn: "span 2" }}
                fullWidth
              />
              <TextField
               fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.last_name}
                name="last_name"
                error={!!touched.last_name && !!errors.last_name}
                helperText={touched.last_name && errors.last_name}
              />
              <TextField
                variant="filled"
                type="text"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                fullWidth
              />
              <TextField 
               variant="filled"
               type="text"
               label="Email"
               onBlur={handleBlur}
               onChange={handleChange}
               value={values.email}
               name="email"
               error={!!touched.email && !!errors.email}
               helperText={touched.email && errors.email}
                fullWidth
              />
              <TextField
               fullWidth
               variant="filled"
               type="password"
               label="Password"
               onBlur={handleBlur}
               onChange={handleChange}
               value={values.password}
               name="password"
               error={!!touched.password && !!errors.password}
               helperText={touched.password && errors.password}
                
              />
              <TextField
               fullWidth
               variant="filled"
               type="password"
               label="Confirm Password"
               onBlur={handleBlur}
               onChange={handleChange}
               value={values.confirmPassword}
               name="confirmPassword"
               error={!!touched.confirmPassword && !!errors.confirmPassword}
               helperText={touched.confirmPassword && errors.confirmPassword}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                
              >
                {isSubmitting ? <CircularProgress size="1.5rem" /> : 'Register'}
              </Button>
              <Typography variant="body1" align="center" sx={{ color: '#ded9ee', fontSize: '1.1rem', marginBottom: 1 }}>
  Have an account, <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login</Link>.
</Typography>


            </Form>
          )}
        </Formik>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default RegistrationForm;
