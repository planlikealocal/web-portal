import React from 'react';
import { Typography, Box, Container } from '@mui/material';
import WebsiteLayout from '../Layouts/WebsiteLayout';

const Home = () => {
  return (
    <WebsiteLayout>
      <Container maxWidth="md">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '60vh',
            textAlign: 'center'
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Coming Soon
          </Typography>
          <Typography variant="h5" component="h2" color="text.secondary">
            We're working on something amazing. Stay tuned!
          </Typography>
        </Box>
      </Container>
    </WebsiteLayout>
  );
};

export default Home;
