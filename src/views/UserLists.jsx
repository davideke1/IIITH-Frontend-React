import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, useTheme, Pagination, Stack, Grid, TextField, InputAdornment, IconButton,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/system';
import LayoutAdmin from '../components/admin/layout copy';
import { FiTrash, FiUserCheck, FiUserX, FiSearch } from 'react-icons/fi';
import axiosService from '../helpers/axios';
import Fuse from 'fuse.js';
import CustomTextField from '../components/users/CustomStyledText';

const StyledButton = styled(Button)({
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.2s',
  },
});

const AdminLabel = styled('sup')({
  color: 'green',
  marginLeft: '5px',
  fontWeight: 'bold',
});

const StaffLabel = styled('sup')({
  color: 'blue',
  marginLeft: '5px',
  fontWeight: 'bold',
});

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const [deleteUserId, setDeleteUserId] = useState(null); // State to track the user id for deletion
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State to control the visibility of the delete dialog

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axiosService.get(`user_list/list_users/`)
      .then(response => {
        setUsers(response.data.results);
        setFilteredUsers(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };
  const fuse = new Fuse(users, {
    keys: ['username', 'email'],
  });
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (!searchTerm) {
      setFilteredUsers(users); // Reset to all users if search term is empty
      setPage(1); // Reset page to 1
      setTotalPages(Math.ceil(users.length / 10)); // Update total pages
    } else {
      const results = fuse.search(searchTerm);
      setFilteredUsers(results.map(result => result.item)); // Update filtered users with search results
      setPage(1); // Reset page to 1
      setTotalPages(Math.ceil(results.length / 10)); // Update total pages
    }
  };
//   const handleSearch = () => {
//     const filtered = users.filter(user => 
//       user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredUsers(filtered);
//     setPage(1);
//     setTotalPages(Math.ceil(filtered.length / 10));
//   };

  const handleToggleActive = (userId) => {
    axiosService.put(`user_list/${userId}/toggle_active/`)
      .then(response => {
        setUsers(users.map(user => user.id === userId ? { ...user, is_active: !user.is_active } : user));
        setFilteredUsers(filteredUsers.map(user => user.id === userId ? { ...user, is_active: !user.is_active } : user));
      })
      .catch(error => {
        console.error('Error toggling user active state:', error);
      });
  };

  const handleDeleteUser = (userId) => {
    axiosService.delete(`user_list/${userId}/delete_user/`)
      .then(() => {
        setUsers(users.filter(user => user.id !== userId));
        setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
        handleCloseDeleteDialog(); // Close the dialog after successful deletion
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedUsers = filteredUsers.slice((page - 1) * 10, page * 10);
  const handleOpenDeleteDialog = (userId) => {
    setDeleteUserId(userId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteUserId(null);
  };
  return (
    <LayoutAdmin>
      <Container>
        <Typography variant="h4"  sx={{ mb: 2 }} gutterBottom>User List</Typography>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
          <CustomTextField
  fullWidth
  variant="outlined"
  label="Search Users"
  value={searchTerm}
  onChange={(e) => handleSearch(e.target.value)}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => handleSearch(searchTerm)}> {/* Trigger search onClick */}
          <FiSearch />
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
          </Grid>
          {/* <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid> */}
        </Grid>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.username}
                    {user.is_superuser && <AdminLabel>Admin</AdminLabel>}
                    {/* {user.is_staff && <StaffLabel>Staff</StaffLabel>} */}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.is_active ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <StyledButton 
                          fullWidth
                          variant="contained" 
                          color={user.is_active ? "warning" : "success"} 
                          onClick={() => handleToggleActive(user.id)}
                          startIcon={user.is_active ? <FiUserX /> : <FiUserCheck />}
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </StyledButton>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <StyledButton 
                          fullWidth
                          variant="contained" 
                          color="error" 
                          onClick={() => handleOpenDeleteDialog(user.id)}
                          startIcon={<FiTrash />}
                        >
                          Delete
                        </StyledButton>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack spacing={2} sx={{ marginTop: 3, alignItems: 'center' }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary"
          />
        </Stack>
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this user account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={() => handleDeleteUser(deleteUserId)} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      
      </Container>
    </LayoutAdmin>
  );
};

export default UserList;
