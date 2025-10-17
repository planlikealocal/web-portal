import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Switch,
    FormControlLabel,
    CircularProgress,
} from '@mui/material';
import { router } from '@inertiajs/react';
import ImageUploader from './ImageUploader.jsx';

const ActivityDialog = ({ open, onClose, destination, editing = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
        status: true,
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Reset form when dialog opens/closes or editing changes
    useEffect(() => {
        if (open) {
            if (editing) {
                setFormData({
                    name: editing.name || '',
                    description: editing.description || '',
                    image: editing.image_url || null,
                    status: editing.status !== undefined ? editing.status : true,
                });
            } else {
                setFormData({
                    name: '',
                    description: '',
                    image: null,
                    status: true,
                });
            }
            setErrors({});
        }
    }, [open, editing]);

    const handleChange = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
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

        // Clear image error when user selects a file
        if (errors.image) {
            setErrors(prev => ({
                ...prev,
                image: null
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('description', formData.description || '');
        submitData.append('status', formData.status ? 1 : 0);
        
        // Only append image if it's a new file (not existing URL)
        if (formData.image instanceof File) {
            submitData.append('image', formData.image);
        }

        const url = editing 
            ? `/admin/destinations/${destination.id}/activities/${editing.id}`
            : `/admin/destinations/${destination.id}/activities`;

        // For PUT requests with FormData, we need to use POST with _method
        if (editing) {
            submitData.append('_method', 'PUT');
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
        } else {
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
        }
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
            maxWidth="md"
            fullWidth
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {editing ? 'Edit Activity' : 'Add New Activity'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField
                            fullWidth
                            label="Activity Name"
                            value={formData.name}
                            onChange={handleChange('name')}
                            error={!!errors.name}
                            helperText={errors.name}
                            margin="normal"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            value={formData.description}
                            onChange={handleChange('description')}
                            error={!!errors.description}
                            helperText={errors.description}
                            margin="normal"
                            multiline
                            rows={4}
                            required
                        />

                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Activity Image
                            </Typography>
                            <ImageUploader
                                value={formData.image}
                                onChange={handleImageChange}
                                error={!!errors.image}
                                helperText={errors.image}
                                label="Upload Activity Image"
                                previewHeight={200}
                            />
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.status}
                                        onChange={handleChange('status')}
                                        color="primary"
                                    />
                                }
                                label="Active Activity"
                            />
                        </Box>
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
                        startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
                    >
                        {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ActivityDialog;
