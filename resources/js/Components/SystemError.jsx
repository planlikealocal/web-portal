import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
} from '@mui/material';
import { Link as InertiaLink } from '@inertiajs/react';

const SystemError = ({ message = 'An unexpected error occurred. Please try again later.' }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom color="error">
            ⚠️ System Error
          </Typography>
          
          <Alert severity="error" sx={{ mb: 3 }}>
            {message}
          </Alert>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            We apologize for the inconvenience. This appears to be a temporary system issue.
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please try again in a few minutes. If the problem persists, please contact our support team.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={InertiaLink}
              href="/specialist/login"
              variant="contained"
              color="primary"
            >
              Back to Login
            </Button>
            <Button
              component={InertiaLink}
              href="/specialist/forgot-password"
              variant="outlined"
              color="primary"
            >
              Try Password Reset Again
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SystemError;
