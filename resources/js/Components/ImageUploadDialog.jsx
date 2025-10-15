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
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import ImageUploader from './ImageUploader.jsx';

const ImageUploadDialog = ({ destination, editing, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_type: 'gallery', // Always gallery
        image: null,
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Image type is always gallery

    // Initialize form data when editing
    useEffect(() => {
        if (editing) {
            setFormData({
                name: editing.name || '',
                description: editing.description || '',
                image_type: 'gallery', // Always gallery
                image: editing.url || null, // Show existing image URL for preview
            });
        } else {
            setFormData({
                name: '',
                description: '',
                image_type: 'gallery', // Always gallery
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
        console.log('Image changed:', file);
        console.log('Is File object:', file instanceof File);
        
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

        if (!formData.name.trim()) {
            newErrors.name = 'Image name is required';
        }

        // Only require image for new uploads, not when editing
        if (!editing && !formData.image) {
            newErrors.image = 'Please select an image to upload';
        }

        // Image type is always gallery, no validation needed

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        setSaving(true);
        setErrors({});

        const url = editing 
            ? `/admin/destinations/${destination.id}/images/${editing.id}`
            : `/admin/destinations/${destination.id}/images`;

        // Debug logging
        console.log('Image upload URL:', url);
        console.log('Editing:', editing);
        console.log('Form data state:', formData);

        // Use appropriate method for each action
        if (editing) {
            // Check if user wants to change the image
            if (formData.image instanceof File) {
                // User selected a new image file, use FormData with POST
                const submitData = new FormData();
                submitData.append('name', formData.name);
                submitData.append('description', formData.description);
                submitData.append('image_type', formData.image_type);
                submitData.append('image', formData.image);
                submitData.append('_method', 'PUT');
                
                console.log('Update with new image:', Object.fromEntries(submitData.entries()));
                
                router.post(url, submitData, {
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
                // No new image, just update metadata with regular object
                const updateData = {
                    name: formData.name,
                    description: formData.description,
                    image_type: formData.image_type,
                };
                
                console.log('Update metadata only:', updateData);
                
                router.put(url, updateData, {
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
        } else {
            // For new uploads, use FormData (with file upload)
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('image_type', formData.image_type);
            
            // Only append image if it's a File object (new upload)
            if (formData.image instanceof File) {
                submitData.append('image', formData.image);
            }
            
            console.log('New image data entries:', Object.fromEntries(submitData.entries()));
            
            router.post(url, submitData, {
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
                {/* Image Preview */}
                <Grid size={{xs: 12}} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Image Preview
                            </Typography>
                            <ImageUploader
                                value={formData.image}
                                onChange={handleImageChange}
                                error={!!errors.image}
                                helperText={errors.image}
                                label="Select Image"
                                previewHeight={200}
                                previewWidth="100%"
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Form Fields */}
                <Grid size={{xs: 12}} md={6}>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12}}>
                            <TextField
                                label="Image Name"
                                value={formData.name}
                                onChange={handleInputChange('name')}
                                error={!!errors.name}
                                helperText={errors.name}
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
                                rows={3}
                            />
                        </Grid>

                        {/* Image type is always gallery, no input needed */}
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
                            {saving ? 'Saving...' : (editing ? 'Update Image' : 'Add Image')}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ImageUploadDialog;
