import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  FormControlLabel,
  Switch,
  MenuItem,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

const Edit = ({ processStep }) => {
  const { data, setData, post, processing, errors } = useForm({
    title: processStep.title || '',
    description: processStep.description || '',
    icon: processStep.icon || '',
    background_color: processStep.background_color || '',
    order: processStep.order || 0,
    is_active: processStep.is_active !== undefined ? processStep.is_active : true,
  });

  const iconOptions = [
    { value: 'calendar', label: 'Calendar' },
    { value: 'cash', label: 'Cash' },
    { value: 'videocam', label: 'Video Camera' },
    { value: 'checkmark', label: 'Checkmark' },
    { value: 'time', label: 'Time' },
    { value: 'document', label: 'Document' },
  ];

  const handleBack = () => {
    router.visit('/admin/process');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/admin/process/${processStep.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        router.visit('/admin/process');
      },
    });
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} variant="outlined">
            Back to Process
          </Button>
          <Typography variant="h4" component="h1">
            Edit Process Step
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Title"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
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
                rows={3}
              />

              <TextField
                select
                label="Icon"
                value={data.icon}
                onChange={(e) => setData('icon', e.target.value)}
                error={!!errors.icon}
                helperText={errors.icon || 'Select an icon for this step'}
                fullWidth
              >
                <MenuItem value="">None</MenuItem>
                {iconOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Background Color"
                value={data.background_color}
                onChange={(e) => setData('background_color', e.target.value)}
                error={!!errors.background_color}
                helperText={errors.background_color || 'e.g., #3B82F6 for blue, #E5E7EB for grey'}
                fullWidth
                placeholder="#3B82F6"
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

              <FormControlLabel
                control={
                  <Switch
                    checked={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                  />
                }
                label="Active"
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
