import React, { useState, useEffect } from "react";
import LayoutAdmin from "../components/admin/layout copy";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  TextField,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  Box,
} from "@mui/material";
import Fuse from "fuse.js";
import axiosService from "../helpers/axios";
import CustomTextField from "../components/users/CustomStyledText";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchUsers();
  }, [page]);

  useEffect(() => {
    if (searchQuery) {
      const fuse = new Fuse(users, {
        keys: ["username", "thinkspeak_api_key", "latitude", "longitude"],
        threshold: 0.3,
      });
      setFilteredUsers(fuse.search(searchQuery).map((result) => result.item));
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = () => {
    axiosService
      .get(`user_management/list_active_users/?page=${page}`)
      .then((response) => {
        setUsers(response.data.results);
        setTotalPages(response.data.total_pages);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const handleUpdateUser = (userId) => {
    const user = modalUser;
    axiosService
      .put(`user_management/${userId}/update_thinkspeak_info/`, user)
      .then((response) => {
        fetchUsers(); // Refetch the users list after updating a user
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  const handleOpenModal = (user) => {
    setModalUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalUser(null);
  };

  const handleModalUpdate = () => {
    if (modalUser) {
      handleUpdateUser(modalUser.id);
    }
  };

  return (
    <LayoutAdmin>
      <Container maxWidth="90%">
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <CustomTextField
          label="Search Users"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                {!isSmallScreen && <TableCell>ThinkSpeak API Key</TableCell>}
                {!isSmallScreen && <TableCell>Latitude</TableCell>}
                {!isSmallScreen && <TableCell>Longitude</TableCell>}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <TableRow>
                    <TableCell>{user.username}</TableCell>
                    {!isSmallScreen && (
                      <TableCell>
                        <TextField
                          value={user?.thinkspeak_api_key ?? ""}
                          disabled
                          InputProps={{ style: { color: "black" } }}
                        />
                      </TableCell>
                    )}
                    {!isSmallScreen && (
                      <TableCell>
                        <TextField
                          value={user?.latitude ?? ""}
                          disabled
                          InputProps={{ style: { color: "black" } }}
                        />
                      </TableCell>
                    )}
                    {!isSmallScreen && (
                      <TableCell>
                        <TextField
                          value={user?.longitude ?? ""}
                          disabled
                          InputProps={{ style: { color: "black" } }}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenModal(user)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
          />
        </Box>
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              label="ThinkSpeak API Key"
              value={modalUser?.thinkspeak_api_key ?? ""}
              onChange={(e) =>
                setModalUser({
                  ...modalUser,
                  thinkspeak_api_key: e.target.value,
                })
              }
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Latitude"
              value={modalUser?.latitude ?? ""}
              onChange={(e) =>
                setModalUser({ ...modalUser, latitude: e.target.value })
              }
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Longitude"
              value={modalUser?.longitude ?? ""}
              onChange={(e) =>
                setModalUser({ ...modalUser, longitude: e.target.value })
              }
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="error">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalUpdate}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                fontWeight: "bold",
                padding: "8px 16px",
                "&:hover": {
                  backgroundColor: "#0056b3",
                },
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LayoutAdmin>
  );
};

export default UserManagement;
