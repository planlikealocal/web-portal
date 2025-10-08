import React, { useEffect, useState } from 'react';
import {
    Alert,
    Snackbar,
    Slide,
    IconButton,
    Collapse,
    Box,
    Typography,
} from '@mui/material';
import {
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { usePage } from '@inertiajs/react';

// Slide transition component for smooth animations
function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

const Notification = () => {
    const { props } = usePage();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [expanded, setExpanded] = useState(false);

    // Check for flash messages in props
    useEffect(() => {
        const flashMessages = props.flash || {};
        
        // Check for different types of flash messages
        if (flashMessages.success) {
            setMessage(flashMessages.success);
            setType('success');
            setOpen(true);
        } else if (flashMessages.error) {
            setMessage(flashMessages.error);
            setType('error');
            setOpen(true);
        } else if (flashMessages.warning) {
            setMessage(flashMessages.warning);
            setType('warning');
            setOpen(true);
        } else if (flashMessages.info) {
            setMessage(flashMessages.info);
            setType('info');
            setOpen(true);
        } else if (flashMessages.message) {
            // Generic message - default to info
            setMessage(flashMessages.message);
            setType('info');
            setOpen(true);
        }
    }, [props.flash]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setExpanded(false);
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const getAlertIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon />;
            case 'error':
                return <ErrorIcon />;
            case 'warning':
                return <WarningIcon />;
            case 'info':
            default:
                return <InfoIcon />;
        }
    };

    const getAlertSeverity = () => {
        switch (type) {
            case 'success':
                return 'success';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
            default:
                return 'info';
        }
    };

    // Auto-hide duration based on message type
    const getAutoHideDuration = () => {
        switch (type) {
            case 'error':
                return 8000; // Longer for errors
            case 'warning':
                return 6000;
            case 'success':
                return 4000;
            case 'info':
            default:
                return 5000;
        }
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={getAutoHideDuration()}
            onClose={handleClose}
            TransitionComponent={SlideTransition}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{
                mt: 2,
                '& .MuiSnackbarContent-root': {
                    minWidth: '300px',
                },
            }}
        >
            <Alert
                onClose={handleClose}
                severity={getAlertSeverity()}
                icon={getAlertIcon()}
                action={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {message && message.length > 100 && (
                            <IconButton
                                size="small"
                                aria-label="expand"
                                onClick={handleExpandClick}
                                sx={{ mr: 1 }}
                            >
                                <Typography variant="caption">
                                    {expanded ? 'Show less' : 'Show more'}
                                </Typography>
                            </IconButton>
                        )}
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleClose}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                }
                sx={{
                    width: '100%',
                    '& .MuiAlert-message': {
                        width: '100%',
                    },
                }}
            >
                <Collapse in={expanded || !message || message.length <= 100} timeout="auto" unmountOnExit>
                    {message}
                </Collapse>
                {message && message.length > 100 && !expanded && (
                    <Box>
                        {message.substring(0, 100)}...
                    </Box>
                )}
            </Alert>
        </Snackbar>
    );
};

export default Notification;
