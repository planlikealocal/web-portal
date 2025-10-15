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
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        home_image: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setFormData({
                name: '',
                description: '',
                home_image: '',
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
            description: '',
            home_image: '',
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
                            label="Description *"
                            value={formData.description}
                            onChange={handleChange('description')}
                            error={!!errors.description}
                            helperText={errors.description}
                            fullWidth
                            multiline
                            rows={3}
                            required
                        />
                        
                        <TextField
                            label="Home Image URL"
                            value={formData.home_image}
                            onChange={handleChange('home_image')}
                            error={!!errors.home_image}
                            helperText={errors.home_image}
                            fullWidth
                        />
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
