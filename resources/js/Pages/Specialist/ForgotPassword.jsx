import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
} from '@mui/material';
import { useForm, Link as InertiaLink, usePage } from '@inertiajs/react';

const ForgotPassword = () => {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const { flash } = usePage().props;

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/specialist/forgot-password');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a link to reset your password
          </Typography>

          {errors.message && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.message}
            </Alert>
          )}

          {flash?.success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {flash.success}
            </Alert>
          )}

          {errors.email && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.email}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={processing}
            >
              {processing ? 'Sending...' : 'Send Reset Link'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                component={InertiaLink}
                href="/specialist/login"
                variant="body2"
                sx={{ textDecoration: 'none' }}
              >
                Back to Login
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
