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
    Alert,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Slide } from '@mui/material';
import { router, usePage } from '@inertiajs/react';
import ReCAPTCHA from 'react-google-recaptcha';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ContactUsDialog = ({ open, onClose }) => {
    const { recaptchaSiteKey } = usePage().props;
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        topic: 'Scheduling',
        message: '',
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
                topic: 'Scheduling',
                message: '',
            });
            setErrors({});
            setRecaptchaValue(null);
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
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

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
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

        router.post('/contact', {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            topic: formData.topic,
            message: formData.message,
            recaptcha_token: recaptchaValue,
        }, {
            onSuccess: () => {
                setSubmitting(false);
                onClose();
                // Show success message - the backend will handle this via flash message
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
            fullWidth
            maxWidth="sm"
            fullScreen
            PaperProps={{
                sx: {
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    m: 0,
                    maxHeight: '600px',
                    borderRadius: '16px 16px 0 0',
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 1,
            }}>
                <Typography variant="h6" component="div">
                    Contact Us
                </Typography>
                <IconButton
                    onClick={handleClose}
                    disabled={submitting}
                    size="small"
                    sx={{ color: 'text.secondary' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 2, px: 50, pb: 2}}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            required
                            value={formData.first_name}
                            onChange={handleChange('first_name')}
                            error={!!errors.first_name}
                            helperText={errors.first_name}
                            disabled={submitting}
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            required
                            value={formData.last_name}
                            onChange={handleChange('last_name')}
                            error={!!errors.last_name}
                            helperText={errors.last_name}
                            disabled={submitting}
                        />
                    </Box>

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

                    <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
                        <FormLabel component="legend" sx={{ mb: 1 }}>
                            Topic
                        </FormLabel>
                        <RadioGroup
                            row
                            value={formData.topic}
                            onChange={handleChange('topic')}
                        >
                            <FormControlLabel
                                value="Scheduling"
                                control={<Radio />}
                                label="Scheduling"
                                disabled={submitting}
                            />
                            <FormControlLabel
                                value="Specialist Service"
                                control={<Radio />}
                                label="Specialist Service"
                                disabled={submitting}
                            />
                            <FormControlLabel
                                value="Billing"
                                control={<Radio />}
                                label="Billing"
                                disabled={submitting}
                            />
                            <FormControlLabel
                                value="Other"
                                control={<Radio />}
                                label="Other"
                                disabled={submitting}
                            />
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="How can we help?"
                        multiline
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleChange('message')}
                        error={!!errors.message}
                        helperText={errors.message}
                        disabled={submitting}
                        sx={{ mb: 2 }}
                    />

                    <Box sx={{ mb: 2 }}>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={recaptchaSiteKey || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                            onChange={handleRecaptchaChange}
                        />
                        {errors.recaptcha && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                {errors.recaptcha}
                            </Typography>
                        )}
                        {!recaptchaSiteKey && import.meta.env.DEV && (
                            <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block', fontSize: '0.7rem' }}>
                                ⚠️ Development mode: Using test reCAPTCHA key. Configure RECAPTCHA_SITE_KEY in .env for production.
                            </Typography>
                        )}
                    </Box>

                    {errors.message && typeof errors.message === 'string' && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errors.message}
                        </Alert>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1 }}>
                <Button
                    onClick={handleClose}
                    disabled={submitting}
                    color="inherit"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={20} /> : null}
                >
                    {submitting ? 'Submitting...' : 'Submit'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContactUsDialog;

