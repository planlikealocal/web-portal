import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Alert,
    Grid,
    Divider,
    Paper,
} from '@mui/material';
import { CheckCircle, CalendarToday, Download, Person, Email, Phone, LocationOn, AccessTime, Receipt } from '@mui/icons-material';
import WebsiteLayout from '../../../../Layouts/WebsiteLayout';

const PaymentSuccess = ({ plan }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleDownloadCalendar = () => {
        window.location.href = `/plans/${plan.id}/download-calendar`;
    };

    const handleDownloadInvoice = () => {
        window.location.href = `/plans/${plan.id}/download-invoice`;
    };

    return (
        <WebsiteLayout>
            <Box
                sx={{
                    mt: 10,
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                    py: 4,
                }}
            >
                <Box sx={{ maxWidth: 900, mx: 'auto', px: 2 }}>
                    {/* Success Message */}
                    <Alert
                        severity="success"
                        icon={<CheckCircle />}
                        sx={{ mb: 4 }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                            Payment Successful!
                        </Typography>
                        <Typography variant="body1">
                            Your appointment has been confirmed and payment has been processed successfully.
                        </Typography>
                    </Alert>

                    {/* Appointment Summary Card */}
                    <Card sx={{ mb: 3, boxShadow: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
                                Appointment Summary
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                {/* Client Information */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Person />
                                        Client Information
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Name
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {plan.first_name} {plan.last_name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Email fontSize="small" />
                                            Email
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {plan.email}
                                        </Typography>
                                    </Box>
                                    {plan.phone && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Phone fontSize="small" />
                                                Phone
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {plan.phone}
                                            </Typography>
                                        </Box>
                                    )}
                                </Grid>

                                {/* Appointment Details */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTime />
                                        Appointment Details
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Date & Time
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {formatDate(plan.appointment_start)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {formatTime(plan.appointment_start)} - {formatTime(plan.appointment_end)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Plan Type
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                                            {plan.selected_plan || plan.plan_type || 'N/A'}
                                        </Typography>
                                    </Box>
                                    {plan.destination && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <LocationOn fontSize="small" />
                                                Destination
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {plan.destination}
                                            </Typography>
                                        </Box>
                                    )}
                                    {plan.specialist && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Specialist
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {plan.specialist.full_name}
                                            </Typography>
                                            {plan.specialist.location && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    {plan.specialist.location}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            {/* Download Section */}
                            <Box sx={{ textAlign: 'center', mt: 4 }}>
                                <Grid container spacing={2} justifyContent="center">
                                    {/* Calendar Download */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            <CalendarToday />
                                            Add to Calendar
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            startIcon={<Download />}
                                            onClick={handleDownloadCalendar}
                                            sx={{ py: 1.5 }}
                                        >
                                            Download Calendar
                                        </Button>
                                    </Grid>

                                    {/* Invoice Download */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            <Receipt />
                                            Download Invoice
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            fullWidth
                                            startIcon={<Download />}
                                            onClick={handleDownloadInvoice}
                                            sx={{ py: 1.5 }}
                                        >
                                            Download Invoice
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Paper sx={{ p: 3, bgcolor: 'background.paper', textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            A confirmation email has been sent to <strong>{plan.email}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            If you have any questions or need to make changes, please contact us.
                        </Typography>
                    </Paper>
                </Box>
            </Box>
        </WebsiteLayout>
    );
};

export default PaymentSuccess;

