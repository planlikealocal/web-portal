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
} from '@mui/material';
import { router } from '@inertiajs/react';

const SeasonDialog = ({ open, onClose, destination, editing = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        duration: '',
        description: '',
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
                    duration: editing.duration || '',
                    description: editing.description || '',
                    status: editing.status !== undefined ? editing.status : true,
                });
            } else {
                setFormData({
                    name: '',
                    duration: '',
                    description: '',
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        const submitData = {
            name: formData.name,
            duration: formData.duration,
            description: formData.description,
            status: formData.status,
        };

        if (editing) {
            // Update existing season
            router.put(`/admin/destinations/${destination.id}/seasons/${editing.id}`, submitData, {
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
            // Create new season
            router.post(`/admin/destinations/${destination.id}/seasons`, submitData, {
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

    const handleClose = () => {
        if (!saving) {
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                {editing ? 'Edit Season' : 'Add New Season'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="Season Name"
                            value={formData.name}
                            onChange={handleChange('name')}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            required
                        />
                        
                        <TextField
                            label="Duration"
                            value={formData.duration}
                            onChange={handleChange('duration')}
                            error={!!errors.duration}
                            helperText={errors.duration || 'e.g., "March - May", "Summer", "3 months"'}
                            fullWidth
                            required
                        />
                        
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={handleChange('description')}
                            error={!!errors.description}
                            helperText={errors.description}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.status}
                                    onChange={handleChange('status')}
                                    color="primary"
                                />
                            }
                            label="Active Season"
                        />
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
                    >
                        {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SeasonDialog;
