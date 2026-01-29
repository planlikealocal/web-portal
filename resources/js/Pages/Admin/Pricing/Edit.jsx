import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

const Edit = ({ pricingPlan }) => {
  const [features, setFeatures] = useState(pricingPlan.features && pricingPlan.features.length > 0 ? pricingPlan.features : ['']);

  const { data, setData, post, processing, errors } = useForm({
    name: pricingPlan.name || '',
    price: pricingPlan.price || '',
    price_description: pricingPlan.price_description || '',
    features: pricingPlan.features || [],
    background_color: pricingPlan.background_color || '',
    order: pricingPlan.order || 0,
    is_active: pricingPlan.is_active !== undefined ? pricingPlan.is_active : true,
  });

  useEffect(() => {
    setData('features', features.filter((f) => f.trim() !== ''));
  }, [features]);

  const handleBack = () => {
    router.visit('/admin/pricing');
  };

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    setData('features', newFeatures.filter((f) => f.trim() !== ''));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    setData('features', newFeatures.filter((f) => f.trim() !== ''));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/admin/pricing/${pricingPlan.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        router.visit('/admin/pricing');
      },
    });
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} variant="outlined">
            Back to Pricing
          </Button>
          <Typography variant="h4" component="h1">
            Edit Pricing Plan
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Plan Name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
                fullWidth
              />

              <TextField
                label="Price"
                type="number"
                step="0.01"
                value={data.price}
                onChange={(e) => setData('price', e.target.value)}
                error={!!errors.price}
                helperText={errors.price}
                required
                fullWidth
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />

              <TextField
                label="Price Description"
                value={data.price_description}
                onChange={(e) => setData('price_description', e.target.value)}
                error={!!errors.price_description}
                helperText={errors.price_description || 'e.g., "per personalized trip plan"'}
                fullWidth
              />

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">Features</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddFeature}
                    size="small"
                    variant="outlined"
                  >
                    Add Feature
                  </Button>
                </Box>
                {features.map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Enter feature description"
                      size="small"
                    />
                    {features.length > 1 && (
                      <Button
                        onClick={() => handleRemoveFeature(index)}
                        color="error"
                        variant="outlined"
                        size="small"
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                  </Box>
                ))}
              </Box>

              <TextField
                label="Background Color"
                value={data.background_color}
                onChange={(e) => setData('background_color', e.target.value)}
                error={!!errors.background_color}
                helperText={errors.background_color || 'e.g., #FF6B6B or #FFFFFF'}
                fullWidth
                placeholder="#FFFFFF"
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
