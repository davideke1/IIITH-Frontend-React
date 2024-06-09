// // src/pages/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   Typography, Box, Grid, Card, CardContent, Button,
  Table, TableBody, TableCell, TableHead, TableRow, Skeleton, Paper, TextField, MenuItem, IconButton, Drawer, List, ListItem, ListItemText, Container
} from '@mui/material';
// import { styled } from '@mui/system';
import UserMap from '../pages/admin/UserMap';

// import BarChart from '../components/admin/BarChart'; // Assuming you have a BarChart component
import axiosService from '../helpers/axios';
import LayoutAdmin from '../components/admin/layout copy';
// import LineCharts from '../components/admin/BarChart';
import MainComponent from '../pages/admin/Testing';
// const TopBar = styled(AppBar)({
//   zIndex: 1400, // Ensure the AppBar is above the rest of the content
// });

const SummaryCard = ({ title, value, color }) => (
  <Card sx={{ backgroundColor: color, color: '#fff' }}>
    <CardContent>
      <Typography variant="h6" component="div">
        {title}
      </Typography>
      <Typography variant="h3">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [summary, setSummary] = useState({});
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState({
    title: '',
    subtitle: '',
    status: 'draft'
  });
  // const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleToggleActive = (userId) => {
    const user = users.find(u => u.id === userId);
    axiosService.put(`user_list/${userId}/toggle_active/`, { is_active: !user.is_active })
      .then(response => {
        setUsers(users.map(user => user.id === userId ? { ...user, is_active: !user.is_active } : user));
      })
      .catch(error => {
        console.error('Error toggling user active state:', error);
      });
  };
  useEffect(() => {

    //fetch card details
    axiosService.get('dashboard/summary/')
    .then(response => {
        setSummary(response.data);
    })
    .catch(error => {
        console.error('There was an error fetching the summary data!', error);
    });

            //user list

   axiosService.get('user/')
   .then(response => {
    setUsers(response.data);
}).catch(error => {
    console.error('There was an error fetching the users data!', error);
});


    // Simulate loading data
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const handleNotificationChange = (e) => {
    setNotification({
      ...notification,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send notification data to the backend
      const response = await axiosService.post('notificationadmin/', notification);

      // Clear the form fields after successful submission
      setNotification({
        title: '',
        subtitle: '',
        status: 'draft'
      });

      console.log('Notification Submitted:', response.data);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  const handleMapButtonClick = () => {
    navigate('/mainmap');
  };

  // const toggleDrawer = (open) => (event) => {
  //   if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
  //     return;
  //   }
  //   setDrawerOpen(open);
  // };

  return (
    <LayoutAdmin>
    <Box>
      {/* <TopBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </TopBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          <ListItem >
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem >
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem >
            <ListItemText primary="Notifications" />
          </ListItem>
        </List>
      </Drawer> */}

      <Container  maxWidth="90%">
        <Box mb={2}>
          {loading ? (
            <Skeleton variant="text" width="100%" height={80} />
          ) : (
            <Typography mt={2} variant="h4">Welcome back, {adminName}</Typography>
          )}
        </Box>

        <Grid container spacing={3} mb={3}>
          {loading ? (
            [1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Skeleton variant="rectangular" height={150} />
              </Grid>
            ))
          ) : (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <SummaryCard title="Total Users" value={summary.users_count} color="#3f51b5" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SummaryCard title="Active Users" value={summary.active_users_count} color="#4caf50" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SummaryCard title="Pending Approvals" value={summary.notifications_count} color="#ff9800" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SummaryCard title="Notifications" value={summary.notifications_count} color="#f44336" />
              </Grid>
            </>
          )}
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={8}>
            {loading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <Paper sx={{ height: '100%' }}>
                <Typography variant="h6" p={2}>
            Sensor Map Locations
                </Typography>
                {/* Insert your map component here */}
                <UserMap />
                <Button onClick={handleMapButtonClick} variant="contained" color="primary" sx={{ mt: 2 , mb:2 }} style={{ display: 'flex', justifyContent: 'center' }}>
                  View Larger Map
                </Button>
              </Paper>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            {loading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <Paper sx={{ height: '100%' }}>
                <Table>
                  <TableHead>
                  <TableRow>
              <TableCell>Username</TableCell>
              
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
                  </TableHead>
                  
                  <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                 <TableCell sx={{ wordWrap: 'break-word', maxWidth: '100px' }}>{user.username}</TableCell>
                <TableCell>{user.is_active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                <Button
  variant="contained"
  color={user.is_active ? 'error' : 'success'}
  onClick={() => handleToggleActive(user.id)}
  sx={{
    width: '100%', // Set button width to 100% of its container
    maxWidth: '50px', // Set maximum width for the button
    whiteSpace: 'normal', // Allow text to wrap
    wordWrap: 'break-word', // Allow text to wrap onto the next line
  }}
>
  {user.is_active ? 'Deactivate' : 'Activate'}
</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
                </Table>
              </Paper>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={12}>
            {loading ? (
              <Skeleton variant="rectangular" height={140} />
            ) : (
              <Box display="flex" flexDirection="column" height="100%">
                {/* <Box display="flex" justifyContent="space-around" mb={2}>
                  <Button variant="contained" color="primary">Export CSV</Button>
                  <Button variant="contained" color="secondary">Export PDF</Button>
                  <Button variant="contained" color="success">Export Excel</Button>
                </Box> */}
                <Paper sx={{ flexGrow: 1, p: 2 }}>
                  <MainComponent />
                </Paper>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {loading ? (
              <Skeleton variant="rectangular" height={140} />
            ) : (
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" mb={2}>
                  Add Notification
                </Typography>
                <Box component="form" onSubmit={handleNotificationSubmit} display="flex" flexDirection="column" height="100%">
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={notification.title}
                    onChange={handleNotificationChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Subtitle"
                    name="subtitle"
                    value={notification.subtitle}
                    onChange={handleNotificationChange}
                    margin="normal"
                  />
                  <TextField
                    select
                    label="Status"
                    name="status"
                    value={notification.status}
                    onChange={handleNotificationChange}
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </TextField>
                  <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Save Notification
                  </Button>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
    </LayoutAdmin>
  );
};

export default AdminDashboard;

