import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  CalendarToday,
  Email,
  Phone,
  Schedule,
  Security,
  Notifications
} from '@mui/icons-material';
import SpecialistLayout from '../../Layouts/SpecialistLayout.jsx';
import GoogleCalendarRequiredModal from '../../Components/GoogleCalendarRequiredModal.jsx';

export default function GoogleCalendarSettings({ user }) {
    const { flash } = usePage().props;
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showRequiredModal, setShowRequiredModal] = useState(!user.hasGoogleCalendarConnected);

    // Check if user has successfully connected Google Calendar
    useEffect(() => {
        // If user has Google Calendar connected, hide the modal
        if (user.hasGoogleCalendarConnected) {
            setShowRequiredModal(false);
        }
    }, [user.hasGoogleCalendarConnected]);

    const handleConnect = () => {
        setConnecting(true);
        window.location.href = '/google/redirect';
    };

    const handleDisconnect = () => {
        if (confirm('Are you sure you want to disconnect your Google Calendar? This will prevent automatic appointment booking.')) {
            setDisconnecting(true);

            fetch('/google/disconnect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            }).then(() => {
                window.location.reload();
            }).catch(() => {
                setDisconnecting(false);
                alert('Failed to disconnect Google Calendar');
            });
        }
    };

    const handleRefreshToken = () => {
        setRefreshing(true);

        fetch('/google/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.reload();
            } else {
                alert(data.error || 'Failed to refresh token');
                setRefreshing(false);
            }
        }).catch(() => {
            alert('Failed to refresh token');
            setRefreshing(false);
        });
    };

    const handleModalClose = () => {
        // Only allow closing if Google Calendar is connected
        if (user.hasGoogleCalendarConnected) {
            setShowRequiredModal(false);
        }
    };

    return (
        <SpecialistLayout user={user}>
            <Head title="Google Calendar Settings" />

            {/* Required Modal */}
            <GoogleCalendarRequiredModal
                user={user}
                open={showRequiredModal}
                onClose={handleModalClose}
            />

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Google Calendar Integration
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Connect your Google Calendar to enable automatic appointment booking
                        </Typography>

                        {/* Success/Error Messages */}
                        {flash?.success && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                {flash.success}
                            </Alert>
                        )}

                        {flash?.error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {flash.error}
                            </Alert>
                        )}

                        {user.hasGoogleCalendarConnected ? (
                            <Box>
                                {/* Connected State */}
                                <Alert
                                    severity="success"
                                    icon={<CheckCircle />}
                                    sx={{ mb: 3 }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Google Calendar Connected
                                    </Typography>
                                    <Typography variant="body2">
                                        Your Google Calendar is connected and ready for automatic appointment booking.
                                    </Typography>
                                </Alert>

                                {/* Connection Details */}
                                <Paper sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Connection Details
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Calendar ID
                                            </Typography>
                                            <Typography variant="body1">
                                                {user.google_calendar_id || 'Primary Calendar'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Token Status
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip
                                                    label={user.isGoogleTokenExpired ? 'Expired' : 'Valid'}
                                                    color={user.isGoogleTokenExpired ? 'error' : 'success'}
                                                    size="small"
                                                />
                                                {user.isGoogleTokenExpired && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={handleRefreshToken}
                                                        disabled={refreshing}
                                                        sx={{ ml: 1 }}
                                                    >
                                                        {refreshing ? 'Refreshing...' : 'Refresh'}
                                                    </Button>
                                                )}
                                            </Box>
                                        </Grid>
                                        {user.google_token_expires && (
                                            <Grid item xs={12}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Expires
                                                </Typography>
                                                <Typography variant="body1">
                                                    {new Date(user.google_token_expires).toLocaleString()}
                                                </Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Paper>

                                {/* Disconnect Button */}
                                <Divider sx={{ my: 3 }} />
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleDisconnect}
                                    disabled={disconnecting}
                                    startIcon={<CalendarToday />}
                                >
                                    {disconnecting ? 'Disconnecting...' : 'Disconnect Google Calendar'}
                                </Button>
                            </Box>
                        ) : (
                            <Box>
                                {/* Not Connected State */}
                                <Alert
                                    severity="warning"
                                    icon={<Warning />}
                                    sx={{ mb: 3 }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Google Calendar Not Connected
                                    </Typography>
                                    <Typography variant="body2">
                                        Connect your Google Calendar to enable automatic appointment booking and availability checking.
                                    </Typography>
                                </Alert>

                                {/* Benefits */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Benefits of Connecting
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CalendarToday color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary="Clients can see your real-time availability" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Schedule color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary="Automatic calendar event creation" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Email color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary="Email notifications sent to clients" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Security color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary="Prevents double-booking conflicts" />
                                        </ListItem>
                                    </List>
                                </Box>

                                {/* Connect Button */}
                                <Divider sx={{ my: 3 }} />
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleConnect}
                                    disabled={connecting}
                                    startIcon={<CalendarToday />}
                                >
                                    {connecting ? 'Connecting...' : 'Connect Google Calendar'}
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </SpecialistLayout>
    );
}
