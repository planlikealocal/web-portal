import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Chip,
    Divider,
    Grid,
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    LocationOn,
    CalendarToday,
    People,
    Favorite,
    Payment,
    CheckCircle,
    Schedule,
} from '@mui/icons-material';

const PlanDetailsDialog = ({ open, onClose, planId }) => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open && planId) {
            fetchPlanDetails();
        } else {
            setPlan(null);
            setError(null);
        }
    }, [open, planId]);

    const fetchPlanDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/specialist/appointments/plan/${planId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch plan details');
            }
            const data = await response.json();
            setPlan(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (e) {
            return dateString;
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (e) {
            return dateString;
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday color="primary" />
                    <Typography variant="h6">Plan Details</Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {plan && !loading && (
                    <Box>
                        {/* Client Information */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person />
                                Client Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {plan.first_name} {plan.last_name}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Email fontSize="small" />
                                        Email
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {plan.email || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Phone fontSize="small" />
                                        Phone
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {plan.phone || 'N/A'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Trip Details */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn />
                                Trip Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Destination
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {plan.destination || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CalendarToday fontSize="small" />
                                        Travel Dates
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {plan.travel_dates || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <People fontSize="small" />
                                        Travelers
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {plan.travelers || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Plan Type
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                                        {plan.selected_plan || plan.plan_type || 'N/A'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Interests */}
                        {(plan.interests?.length > 0 || plan.other_interests) && (
                            <>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Favorite />
                                        Interests
                                    </Typography>
                                    {plan.interests?.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {plan.interests.map((interest, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={interest}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                    {plan.other_interests && (
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Other Interests
                                            </Typography>
                                            <Typography variant="body1">
                                                {plan.other_interests}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                                <Divider sx={{ my: 3 }} />
                            </>
                        )}

                        {/* Appointment Details */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Schedule />
                                Appointment Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Date
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {formatDate(plan.appointment_start)}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Time
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {plan.appointment_start && plan.appointment_end
                                            ? `${formatTime(plan.appointment_start)} - ${formatTime(plan.appointment_end)}`
                                            : 'N/A'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Payment Information */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Payment />
                                Payment Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Status
                                    </Typography>
                                    <Box sx={{ mt: 0.5 }}>
                                        <Chip
                                            label={plan.payment_status || 'pending'}
                                            color={getPaymentStatusColor(plan.payment_status)}
                                            size="small"
                                            icon={plan.payment_status === 'paid' ? <CheckCircle /> : undefined}
                                        />
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Amount
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {formatCurrency(plan.amount)}
                                    </Typography>
                                </Grid>
                                {plan.paid_at && (
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Paid At
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {formatDate(plan.paid_at)} {formatTime(plan.paid_at)}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PlanDetailsDialog;

