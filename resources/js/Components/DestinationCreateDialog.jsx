import React, {useState, useEffect} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import {Close as CloseIcon} from '@mui/icons-material';
import {router, usePage} from '@inertiajs/react';

const DestinationCreateDialog = ({open, onClose, onSuccess}) => {
    const {locations} = usePage().props;
    const [formData, setFormData] = useState({
        name: '',
        overview_title: '',
        overview: '',
        location_id: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setFormData({
                name: '',
                overview_title: '',
                overview: '',
                location_id: '',
            });
            setErrors({});
        }
    }, [open]);

    const handleChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
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
        setLoading(true);
        setErrors({});

        router.post('/admin/destinations', formData, {
            onSuccess: (page) => {
                setLoading(false);
                onSuccess(page.props.destination);
            },
            onError: (errors) => {
                setLoading(false);
                setErrors(errors);
            },
        });
    };

    const handleReset = () => {
        setFormData({
            name: '',
            overview_title: '',
            overview: '',
            location_id: '',
        });
        setErrors({});
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="h6">Create New Destination</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, pt: 1}}>
                        <TextField
                            label="Name *"
                            value={formData.name}
                            onChange={handleChange('name')}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            required
                        />
                        
                        <TextField
                            label="Overview Title *"
                            value={formData.overview_title}
                            onChange={handleChange('overview_title')}
                            error={!!errors.overview_title}
                            helperText={errors.overview_title}
                            fullWidth
                            required
                        />
                        
                        <TextField
                            label="Overview"
                            value={formData.overview}
                            onChange={handleChange('overview')}
                            error={!!errors.overview}
                            helperText={errors.overview}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        
                        <TextField
                            select
                            label="Location *"
                            value={formData.location_id}
                            onChange={handleChange('location_id')}
                            error={!!errors.location_id}
                            helperText={errors.location_id}
                            fullWidth
                            required
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="">Select a location</option>
                            {locations?.map((location) => (
                                <option key={location.id} value={location.id}>
                                    {location.name}, {location.city}, {location.country}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{px: 3, pb: 2}}>
                    <Button 
                        onClick={handleReset} 
                        variant="outlined"
                        disabled={loading}
                    >
                        Reset
                    </Button>
                    <Button 
                        onClick={onClose} 
                        variant="outlined"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default DestinationCreateDialog;
