// src/pages/UserFeedback.js

import React, { useState, useEffect } from 'react';
import { Container, List, ListItem, ListItemText, Typography, useTheme, Paper, Box, CircularProgress, Grid } from '@mui/material';
import LayoutAdmin from '../components/admin/layout copy';
import axiosService from '../helpers/axios';

const UserFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    axiosService.get('feedback')
      .then(response => {
        setFeedback(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching feedback:', error);
        setLoading(false);
      });
  }, []);

  return (
    <LayoutAdmin>
      <Container maxWidth="md" sx={{ marginTop: theme.spacing(4), marginBottom: theme.spacing(4) }}>
        <Typography variant="h4" gutterBottom>User Feedback</Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={1}>
          {feedback.map((item) => (
            <Grid item xs={12} sm={12} md={6} key={item.id}>
              <Paper elevation={3} sx={{ padding: theme.spacing(2) }}>
                <ListItemText
  primary={<Typography variant="h6">{item.user.username}</Typography>}
  secondary={
    <Typography variant="body1" style={{ wordWrap: "break-word", maxWidth: "500px" }}>
      {item.message}
    </Typography>
  }
/>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </LayoutAdmin>
  );
};

export default UserFeedback;
