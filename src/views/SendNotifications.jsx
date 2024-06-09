import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, FormControlLabel, Radio, RadioGroup, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination
} from '@mui/material';
import axiosService from '../helpers/axios';
import LayoutAdmin from '../components/admin/layout copy';
import CustomTextField from '../components/users/CustomStyledText';

const Notifications = () => {
  const [notification, setNotification] = useState({
    title: '',
    subtitle: '',
    status: 'draft'
  });
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [editNotification, setEditNotification] = useState(null);
 

  useEffect(() => {
    fetchNotifications();
  }, [page, rowsPerPage]);

  const fetchNotifications = async () => {
    try {
      const response = await axiosService.get(`notificationadmin/?page=${page + 1}&page_size=${rowsPerPage}`);
      setNotifications(response.data.results);
      setTotalNotifications(response.data.count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editNotification) {
        await axiosService.put(`notificationadmin/${editNotification.id}/`, notification);
      } else {
        await axiosService.post('notificationadmin/', notification);
      }

      // Clear the form fields after successful submission
      setNotification({
        title: '',
        subtitle: '',
        status: 'draft'
      });
      setEditNotification(null);
      fetchNotifications();

      console.log('Notification Submitted');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleEdit = (notification) => {
    setNotification({
      title: notification.title,
      subtitle: notification.subtitle,
      status: notification.status || 'draft' // Ensure status is always defined
    });
    setEditNotification(notification);
  };

  const handleChange = (e) => {
    setNotification({
      ...notification,
      [e.target.name]: e.target.value
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <LayoutAdmin>
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {editNotification ? 'Edit Notification' : 'Send Notification'}
      </Typography>
      <Box component="form" onSubmit={handleNotificationSubmit} sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <CustomTextField
          label="Title"
          name="title"
          value={notification.title}
          onChange={handleChange}
          fullWidth
          required
        />
        <CustomTextField
          label="Subtitle"
          name="subtitle"
          value={notification.subtitle}
          onChange={handleChange}
          fullWidth
          required
        />
        <RadioGroup
          row
          name="status"
          value={notification.status}
          onChange={handleChange}
        >
          <FormControlLabel value="draft" control={<Radio sx={{ color: 'green' }} />} label="Draft" />
          <FormControlLabel value="published" control={<Radio sx={{ color: 'green' }}  />} label="Published" />
        </RadioGroup>
        <Button type="submit" variant="contained" color="primary">
          {editNotification ? 'Update' : 'Send'}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="notifications table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Subtitle</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notif) => (
              <TableRow key={notif.id}>
                <TableCell>{notif.title}</TableCell>
                <TableCell>{notif.subtitle}</TableCell>
                <TableCell>{notif.status}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(notif)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={totalNotifications}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
    </LayoutAdmin>
  );
};

export default Notifications;
