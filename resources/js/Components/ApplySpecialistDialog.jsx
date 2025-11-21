import React, { useState, useEffect, useRef } from 'react';
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
    Grid,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Slide } from '@mui/material';
import { router, usePage } from '@inertiajs/react';
import ReCAPTCHA from 'react-google-recaptcha';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ApplySpecialistDialog = ({ open, onClose }) => {
    const { recaptchaSiteKey } = usePage().props;
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        city_state: '',
        phone: '',
        destination_known_for: '',
        qualified_expert: '',
        best_way_to_contact: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const recaptchaRef = useRef(null);

    // Debug: Log the site key (remove in production)
    useEffect(() => {
        if (open) {
            console.log('reCAPTCHA Site Key:', recaptchaSiteKey || 'Not configured');
        }
    }, [open, recaptchaSiteKey]);

    useEffect(() => {
        if (open) {
            // Reset form when dialog opens
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                city_state: '',
                phone: '',
                destination_known_for: '',
                qualified_expert: '',
                best_way_to_contact: '',
            });
            setErrors({});
            setRecaptchaValue(null);
            
            // Reset reCAPTCHA after a small delay to ensure dialog is fully rendered
            setTimeout(() => {
                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                }
            }, 100);
        }
    }, [open]);

    const handleChange = (field) => (event) => {
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

    const handleRecaptchaChange = (value) => {
        setRecaptchaValue(value);
        if (errors.recaptcha) {
            setErrors(prev => ({
                ...prev,
                recaptcha: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        }
        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.city_state.trim()) {
            newErrors.city_state = 'City & State is required';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        }
        if (!formData.destination_known_for.trim()) {
            newErrors.destination_known_for = 'This field is required';
        }
        if (!formData.qualified_expert.trim()) {
            newErrors.qualified_expert = 'This field is required';
        }
        if (!formData.best_way_to_contact.trim()) {
            newErrors.best_way_to_contact = 'This field is required';
        }
        if (!recaptchaValue) {
            newErrors.recaptcha = 'Please complete the reCAPTCHA verification';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setErrors({});

        router.post('/specialist-applications', {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            city_state: formData.city_state,
            phone: formData.phone,
            destination_known_for: formData.destination_known_for,
            qualified_expert: formData.qualified_expert,
            best_way_to_contact: formData.best_way_to_contact,
            recaptcha_token: recaptchaValue,
        }, {
            onSuccess: () => {
                setSubmitting(false);
                onClose();
            },
            onError: (errors) => {
                setSubmitting(false);
                setErrors(errors);
                // Reset reCAPTCHA on error
                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                    setRecaptchaValue(null);
                }
            },
        });
    };

    const handleClose = () => {
        if (!submitting) {
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6" component="div">
                    Apply for a specialist
                </Typography>
                <IconButton
                    onClick={handleClose}
                    disabled={submitting}
                    sx={{ color: 'text.secondary' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 2, px: 3, pb: 2 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        {/* Left Column */}
                        <Grid size={{xs: 12, md: 6}}>
                            <TextField
                                fullWidth
                                label="First Name"
                                required
                                value={formData.first_name}
                                onChange={handleChange('first_name')}
                                error={!!errors.first_name}
                                helperText={errors.first_name}
                                disabled={submitting}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange('email')}
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={submitting}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="What is this destination known for?"
                                required
                                multiline
                                rows={3}
                                value={formData.destination_known_for}
                                onChange={handleChange('destination_known_for')}
                                error={!!errors.destination_known_for}
                                helperText={errors.destination_known_for}
                                disabled={submitting}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="What make you a qualified expert?"
                                required
                                multiline
                                rows={3}
                                value={formData.qualified_expert}
                                onChange={handleChange('qualified_expert')}
                                error={!!errors.qualified_expert}
                                helperText={errors.qualified_expert}
                                disabled={submitting}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Phone"
                                required
                                value={formData.phone}
                                onChange={handleChange('phone')}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                disabled={submitting}
                            />
                        </Grid>

                        {/* Right Column */}
                        <Grid size={{xs: 12, md: 6}}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                required
                                value={formData.last_name}
                                onChange={handleChange('last_name')}
                                error={!!errors.last_name}
                                helperText={errors.last_name}
                                disabled={submitting}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="City & State"
                                required
                                value={formData.city_state}
                                onChange={handleChange('city_state')}
                                error={!!errors.city_state}
                                helperText={errors.city_state}
                                disabled={submitting}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Best way to contact"
                                required
                                multiline
                                rows={4}
                                value={formData.best_way_to_contact}
                                onChange={handleChange('best_way_to_contact')}
                                error={!!errors.best_way_to_contact}
                                helperText={errors.best_way_to_contact}
                                disabled={submitting}
                            />
                        </Grid>
                    </Grid>

                    {/* reCAPTCHA */}
                    <Box sx={{ mt: 3, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {open && (
                            <ReCAPTCHA
                                key={open ? 'recaptcha-open' : 'recaptcha-closed'}
                                ref={recaptchaRef}
                                sitekey={recaptchaSiteKey || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                                onChange={handleRecaptchaChange}
                            />
                        )}
                        {errors.recaptcha && (
                            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block', textAlign: 'center', width: '100%' }}>
                                {errors.recaptcha}
                            </Typography>
                        )}
                        {!recaptchaSiteKey && import.meta.env.DEV && (
                            <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block', fontSize: '0.7rem', textAlign: 'center' }}>
                                ⚠️ Development mode: Using test reCAPTCHA key. Configure RECAPTCHA_SITE_KEY in .env for production.
                            </Typography>
                        )}
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    onClick={handleClose}
                    disabled={submitting}
                    sx={{ color: 'text.secondary' }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={submitting}
                    sx={{
                        bgcolor: 'grey.800',
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'grey.900',
                        },
                    }}
                >
                    {submitting ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Submitting...
                        </>
                    ) : (
                        'Apply'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ApplySpecialistDialog;

