import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    TextField,
    Grid,
    IconButton,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import ImageUploader from './ImageUploader.jsx';

const ActivityBulkUploadDialog = ({ open, onClose, destination }) => {
    const [activities, setActivities] = useState([]);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Initialize with one empty activity
    useEffect(() => {
        if (open) {
            setActivities([{
                id: Date.now(),
                name: '',
                description: '',
                image: null,
                status: true,
            }]);
            setErrors({});
        }
    }, [open]);

    const addActivity = () => {
        setActivities(prev => [...prev, {
            id: Date.now() + Math.random(),
            name: '',
            description: '',
            image: null,
            status: true,
        }]);
    };

    const removeActivity = (id) => {
        if (activities.length > 1) {
            setActivities(prev => prev.filter(activity => activity.id !== id));
        }
    };

    const updateActivity = (id, field, value) => {
        setActivities(prev => prev.map(activity => 
            activity.id === id 
                ? { ...activity, [field]: value }
                : activity
        ));
    };

    const handleImageChange = (id, file) => {
        updateActivity(id, 'image', file);
    };

    const validateActivities = () => {
        const newErrors = {};
        
        activities.forEach((activity, index) => {
            if (!activity.name.trim()) {
                newErrors[`activities.${index}.name`] = 'Activity name is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateActivities()) {
            return;
        }

        setSaving(true);
        setErrors({});

        const submitData = new FormData();
        
        // Add activity data
        activities.forEach((activity, index) => {
            submitData.append(`names[${index}]`, activity.name);
            submitData.append(`descriptions[${index}]`, activity.description || '');
            submitData.append(`status[${index}]`, activity.status ? 1 : 0);
            
            // Add image if present
            if (activity.image instanceof File) {
                submitData.append(`images[${index}]`, activity.image);
            }
        });

        const url = `/admin/destinations/${destination.id}/activities/bulk`;

        router.post(url, submitData, {
            onSuccess: () => {
                setSaving(false);
                onClose();
            },
            onError: (errors) => {
                setSaving(false);
                setErrors(errors);
            },
            forceFormData: true,
        });
    };

    const handleClose = () => {
        if (!saving) {
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    Bulk Upload Activities
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Activities ({activities.length})
                            </Typography>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={addActivity}
                                variant="outlined"
                                size="small"
                            >
                                Add Activity
                            </Button>
                        </Box>

                        <Grid container spacing={2}>
                            {activities.map((activity, index) => (
                                <Grid item xs={12} md={6} key={activity.id}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="subtitle1">
                                                    Activity {index + 1}
                                                </Typography>
                                                {activities.length > 1 && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => removeActivity(activity.id)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>

                                            <TextField
                                                fullWidth
                                                label="Activity Name"
                                                value={activity.name}
                                                onChange={(e) => updateActivity(activity.id, 'name', e.target.value)}
                                                error={!!errors[`activities.${index}.name`]}
                                                helperText={errors[`activities.${index}.name`]}
                                                margin="normal"
                                                required
                                                size="small"
                                            />

                                            <TextField
                                                fullWidth
                                                label="Description"
                                                value={activity.description}
                                                onChange={(e) => updateActivity(activity.id, 'description', e.target.value)}
                                                margin="normal"
                                                multiline
                                                rows={2}
                                                size="small"
                                            />

                                            <Box sx={{ mt: 2, mb: 1 }}>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    Activity Image (Optional)
                                                </Typography>
                                                <ImageUploader
                                                    value={activity.image}
                                                    onChange={(file) => handleImageChange(activity.id, file)}
                                                    label="Upload Image"
                                                    previewHeight={100}
                                                    previewWidth={150}
                                                />
                                            </Box>

                                            <Box sx={{ mt: 1 }}>
                                                <Chip
                                                    label={activity.status ? 'Active' : 'Inactive'}
                                                    color={activity.status ? 'success' : 'default'}
                                                    size="small"
                                                    onClick={() => updateActivity(activity.id, 'status', !activity.status)}
                                                    sx={{ cursor: 'pointer' }}
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        disabled={saving}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saving}
                        color="primary"
                        startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <UploadIcon />}
                    >
                        {saving ? 'Uploading...' : `Upload ${activities.length} Activities`}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ActivityBulkUploadDialog;
