import React, { useState } from 'react';
import { Typography, Box, Container, TextField, Button, Grid, Alert } from '@mui/material';
import { useForm } from '@inertiajs/react';
import WebsiteLayout from '../../Layouts/WebsiteLayout.jsx';

const Contact = () => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/contact');
  };

  return (
    <WebsiteLayout>
      <Box>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Contact Us
        </Typography>
        <Container maxWidth="md">
          <Typography variant="body1" paragraph align="center">
            Get in touch with us for any inquiries or support needs.
          </Typography>

          <Grid container spacing={3}>
            <Grid item size={{xs: 12, md: 6}}>
              <Typography variant="h5" gutterBottom>
                Contact Information
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Email:</strong> info@webportal.com
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Phone:</strong> +1 (555) 123-4567
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Address:</strong><br />
                123 Business Street<br />
                Suite 100<br />
                City, State 12345
              </Typography>
            </Grid>
            <Grid item size={{xs: 12, md: 6}}>
              <Typography variant="h5" gutterBottom>
                Send us a Message
              </Typography>

              {errors.message && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.message}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Your Name"
                  name="name"
                  autoComplete="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  multiline
                  rows={4}
                  id="message"
                  label="Message"
                  name="message"
                  value={data.message}
                  onChange={(e) => setData('message', e.target.value)}
                  error={!!errors.message}
                  helperText={errors.message}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={processing}
                >
                  {processing ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </WebsiteLayout>
  );
};

export default Contact;
