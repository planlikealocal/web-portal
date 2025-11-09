import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Alert,
    CircularProgress,
    Grid,
    Divider,
    Paper,
} from '@mui/material';
import { Payment, CreditCard, CheckCircle } from '@mui/icons-material';
import { loadStripe } from '@stripe/stripe-js';

const Step5Payment = ({ plan, onPaymentSuccess }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stripe, setStripe] = useState(null);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        // Initialize Stripe and automatically redirect to payment
        const initStripeAndRedirect = async () => {
            // If payment is already completed, don't redirect
            if (plan.payment_status === 'paid') {
                setLoading(false);
                return;
            }

            try {
                const stripeKey = document.querySelector('meta[name="stripe-key"]')?.getAttribute('content');
                if (!stripeKey) {
                    throw new Error('Stripe key not found');
                }

                const stripeInstance = await loadStripe(stripeKey);
                setStripe(stripeInstance);

                // Automatically create checkout session and redirect
                setRedirecting(true);
                
                const response = await fetch(`/plans/${plan.id}/create-checkout-session`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    credentials: 'same-origin',
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to create checkout session');
                }

                // Redirect to Stripe Checkout
                const result = await stripeInstance.redirectToCheckout({
                    sessionId: data.sessionId,
                });

                if (result.error) {
                    throw new Error(result.error.message);
                }
            } catch (err) {
                console.error('Payment initialization error:', err);
                setError(err.message || 'Failed to initialize payment. Please try again.');
                setLoading(false);
                setRedirecting(false);
            }
        };

        initStripeAndRedirect();
    }, [plan.id, plan.payment_status]);

    // Calculate plan price based on plan type
    const getPlanPrice = () => {
        const planType = plan.selected_plan || plan.plan_type || 'pathfinder';
        const prices = plan.plan_prices || {
            'explore': 99,
            'pathfinder': 149,
            'premium': 249,
        };
        return prices[planType] || prices['pathfinder'] || 149;
    };

    const price = getPlanPrice();
    const total = price;


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

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 4, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Payment fontSize="large" />
                Complete Payment
            </Typography>

            {loading && !redirecting && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                        Loading payment...
                    </Typography>
                </Box>
            )}

            {redirecting && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} />
                        Redirecting to secure payment page...
                    </Typography>
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
                    </Box>
                </Alert>
            )}

            {plan.payment_status === 'paid' && (
                <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
                    Payment completed successfully!
                </Alert>
            )}

            {!loading && !redirecting && !error && plan.payment_status !== 'paid' && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    You will be redirected to the secure payment page shortly...
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Appointment Summary */}
                <Grid size={{xs: 12, md: 6}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Appointment Summary
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Client Name
                                </Typography>
                                <Typography variant="body1">
                                    {plan.first_name} {plan.last_name}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Email
                                </Typography>
                                <Typography variant="body1">
                                    {plan.email}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Phone
                                </Typography>
                                <Typography variant="body1">
                                    {plan.phone || 'N/A'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Plan Type
                                </Typography>
                                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                                    {plan.selected_plan || plan.plan_type || 'N/A'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Appointment Date & Time
                                </Typography>
                                <Typography variant="body1">
                                    {formatDate(plan.appointment_start)}
                                </Typography>
                            </Box>

                            {plan.destination && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Destination
                                    </Typography>
                                    <Typography variant="body1">
                                        {plan.destination}
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Payment Summary */}
                <Grid size={{xs:12, md: 6}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Payment Summary
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6">
                                    Total Amount
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                    ${total.toFixed(2)}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Plan: {plan.selected_plan || plan.plan_type || 'Pathfinder'}
                            </Typography>

                            {plan.payment_status === 'paid' ? (
                                <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircle />}>
                                    Payment completed successfully!
                                </Alert>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 2 }}>
                                    <CircularProgress size={40} />
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                        Preparing secure payment...
                                    </Typography>
                                </Box>
                            )}

                            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                                Secure payment powered by Stripe
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Step5Payment;

