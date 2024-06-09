// src/pages/Home.js
import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Box, Button, Container, Grid, Typography, Card, CardContent, CardMedia, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import LoadingScreen from './LoadingScreen';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './Home.css';
import styled from 'styled-components';
import carouselimg from '../../assets/img/carouselimg.jpg';
import about from '../../assets/img/aboutt.jpg';
import car11 from '../../assets/img/car11.jpg';
import car22 from '../../assets/img/car22.jpg';
import car33 from '../../assets/img/car33.jpg';
import f11 from '../../assets/img/f11.jpg';
import f22 from '../../assets/img/f22.jpg';
// import f33 from '../../assets/img/f33.jpg';
import team from '../../assets/img/team.jpg';
import CustomTextField from '../../components/users/CustomStyledText';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Ensure consistent order of hooks
  const ref = useRef(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const navItems = [
    { text: 'Home', link: '/' },
    { text: 'About', link: '#about' },
    { text: 'Features', link: '#features' },
    { text: 'Team', link: '#team' },
    { text: 'Contact', link: '#contact' },
    { text: 'Login', link: '/login', variant: 'contained', color: 'secondary' },
    { text: 'Register', link: '/register', variant: 'outlined', color: 'inherit' }
  ];

  const StyledContainer = styled.div`
    @media (min-width: 768px) {
      /* Apply styles for screens wider than 768px */
      & > * {
        font-size: 1.5rem; /* Increase the font size for typography */
      }

      & > button {
        font-size: 1.5rem; /* Increase the font size for the button */
        padding: 12px 20px; /* Increase the padding for the button */
      }
    }
  `;

  const carouselItems = [
    {
      image: car11,
      title: 'About Our System',
      description: 'Learn more about our water quality monitoring system.',
      link: '/about',
      linkText: 'Learn More'
    },
    {
      image: car22,
      title: 'Our Features',
      description: 'Discover the features of our system.',
      link: '/features',
      linkText: 'Discover'
    },
    {
      image: car33,
      title: 'Meet the Team',
      description: 'Get to know our team members.',
      link: '/team',
      linkText: 'Meet Us'
    }
  ];

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Water Quality Monitoring
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navItems.slice(0, 5).map((item, index) => (
              <Button key={index} color="inherit" component={Link} to={item.link}>{item.text}</Button>
            ))}
            <Button variant="contained" color="secondary" component={Link} to="/login" sx={{ ml: 1 }}>Login</Button>
            <Button variant="outlined" color="inherit" component={Link} to="/register" sx={{ ml: 1 }}>Register</Button>
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Drawer
  anchor="right"
  open={drawerOpen}
  onClose={handleDrawerToggle}
  ModalProps={{
    keepMounted: true,
  }}
>
  <Box
    sx={{ 
      width: 200,
      // bgcolor: 'primary.main',
    }}
    role="presentation"
    onClick={handleDrawerToggle}
    onKeyDown={handleDrawerToggle}
  >
    <IconButton
      sx={{ display: 'flex', justifyContent: 'flex-end', color: 'white' }}
      onClick={handleDrawerToggle}
    >
      <CloseIcon />
    </IconButton>
    <List>
      {navItems.map((item, index) => (
        <ListItem key={index} component={Link} to={item.link}>
          <ListItemText 
            primary={item.text} 
            sx={{ 
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 500,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
             '&:hover': {
      color: 'rgba(255, 255, 255, 0.9)',
      transform: 'scale(1.05)',
      transition: 'transform 0.3s ease',
    },
            }} 
          />
        </ListItem>
      ))}
    </List>
  </Box>
</Drawer>

      <Toolbar /> {/* This Toolbar is used to push the content below the fixed AppBar */}

      <Box>
        <Carousel>
          {carouselItems.map((item, i) => (
            <Box key={i} sx={{ position: 'relative' }}>
              <img className="d-block w-100" src={item.image} alt={item.title} />
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white' }}>
                <StyledContainer>
                  <Typography variant="h3" component="h3">{item.title}</Typography>
                  <Typography variant="h6" component="p">{item.description}</Typography>
                  <Button variant="contained" color="primary" component={Link} to={item.link}>
                    {item.linkText}
                  </Button>
                </StyledContainer>
              </Box>
            </Box>
          ))}
        </Carousel>

        <Container>
          <Box id="about" py={5}>
            <Typography variant="h2" align="center" gutterBottom>About Us</Typography>
            <Typography variant="body1" align="center" paragraph>
              Our water quality monitoring system helps you keep track of water quality parameters in real time. We provide accurate data and insights to ensure water safety and quality.
            </Typography>
            <Box display="flex" justifyContent="center">
              <CardMedia component="img" image={about} alt="About us" />
            </Box>
          </Box>

          <Box id="features" py={5} bgcolor="lightgrey">
            <Typography variant="h2" align="center" gutterBottom>Features</Typography>
            <Grid container spacing={3}>
              {[
                { title: 'Real-Time Monitoring', description: 'Get real-time data on water quality parameters such as pH, temperature, turbidity, and more.', image: f11 },
                { title: 'Data Analytics', description: 'Analyze historical data to identify trends and make informed decisions about water management.', image: f22 },
                { title: 'Alerts & Notifications', description: 'Receive alerts and notifications when water quality parameters exceed safe levels.', image: f22 }
              ].map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardMedia component="img" height="200" image={feature.image} alt={`Feature ${index + 1}`} />
                    <CardContent>
                      <Typography variant="h4" component="h4">{feature.title}</Typography>
                      <Typography variant="body1">{feature.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box id="team" py={5}>
            <Typography variant="h2" align="center" gutterBottom>Our Team</Typography>
            <Grid container spacing={3}>
              {['Ekechuku David', 'Deepak', 'Sinan', 'Gurpreet'].map((name, index) => (
                <Grid item xs={12} md={3} key={index} textAlign="center">
                  <img src={team} alt={`Team Member ${index + 1}`} className="rounded-circle" />
                  <Typography variant="h5" component="h5">{name}</Typography>
                  <Typography variant="body1">Role</Typography>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box id="contact" py={5} bgcolor="#404267">
            <Typography variant="h2" align="center" gutterBottom>Contact Us</Typography>
            <Container maxWidth="sm">
              <form>
                <Box mb={3}>
                  <CustomTextField fullWidth label="Name" variant="outlined" />
                </Box>
                <Box mb={3}>
                  <CustomTextField fullWidth label="Email" variant="outlined" />
                </Box>
                <Box mb={3}>
                  <CustomTextField fullWidth label="Message" variant="outlined" multiline rows={4} />
                </Box>
                <Button variant="contained" color="primary" type="submit" fullWidth>Send Message</Button>
              </form>
            </Container>
          </Box>
        </Container>
      </Box>

      <footer className="footer">
        <Container>
          <Typography variant="body1" align="center">&copy; 2024 Water Quality Monitoring. All rights reserved. | Summer Internship IIITH 2024</Typography>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
