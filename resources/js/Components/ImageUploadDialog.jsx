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
    Divider,
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import ImageUploader from './ImageUploader.jsx';

const ImageUploadDialog = ({ destination, editing, onClose }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imageData, setImageData] = useState([]);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Initialize data when editing
    useEffect(() => {
        if (editing) {
            // If editing a single image, convert it to array format
            setSelectedFiles([editing.url || null]);
            setImageData([{
                id: editing.id || Date.now(),
                name: editing.name || '',
                description: editing.description || '',
                image_type: 'gallery',
                isExisting: true
            }]);
        } else {
            // Start with empty arrays for new uploads
            setSelectedFiles([]);
            setImageData([]);
        }
    }, [editing]);

    const handleFilesChange = (files) => {
        console.log('Files changed:', files);
        console.log('Is Array:', Array.isArray(files));
        
        if (Array.isArray(files)) {
            setSelectedFiles(files);
            
            // Create image data entries for each file
            const newImageData = files.map((file, index) => ({
                id: Date.now() + index,
                name: file.name ? file.name.replace(/\.[^/.]+$/, "") : `Image ${index + 1}`,
                description: '',
                image_type: 'gallery',
                isExisting: false
            }));
            
            setImageData(newImageData);
        } else {
            setSelectedFiles([]);
            setImageData([]);
        }
        
        // Clear image error
        if (errors.images) {
            setErrors(prev => ({
                ...prev,
                images: null
            }));
        }
    };

    const handleInputChange = (index, field) => (event) => {
        const value = event.target.value;
        setImageData(prev => prev.map((img, i) => 
            i === index ? { ...img, [field]: value } : img
        ));
        
        // Clear error when user starts typing
        if (errors[`${index}_${field}`]) {
            setErrors(prev => ({
                ...prev,
                [`${index}_${field}`]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Check if images are selected for new uploads
        if (!editing && selectedFiles.length === 0) {
            newErrors.images = 'Please select at least one image to upload';
        }

        // Validate each image's metadata
        imageData.forEach((img, index) => {
            if (!img.name.trim()) {
                newErrors[`${index}_name`] = 'Image name is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        setSaving(true);
        setErrors({});

        // Check if we have existing images to update
        const existingImages = imageData.filter(img => img.isExisting);
        const newImages = imageData.filter(img => !img.isExisting);

        // Process existing images (individual updates)
        const updatePromises = existingImages.map(async (imgData) => {
            const url = `/admin/destinations/${destination.id}/images/${imgData.id}`;
            const file = selectedFiles.find((file, index) => imageData[index].id === imgData.id);

            if (file instanceof File) {
                // User selected a new image file, use FormData with POST
                const submitData = new FormData();
                submitData.append('name', imgData.name);
                submitData.append('description', imgData.description);
                submitData.append('image_type', imgData.image_type);
                submitData.append('image', file);
                submitData.append('_method', 'PUT');
                
                return router.post(url, submitData);
            } else {
                // No new image, just update metadata with regular object
                const updateData = {
                    name: imgData.name,
                    description: imgData.description,
                    image_type: imgData.image_type,
                };
                
                return router.put(url, updateData);
            }
        });

        // Process new images (single request with multiple images)
        let newImagesPromise = Promise.resolve();
        if (newImages.length > 0) {
            const url = `/admin/destinations/${destination.id}/images`;
            const submitData = new FormData();
            
            // Add names and descriptions arrays
            const names = newImages.map(img => img.name);
            const descriptions = newImages.map(img => img.description);
            
            names.forEach(name => submitData.append('names[]', name));
            descriptions.forEach(desc => submitData.append('descriptions[]', desc));
            
            // Add image files
            newImages.forEach((imgData, index) => {
                const file = selectedFiles.find((file, fileIndex) => imageData[fileIndex].id === imgData.id);
                if (file instanceof File) {
                    submitData.append('images[]', file);
                }
            });

            console.log('Submitting multiple new images:', Object.fromEntries(submitData.entries()));
            
            newImagesPromise = router.post(url, submitData);
        }

        // Execute all submissions
        Promise.all([...updatePromises, newImagesPromise])
            .then(() => {
                setSaving(false);
                onClose();
            })
            .catch((error) => {
                setSaving(false);
                console.error('Error submitting images:', error);
                // Handle errors if needed
            });
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
                {/* Image Selection */}
                <Grid size={{xs: 12}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {editing ? 'Edit Image' : 'Select Images'}
                            </Typography>
                            <ImageUploader
                                value={selectedFiles}
                                onChange={handleFilesChange}
                                error={!!errors.images}
                                helperText={errors.images}
                                label={editing ? "Change Image" : "Select Images"}
                                previewHeight={200}
                                previewWidth="100%"
                                multiple={!editing}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Image Details */}
                {imageData.length > 0 && (
                    <Grid size={{xs: 12}}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Image Details
                        </Typography>
                        {imageData.map((imgData, index) => (
                            <Card key={imgData.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                        Image {index + 1}
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12}} md={6}>
                                            <TextField
                                                label="Image Name"
                                                value={imgData.name}
                                                onChange={handleInputChange(index, 'name')}
                                                error={!!errors[`${index}_name`]}
                                                helperText={errors[`${index}_name`]}
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{xs: 12}} md={6}>
                                            <TextField
                                                label="Description"
                                                value={imgData.description}
                                                onChange={handleInputChange(index, 'description')}
                                                error={!!errors[`${index}_description`]}
                                                helperText={errors[`${index}_description`]}
                                                fullWidth
                                                multiline
                                                rows={2}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </Grid>
                )}

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
                            {saving ? 'Saving...' : (editing ? 'Update Image' : `Add ${imageData.length} Image${imageData.length > 1 ? 's' : ''}`)}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ImageUploadDialog;
