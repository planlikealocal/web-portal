import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import ImageUploader from '../../../Components/ImageUploader';

const Edit = ({ whoWeAre }) => {
  const { data, setData, post, processing, errors } = useForm({
    name: whoWeAre.name || '',
    designation: whoWeAre.designation || '',
    description: whoWeAre.description || '',
    picture: null,
    order: whoWeAre.order || 0,
  });

  const handleBack = () => {
    router.visit('/admin/who-we-are');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/admin/who-we-are/${whoWeAre.id}`, {
      preserveScroll: true,
      onSuccess: () => {
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
            Edit Who We Are Entry
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

              {whoWeAre.picture_url && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Current Picture:
                  </Typography>
                  <Box
                    component="img"
                    src={whoWeAre.picture_url}
                    alt={whoWeAre.name}
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      mb: 2,
                    }}
                  />
                </Box>
              )}

              <ImageUploader
                label="New Profile Picture (leave empty to keep current)"
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
                  {processing ? 'Updating...' : 'Update'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default Edit;
