// src/pages/ActivityLog.js

import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper } from '@mui/material';
import axios from 'axios';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/activities/');
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Activity Log
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.user.username}</TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{activity.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default ActivityLog;
