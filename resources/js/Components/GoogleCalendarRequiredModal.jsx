import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material';
import {
  CalendarToday,
  CheckCircle,
  Schedule,
  Email,
  Security,
  Warning
} from '@mui/icons-material';

export default function GoogleCalendarRequiredModal({ user, open, onClose }) {
    const [connecting, setConnecting] = useState(false);

    const handleConnect = () => {
        setConnecting(true);
        window.location.href = '/google/redirect';
    };

    const handleClose = () => {
        // Prevent closing the modal if Google Calendar is not connected
        if (!user.hasGoogleCalendarConnected) {
            return;
        }
        onClose();
    };

    // Don't show modal if Google Calendar is already connected
    if (user.hasGoogleCalendarConnected) {
        return null;
    }

    return (
        <Dialog 
            open={open} 
            onClose={user.hasGoogleCalendarConnected ? handleClose : undefined}
            maxWidth="sm"
            fullWidth
            disableEscapeKeyDown={!user.hasGoogleCalendarConnected}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CalendarToday color="primary" />
                    <Typography variant="h6">
                        Google Calendar Required
                    </Typography>
                </Box>
            </DialogTitle>
            
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        <strong>Google Calendar connection is required</strong> to access the specialist portal.
                    </Typography>
                </Alert>

                <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5 }}>
                    Benefits:
                </Typography>
                
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Schedule color="primary" sx={{ fontSize: 18 }} />
                        <Typography variant="body2">Real-time availability for clients</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday color="primary" sx={{ fontSize: 18 }} />
                        <Typography variant="body2">Automatic appointment booking</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email color="primary" sx={{ fontSize: 18 }} />
                        <Typography variant="body2">Client email notifications</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Security color="primary" sx={{ fontSize: 18 }} />
                        <Typography variant="body2">Prevents scheduling conflicts</Typography>
                    </Box>
                </Stack>

                <Alert severity="info" sx={{ mt: 1 }}>
                    <Typography variant="caption">
                        <strong>Privacy:</strong> We only access your calendar to check availability and create events.
                    </Typography>
                </Alert>
            </DialogContent>
            
            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleConnect}
                    disabled={connecting}
                    startIcon={connecting ? <CircularProgress size={20} /> : <CalendarToday />}
                    sx={{ minWidth: 180 }}
                >
                    {connecting ? 'Connecting...' : 'Connect Google Calendar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
