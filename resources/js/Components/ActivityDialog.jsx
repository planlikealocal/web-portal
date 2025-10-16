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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import ImageUploader from './ImageUploader.jsx';

const ActivityDialog = ({ open, onClose, destination, editing }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [activityData, setActivityData] = useState([]);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Initialize data when editing
    useEffect(() => {
        if (editing) {
            // If editing a single activity, convert it to array format
            setSelectedFiles([editing.image_url || null]);
            setActivityData([{
                id: editing.id || Date.now(),
                name: editing.name || '',
                isExisting: true
            }]);
        } else {
            // Start with empty arrays for new uploads
            setSelectedFiles([]);
            setActivityData([]);
        }
    }, [editing, open]);

    const handleFilesChange = (files) => {
        console.log('Files changed:', files);
        console.log('Is Array:', Array.isArray(files));
        
        if (Array.isArray(files)) {
            setSelectedFiles(files);
            
            // Create activity data entries for each file
            const newActivityData = files.map((file, index) => ({
                id: Date.now() + index,
                name: file.name ? file.name.replace(/\.[^/.]+$/, "") : `Activity ${index + 1}`,
                isExisting: false
            }));
            
            setActivityData(newActivityData);
        } else {
            setSelectedFiles([]);
            setActivityData([]);
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
        setActivityData(prev => prev.map((activity, i) => 
            i === index ? { ...activity, [field]: value } : activity
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

        // Validate each activity's metadata
        activityData.forEach((activity, index) => {
            if (!activity.name.trim()) {
                newErrors[`${index}_name`] = 'Activity name is required';
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

        // Check if we have existing activities to update
        const existingActivities = activityData.filter(activity => activity.isExisting);
        const newActivities = activityData.filter(activity => !activity.isExisting);

        // Process existing activities (individual updates)
        const updatePromises = existingActivities.map(async (activityData) => {
            const url = `/admin/destinations/${destination.id}/activities/${activityData.id}`;
            const file = selectedFiles.find((file, index) => activityData[index].id === activityData.id);

            if (file instanceof File) {
                // User selected a new image file, use FormData with POST
                const submitData = new FormData();
                submitData.append('name', activityData.name);
                submitData.append('image', file);
                submitData.append('_method', 'PUT');
                
                return router.post(url, submitData);
            } else {
                // No new image, just update metadata with regular object
                const updateData = {
                    name: activityData.name,
                };
                
                return router.put(url, updateData);
            }
        });

        // Process new activities (single request with multiple activities)
        let newActivitiesPromise = Promise.resolve();
        if (newActivities.length > 0) {
            const url = `/admin/destinations/${destination.id}/activities`;
            const submitData = new FormData();
            
            // Add names array
            const names = newActivities.map(activity => activity.name);
            names.forEach(name => submitData.append('names[]', name));
            
            // Add image files
            newActivities.forEach((activityData, index) => {
                const file = selectedFiles.find((file, fileIndex) => activityData[fileIndex].id === activityData.id);
                if (file instanceof File) {
                    submitData.append('images[]', file);
                }
            });

            console.log('Submitting multiple new activities:', Object.fromEntries(submitData.entries()));
            
            newActivitiesPromise = router.post(url, submitData);
        }

        // Execute all submissions
        Promise.all([...updatePromises, newActivitiesPromise])
            .then(() => {
                setSaving(false);
                onClose();
            })
            .catch((error) => {
                setSaving(false);
                console.error('Error submitting activities:', error);
                // Handle errors if needed
            });
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                {editing ? 'Edit Activity' : 'Add New Activities'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    <Grid container spacing={3}>
                        {/* Image Selection */}
                        <Grid size={{xs: 12}}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        {editing ? 'Edit Activity Image' : 'Select Activity Images'}
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

                        {/* Activity Details */}
                        {activityData.length > 0 && (
                            <Grid size={{xs: 12}}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Activity Details
                                </Typography>
                                {activityData.map((activityData, index) => (
                                    <Card key={activityData.id} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                                Activity {index + 1}
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={{xs: 12}}>
                                                    <TextField
                                                        label="Activity Name"
                                                        value={activityData.name}
                                                        onChange={handleInputChange(index, 'name')}
                                                        error={!!errors[`${index}_name`]}
                                                        helperText={errors[`${index}_name`]}
                                                        fullWidth
                                                        required
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
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
                    {saving ? 'Saving...' : (editing ? 'Update Activity' : `Add ${activityData.length} Activit${activityData.length > 1 ? 'ies' : 'y'}`)}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ActivityDialog;
