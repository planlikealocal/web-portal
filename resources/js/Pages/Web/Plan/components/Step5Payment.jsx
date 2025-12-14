import React, { useState, useEffect, useMemo } from 'react';
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
import { CheckoutProvider, PaymentElement, useCheckout } from '@stripe/react-stripe-js/checkout';
import { loadStripe } from '@stripe/stripe-js';

// Checkout form component that uses the embedded payment form
const CheckoutForm = ({ plan, onPaymentSuccess }) => {
    const checkoutState = useCheckout();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    // Helper function to get plan price
    const getPlanPrice = () => {
        if (!plan) return 149;
        const planType = plan.selected_plan || plan.plan_type || 'pathfinder';
        const prices = plan.plan_prices || {
            'explore': 99,
            'pathfinder': 149,
            'premium': 249,
        };
        return prices[planType] || prices['pathfinder'] || 149;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Payment submission started. Checkout state:', checkoutState.type);

        if (checkoutState.type === 'loading') {
            console.log('Checkout still loading, cannot process payment');
            return;
        }

        if (checkoutState.type === 'error') {
            console.log('Checkout in error state:', checkoutState.error);
            setError(checkoutState.error.message);
            return;
        }

        // checkoutState.type === 'success'
        const {checkout} = checkoutState;
        console.log('Starting payment processing');
        setProcessing(true);
        setError(null);

        try {
            // Update email if not already set
            if (plan?.email) {
                console.log('Updating email for checkout:', plan.email);
                await checkout.updateEmail(plan.email);
            }

            // Provide email address when confirming checkout
            console.log('Confirming checkout with email:', plan?.email || 'no email provided');
            const result = await checkout.confirm({
                email: plan?.email || '',
            });

            if (result.type === 'error') {
                console.log('Payment confirmation failed:', result.error);
                setError(result.error.message);
                setProcessing(false);
            } else {
                console.log('Payment successful, triggering success callback');
                // Payment successful - redirect will happen automatically via return_url
                if (onPaymentSuccess) {
                    onPaymentSuccess();
                }
            }
        } catch (err) {
            console.error('Payment error:', err);
            console.log('Payment error details:', {
                message: err.message,
                code: err.code,
                type: err.type
            });
            setError(err.message || 'An error occurred during payment. Please try again.');
            setProcessing(false);
        }
    };

    if (checkoutState.type === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ ml: 2 }}>
                    Loading payment form...
                </Typography>
            </Box>
        );
    }

    if (checkoutState.type === 'error') {
        return (
            <Alert severity="error" sx={{ mb: 3 }}>
                {checkoutState.error.message || 'Failed to load payment form. Please try again.'}
            </Alert>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
                <PaymentElement />
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={processing}
                startIcon={processing ? <CircularProgress size={20} /> : <Payment />}
                sx={{ py: 1.5, mt: 2 }}
            >
                {processing ? 'Processing Payment...' : `Pay $${getPlanPrice().toFixed(2)}`}
            </Button>
        </form>
    );
};

// Helper function to get plan price
const getPlanPrice = (plan) => {
    if (!plan) return 149;
    const planType = plan.selected_plan || plan.plan_type || 'pathfinder';
    const prices = plan.plan_prices || {
        'explore': 99,
        'pathfinder': 149,
        'premium': 249,
    };
    return prices[planType] || prices['pathfinder'] || 149;
};

const Step5Payment = ({ plan, onPaymentSuccess }) => {
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize Stripe
    useEffect(() => {
        const initStripe = async () => {
            try {
                const stripeKey = document.querySelector('meta[name="stripe-key"]')?.getAttribute('content');
                if (!stripeKey) {
                    throw new Error('Stripe key not found');
                }
                const stripe = await loadStripe(stripeKey);
                setStripePromise(stripe);
            } catch (err) {
                console.error('Failed to load Stripe:', err);
                setError('Failed to initialize payment system. Please refresh the page.');
                setLoading(false);
            }
        };
        initStripe();
    }, []);

    // Create checkout session and get clientSecret
    useEffect(() => {
        const createCheckoutSession = async () => {
            // If payment is already completed, don't create session
            if (plan.payment_status === 'paid') {
                setLoading(false);
                return;
            }

            // Check if appointment is confirmed
            if (plan.status !== 'completed') {
                setError('Appointment must be confirmed before payment.');
                setLoading(false);
                return;
            }

            try {
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

                setClientSecret(data.clientSecret);
                setLoading(false);
            } catch (err) {
                console.error('Error creating checkout session:', err);
                setError(err.message || 'Failed to initialize payment. Please try again.');
                setLoading(false);
            }
        };

        if (stripePromise && plan.id) {
            createCheckoutSession();
        }
    }, [stripePromise, plan.id, plan.status, plan.payment_status]);

    const price = getPlanPrice(plan);
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

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                        Loading payment form...
                    </Typography>
                </Box>
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

                {/* Payment Form */}
                <Grid size={{xs: 12, md: 6}}>
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
                            ) : stripePromise && clientSecret ? (
                                <CheckoutProvider
                                    stripe={stripePromise}
                                    options={{ clientSecret }}
                                >
                                    <CheckoutForm plan={plan} onPaymentSuccess={onPaymentSuccess} />
                                </CheckoutProvider>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 2 }}>
                                    <CircularProgress size={40} />
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                        Preparing secure payment form...
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
