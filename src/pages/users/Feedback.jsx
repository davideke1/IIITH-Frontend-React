import React, { useState } from 'react';
import { Box, Button, TextField, Typography,SnackbarContent,Snackbar } from '@mui/material';

import Layout from "../../components/users/Layout";
import Header from '../../components/users/Header';
import axiosService from '../../helpers/axios';
import CustomTextField from '../../components/users/CustomStyledText';

const FeedbackForm = () => {
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosService
      .post('feedback/', { message })
      .then(response => {
        console.log('Feedback submitted successfully:', response.data);
        setMessage(''); // clear the message after submission
        setSnackbarMessage("Feedback submitted successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch(error => {
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
    
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error('Error submitting feedback:', error);
      });
  };

  
  return (
    <Layout>
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Header title={"COMPLAINS"} />
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: '600px',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <Typography variant="h6" gutterBottom>
            We value your feedback!
          </Typography>
          <CustomTextField
            label="Message"
            value={message}
            onChange={handleChange}
            fullWidth
            required
            multiline
            rows={4}
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Submit Feedback
          </Button>
        </Box>
        <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000} // Adjust the duration as needed
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <SnackbarContent
          sx={{
            backgroundColor:
              snackbarSeverity === "success" ? "#4caf50" : "#f44336",
            width: "100%",
            top: 0,
            position: "fixed",
          }}
          message={snackbarMessage}
        />
      </Snackbar>
      </Box>
    </Layout>
  );
};

export default FeedbackForm;
