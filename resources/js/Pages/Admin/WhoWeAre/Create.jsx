import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import ImageUploader from '../../../Components/ImageUploader';

const Create = () => {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    designation: '',
    description: '',
    picture: null,
    order: 0,
  });

  const handleBack = () => {
    router.visit('/admin/who-we-are');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/who-we-are', {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        router.visit('/admin/who-we-are');
      },
    });
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} variant="outlined">
            Back to Who We Are
          </Button>
          <Typography variant="h4" component="h1">
            Create New Who We Are Entry
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
                fullWidth
              />

              <TextField
                label="Designation"
                value={data.designation}
                onChange={(e) => setData('designation', e.target.value)}
                error={!!errors.designation}
                helperText={errors.designation}
                required
                fullWidth
              />

              <TextField
                label="Description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                required
                fullWidth
                multiline
                rows={4}
              />

              <ImageUploader
                label="Profile Picture"
                value={data.picture}
                onChange={(file) => setData('picture', file)}
                error={!!errors.picture}
                helperText={errors.picture}
                previewHeight={200}
                previewWidth={200}
              />

              <TextField
                label="Order"
                type="number"
                value={data.order}
                onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                error={!!errors.order}
                helperText={errors.order || 'Lower numbers appear first'}
                fullWidth
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={handleBack} variant="outlined">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={processing}>
                  {processing ? 'Creating...' : 'Create'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default Create;
