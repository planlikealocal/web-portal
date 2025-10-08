import React from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { router } from '@inertiajs/react';

/**
 * Example component demonstrating how to use the Notification system
 * This component shows how to trigger different types of flash messages
 * from the backend using Inertia.js
 */
const NotificationExample = () => {
    const triggerSuccess = () => {
        router.post('/admin/test-notifications', {
            type: 'success',
            message: 'This is a success message! Operation completed successfully.'
        });
    };

    const triggerError = () => {
        router.post('/admin/test-notifications', {
            type: 'error',
            message: 'This is an error message! Something went wrong.'
        });
    };

    const triggerWarning = () => {
        router.post('/admin/test-notifications', {
            type: 'warning',
            message: 'This is a warning message! Please check your input.'
        });
    };

    const triggerInfo = () => {
        router.post('/admin/test-notifications', {
            type: 'info',
            message: 'This is an info message! Here is some useful information.'
        });
    };

    const triggerLongMessage = () => {
        router.post('/admin/test-notifications', {
            type: 'success',
            message: 'This is a very long success message that demonstrates how the notification component handles long text. It will show a "Show more" button when the message exceeds 100 characters, allowing users to expand and read the full message. This is particularly useful for detailed error messages or success confirmations that contain additional context or instructions.'
        });
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 2 }}>
            <Typography variant="h5" gutterBottom>
                Notification System Demo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Click the buttons below to test different types of notifications.
                The notifications will appear at the top of the page.
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                    variant="contained" 
                    color="success" 
                    onClick={triggerSuccess}
                    fullWidth
                >
                    Trigger Success Notification
                </Button>
                
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={triggerError}
                    fullWidth
                >
                    Trigger Error Notification
                </Button>
                
                <Button 
                    variant="contained" 
                    color="warning" 
                    onClick={triggerWarning}
                    fullWidth
                >
                    Trigger Warning Notification
                </Button>
                
                <Button 
                    variant="contained" 
                    color="info" 
                    onClick={triggerInfo}
                    fullWidth
                >
                    Trigger Info Notification
                </Button>
                
                <Button 
                    variant="outlined" 
                    onClick={triggerLongMessage}
                    fullWidth
                >
                    Trigger Long Message (with expand/collapse)
                </Button>
            </Box>
        </Paper>
    );
};

export default NotificationExample;
