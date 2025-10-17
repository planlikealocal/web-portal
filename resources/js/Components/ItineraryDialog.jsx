import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import ImageUploader from './ImageUploader.jsx';

const ItineraryDialog = ({ destination, editing, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'draft',
        image: null,
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Initialize data when editing
    useEffect(() => {
        if (editing) {
            setFormData({
                title: editing.title || '',
                description: editing.description || '',
                status: editing.status || 'draft',
                image: editing.image_url || null,
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'draft',
                image: null,
            });
        }
    }, [editing]);

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const handleImageChange = (file) => {
        setFormData(prev => ({
            ...prev,
            image: file
        }));
        
        // Clear image error
        if (errors.image) {
            setErrors(prev => ({
                ...prev,
                image: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        // For new itineraries, image is required
        if (!editing && !formData.image) {
            newErrors.image = 'Image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        setSaving(true);
        setErrors({});

        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('description', formData.description);
        submitData.append('status', formData.status);
        
        if (formData.image instanceof File) {
            submitData.append('image', formData.image);
        }

        if (editing) {
            // Update existing itinerary
            submitData.append('_method', 'PUT');
            router.post(`/admin/destinations/${destination.id}/itineraries/${editing.id}`, submitData, {
                onSuccess: () => {
                    setSaving(false);
                    onClose();
                },
                onError: (errors) => {
                    setSaving(false);
                    setErrors(errors);
                },
            });
        } else {
            // Create new itinerary
            router.post(`/admin/destinations/${destination.id}/itineraries`, submitData, {
                onSuccess: () => {
                    setSaving(false);
                    onClose();
                },
                onError: (errors) => {
                    setSaving(false);
                    setErrors(errors);
                },
            });
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
                {/* Image Upload */}
                <Grid size={{xs: 12}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {editing ? 'Update Image' : 'Upload Image'}
                            </Typography>
                            <ImageUploader
                                value={formData.image}
                                onChange={handleImageChange}
                                error={!!errors.image}
                                helperText={errors.image}
                                label={editing ? "Change Image" : "Select Image"}
                                previewHeight={200}
                                previewWidth="100%"
                                multiple={false}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Form Fields */}
                <Grid size={{xs: 12}}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Itinerary Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12}}>
                            <TextField
                                label="Title"
                                value={formData.title}
                                onChange={handleInputChange('title')}
                                error={!!errors.title}
                                helperText={errors.title}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid size={{xs: 12}}>
                            <TextField
                                label="Description"
                                value={formData.description}
                                onChange={handleInputChange('description')}
                                error={!!errors.description}
                                helperText={errors.description}
                                fullWidth
                                multiline
                                rows={4}
                                required
                            />
                        </Grid>
                        <Grid size={{xs: 12}}>
                            <FormControl fullWidth error={!!errors.status}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={formData.status}
                                    onChange={handleInputChange('status')}
                                    label="Status"
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </Select>
                                {errors.status && (
                                    <Typography variant="caption" color="error" sx={{mt: 0.5, ml: 1.5}}>
                                        {errors.status}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Action Buttons */}
                <Grid size={{xs: 12}}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                            onClick={handleSubmit}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : (editing ? 'Update Itinerary' : 'Add Itinerary')}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ItineraryDialog;
