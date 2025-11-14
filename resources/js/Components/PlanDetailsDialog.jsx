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
    Card,
    CardContent,
    Stack,
    TextField,
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
    Close,
    Receipt,
} from '@mui/icons-material';

const PlanDetailsDialog = ({ open, onClose, planId }) => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [actionComment, setActionComment] = useState('');
    const [actionError, setActionError] = useState(null);
    const [actionSuccess, setActionSuccess] = useState(null);
    const [actionSubmitting, setActionSubmitting] = useState(false);

    useEffect(() => {
        if (open && planId) {
            setActionSuccess(null);
            fetchPlanDetails();
        } else {
            // Reset state when dialog closes
            setPlan(null);
            setError(null);
            setLoading(false);
            setActionType(null);
            setActionComment('');
            setActionError(null);
            setActionSuccess(null);
            setActionSubmitting(false);
        }
    }, [open, planId]);

    const fetchPlanDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/specialist/appointments/plan/${planId}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to fetch plan details');
            }
            const data = await response.json();
            setPlan(data);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching plan details');
        } finally {
            setLoading(false);
        }
    };

    const actionLabels = {
        cancel: 'Cancel Appointment',
        complete: 'Mark as Completed',
    };

    const actionDescriptions = {
        cancel: 'Share a brief note with the traveler about why this appointment is being cancelled.',
        complete: 'Add a short summary for your records and the traveler.',
    };

    const isActionFormValid = actionComment.trim().length >= 5;

    const openActionPrompt = (type) => {
        setActionType(type);
        setActionComment('');
        setActionError(null);
        setActionSuccess(null);
    };

    const closeActionPrompt = () => {
        setActionType(null);
        setActionComment('');
        setActionError(null);
    };

    const handleStatusAction = async () => {
        if (!planId || !actionType) {
            return;
        }

        const comment = actionComment.trim();
        const currentAction = actionType;

        setActionSubmitting(true);
        setActionError(null);

        try {
            const endpoint =
                actionType === 'cancel'
                    ? `/specialist/appointments/plan/${planId}/cancel`
                    : `/specialist/appointments/plan/${planId}/complete`;

            const csrfToken = typeof document !== 'undefined'
                ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                : null;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ comment }),
            });

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(payload?.error || 'Failed to update appointment status.');
            }

            setPlan(payload);
            closeActionPrompt();
            setActionSuccess(
                currentAction === 'cancel'
                    ? 'Appointment cancelled successfully.'
                    : 'Appointment marked as completed.'
            );
        } catch (err) {
            setActionError(err.message || 'Failed to update appointment status.');
        } finally {
            setActionSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
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
                hour12: true,
            });
        } catch (e) {
            return dateString;
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } catch (e) {
            return dateString;
        }
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getPaymentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'in_progress':
                return 'info';
            case 'draft':
                return 'default';
            default:
                return 'default';
        }
    };

    const getAppointmentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'success';
            case 'completed':
                return 'info';
            case 'cancelled':
                return 'error';
            case 'draft':
            default:
                return 'default';
        }
    };

    const InfoField = ({ label, value, icon: Icon, children }) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {Icon && <Icon fontSize="small" />}
                {label}
            </Typography>
            {children || (
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {value || 'N/A'}
                </Typography>
            )}
        </Box>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                },
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: 1,
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Receipt />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Plan Details
                        </Typography>
                    </Box>
                    <Button
                        onClick={onClose}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                        aria-label="close"
                    >
                        <Close />
                    </Button>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        <Typography variant="body2">{error}</Typography>
                    </Alert>
                )}

                {actionSuccess && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        <Typography variant="body2">{actionSuccess}</Typography>
                    </Alert>
                )}

                {plan && !loading && (
                    <Stack spacing={3}>
                        {actionType && (
                            <Card variant="outlined" sx={{ borderColor: actionType === 'cancel' ? 'error.light' : 'success.light' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {actionLabels[actionType]}
                                        </Typography>
                                        <Chip
                                            label={actionType === 'cancel' ? 'Cancellation' : 'Completion'}
                                            color={actionType === 'cancel' ? 'error' : 'success'}
                                            size="small"
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {actionDescriptions[actionType]}
                                    </Typography>
                                    <TextField
                                        label="Comment"
                                        placeholder="Add at least 5 characters"
                                        value={actionComment}
                                        onChange={(event) => setActionComment(event.target.value)}
                                        multiline
                                        minRows={3}
                                        fullWidth
                                    />
                                    {actionError && (
                                        <Alert severity="error" sx={{ mt: 2 }}>
                                            <Typography variant="body2">{actionError}</Typography>
                                        </Alert>
                                    )}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                                        <Button onClick={closeActionPrompt} disabled={actionSubmitting}>
                                            Dismiss
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color={actionType === 'cancel' ? 'error' : 'success'}
                                            onClick={handleStatusAction}
                                            disabled={!isActionFormValid || actionSubmitting}
                                        >
                                            {actionSubmitting ? 'Saving...' : actionLabels[actionType]}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}

                        {/* Client Information Card */}
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Person color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Client Information
                                    </Typography>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <InfoField label="Full Name" value={`${plan.first_name || ''} ${plan.last_name || ''}`.trim()} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <InfoField label="Email" value={plan.email} icon={Email} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <InfoField label="Phone" value={plan.phone} icon={Phone} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <InfoField label="Plan Status">
                                            <Chip
                                                label={plan.status || 'draft'}
                                                color={getStatusColor(plan.status)}
                                                size="small"
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </InfoField>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Trip Details Card */}
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <LocationOn color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Trip Details
                                    </Typography>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <InfoField label="Destination" value={plan.destination} icon={LocationOn} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <InfoField label="Travel Dates" value={plan.travel_dates} icon={CalendarToday} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <InfoField label="Travelers" value={plan.travelers} icon={People} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <InfoField label="Plan Type">
                                            <Chip
                                                label={plan.selected_plan || plan.plan_type || 'N/A'}
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </InfoField>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Interests Card */}
                        {(plan.interests?.length > 0 || plan.other_interests) && (
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Favorite color="primary" />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Interests
                                        </Typography>
                                    </Box>
                                    {plan.interests?.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Selected Interests
                                            </Typography>
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
                                        <InfoField label="Other Interests" value={plan.other_interests} />
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Appointment Details Card */}
                        {(plan.appointment_start || plan.appointment_end) && (
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Schedule color="primary" />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Appointment Details
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <InfoField label="Date" value={formatDate(plan.appointment_start)} />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <InfoField label="Time">
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {plan.appointment_start && plan.appointment_end
                                                        ? `${formatTime(plan.appointment_start)} - ${formatTime(plan.appointment_end)}`
                                                        : 'N/A'}
                                                </Typography>
                                            </InfoField>
                                        </Grid>
                                        {plan.meeting_link && (
                                            <Grid size={{ xs: 12 }}>
                                                <InfoField label="Meeting Link">
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        href={plan.meeting_link}
                                                        target="_blank"
                                                        rel="noopener"
                                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                                    >
                                                        Join Google Meet
                                                    </Button>
                                                </InfoField>
                                            </Grid>
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}

                        {/* Payment Information Card */}
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Payment color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Payment Information
                                    </Typography>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <InfoField label="Payment Status">
                                            <Chip
                                                label={plan.payment_status || 'pending'}
                                                color={getPaymentStatusColor(plan.payment_status)}
                                                size="small"
                                                icon={plan.payment_status === 'paid' ? <CheckCircle fontSize="small" /> : undefined}
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </InfoField>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <InfoField label="Amount" value={formatCurrency(plan.amount)} />
                                    </Grid>
                                    {plan.paid_at && (
                                        <Grid size={{ xs: 12 }}>
                                            <InfoField label="Paid At" value={formatDateTime(plan.paid_at)} />
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Appointment Status Card */}
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Schedule color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Appointment Status &amp; History
                                    </Typography>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <InfoField label="Current Status">
                                            <Chip
                                                label={plan.appointment_status || 'draft'}
                                                color={getAppointmentStatusColor(plan.appointment_status)}
                                                size="small"
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </InfoField>
                                    </Grid>
                                    {plan.canceled_at && (
                                        <>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <InfoField label="Cancelled At" value={formatDateTime(plan.canceled_at)} />
                                            </Grid>
                                            {plan.canceled_by?.name && (
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <InfoField
                                                        label="Cancelled By"
                                                        value={`${plan.canceled_by.name}${plan.canceled_by.type ? ` (${plan.canceled_by.type})` : ''}`}
                                                    />
                                                </Grid>
                                            )}
                                            {plan.cancellation_comment && (
                                                <Grid size={{ xs: 12 }}>
                                                    <InfoField label="Cancellation Comment" value={plan.cancellation_comment} />
                                                </Grid>
                                            )}
                                        </>
                                    )}
                                    {plan.completed_at && (
                                        <>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <InfoField label="Completed At" value={formatDateTime(plan.completed_at)} />
                                            </Grid>
                                            {plan.completion_comment && (
                                                <Grid size={{ xs: 12 }}>
                                                    <InfoField label="Completion Comment" value={plan.completion_comment} />
                                                </Grid>
                                            )}
                                        </>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {/*{plan?.permissions?.can_cancel && (*/}
                    {/*    <Button*/}
                    {/*        variant="outlined"*/}
                    {/*        color="error"*/}
                    {/*        onClick={() => openActionPrompt('cancel')}*/}
                    {/*        disabled={actionSubmitting}*/}
                    {/*    >*/}
                    {/*        Cancel Appointment*/}
                    {/*    </Button>*/}
                    {/*)}*/}
                    {plan?.permissions?.can_complete && (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => openActionPrompt('complete')}
                            disabled={actionSubmitting}
                        >
                            Mark as Completed
                        </Button>
                    )}
                </Box>
                <Button
                    onClick={onClose}
                    variant="contained"
                    startIcon={<Close />}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PlanDetailsDialog;
