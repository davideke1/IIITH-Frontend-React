import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/forms/users/LoginForm';
import { Container, Card, CardContent, Typography } from '@mui/material';

function Login() {
  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: { xs: '20px', sm: '40px' } }}>
      <Card sx={{ padding: 4 }}>
        <CardContent>
          <Typography
            variant="h2"
            align="center"
            sx={{
              color: 'white', // Change the text color to white
              backgroundImage: 'linear-gradient(to bottom, #5050FA, #3030B3)', // Add a background image
              backgroundSize: '100% 300px', // Set the background size
              backgroundPosition: 'center', // Center the background
              padding: '20px', // Add some padding
            }}
          >
            Welcome to Water Quality Measuring System!
          </Typography>

          <Typography variant="body1" align="center" sx={{ color: '#ded9ee', mt: 1, mb: 1, fontSize: '1.1rem' }}>
            Login now and start enjoying real-time visualization!
          </Typography>

          <LoginForm />
          <Typography variant="body1" align="center" sx={{ color: '#ded9ee', mt: 1, mb: 1, fontSize: '1.1rem' }}>
            Don't have an account <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register</Link>.
          </Typography>

          <Typography variant="body1" align="center" sx={{ color: '#ded9ee', mb: 1 }}>
            <Link to="/request-password-reset-email" style={{ color: '#EE4B2B', textDecoration: 'none' }}>Forgot Password?</Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login;
