import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Link } from '@inertiajs/react';
import Notification from '../Components/Notification';

const WebsiteLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              <Typography variant="body1">Home</Typography>
            </Link>
            <Link href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>
              <Typography variant="body1">About</Typography>
            </Link>
            <Link href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>
              <Typography variant="body1">Contact</Typography>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Notification />
        {children}
      </Container>

      <Box component="footer" sx={{ bgcolor: 'grey.100', py: 2, mt: 'auto' }}>
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 Plan Like a Local. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default WebsiteLayout;
