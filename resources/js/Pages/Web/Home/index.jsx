import React from 'react';
import { Typography, Box, Container, Button, Grid } from '@mui/material';
import { Link } from '@inertiajs/react';
import WebsiteLayout from '../../../Layouts/WebsiteLayout.jsx';

const Index = () => {
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
            Welcome to Travel Portal
          </Typography>
          <Typography variant="h5" component="h2" color="text.secondary" sx={{ mb: 4 }}>
            Your gateway to amazing travel experiences
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                size="large"
                component={Link}
                href="/admin/login"
                sx={{ minWidth: 200 }}
              >
                Admin Login
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                href="/specialist/login"
                sx={{ minWidth: 200 }}
              >
                Specialist Login
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </WebsiteLayout>
  );
};

export default Index;
