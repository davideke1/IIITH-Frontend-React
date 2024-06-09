import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Layout from '../../components/users/Layout';
import axiosService from '../../helpers/axios';
import Header from '../../components/users/Header';
const data = [
    { title: "Jan", subtitle: "Hello World I love IIITH" },
    { title: "Jan", subtitle: "Hello World I love IIITH" },
    { title: "Jan", subtitle: "Hello World I love IIITH" },
    { title: "Jan", subtitle: "Hello World I love IIITH" },
    { title: "Jan", subtitle: "Hello World I love IIITH" },
    
  ];
  
function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1); // Current page
  const [hasNextPage, setHasNextPage] = useState(false); // Indicates if there are more pages

  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosService.get(`notifications/?page=${page}`);
        setNotifications(response.data.results);
        setHasNextPage(response.data.next !== null);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [page]); // Fetch notifications whenever the page changes

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  return (
    <Layout>
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title={"Notifications"} />
        </Box>
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          <Box width="100%" maxWidth="1000px">
            {notifications.map(notification => (
              <Accordion key={notification.id} sx={{ margin: '10px 0', boxShadow: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: secondaryColor }} />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {notification.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography style={{ color: '#888888' }}>
                    {notification.subtitle}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
          <Box mt={3} display="flex" justifyContent="center" alignItems="center">
            <Button
              onClick={prevPage}
              disabled={page === 1}
              sx={{
                backgroundColor: secondaryColor,
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: secondaryColor,
                },
              }}
            >
              Previous
            </Button>
            <Box mx={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {page}
              </Typography>
            </Box>
            <Button
              onClick={nextPage}
              disabled={!hasNextPage}
              sx={{
                backgroundColor: secondaryColor,
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: secondaryColor,
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}

export default Notification;
