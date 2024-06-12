import React, { useState } from 'react';
import { useUserActions } from '../../../hooks/user.actions';
import { TextField, Button, Box, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'white',
    
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    
    },
  },
});


function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const userActions = useUserActions();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      email: form.email,
      password: form.password,
    };
    userActions
      .login(data)
      .catch(error => {
        console.log(error.response.data)
        const errorMessage = error.response && error.response.data
          ? Object.values(error.response.data).join(', ')
          : 'An error occurred';
        setError(errorMessage);
        setSnackbarOpen(true);
      });
  };

  // const handleCloseSnackbar = () => {
  //   setSnackbarOpen(false);
  // };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <StyledTextField
       
        fullWidth
        margin="normal"
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <StyledTextField
       
        fullWidth
        margin="normal"
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        minLength="8"
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        sx={{ mt: 2 }}
      >
        Login
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={handleClose}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LoginForm;