import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Card, CardContent, Button, CircularProgress, Alert } from '@mui/material';
import { AccessTime, CalendarToday } from '@mui/icons-material';

const Step4SelectTime = ({ data, setData, errors, planId }) => {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        // Only fetch availability if plan is selected
        if (planId && (data.selected_plan || data.plan_type)) {
            fetchAvailability();
        }
    }, [planId, data.selected_plan, data.plan_type]);

    const fetchAvailability = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/plans/${planId}/availability`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch availability');
            }

            const result = await response.json();
            setAvailability(result.availability || []);
        } catch (err) {
            console.error('Error fetching availability:', err);
            setError(err.message || 'Failed to load available time slots');
        } finally {
            setLoading(false);
        }
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setData('selected_time_slot', slot);
        setData('appointment_start', slot.start);
        setData('appointment_end', slot.end);
    };

    // Group availability by date
    const groupedByDate = availability.reduce((acc, slot) => {
        const date = slot.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(slot);
        return acc;
    }, {});

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    };

    // Format time for display
    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 4, textAlign: 'center' }}>
                Select a Time Slot
            </Typography>

            {errors.selected_time_slot && (
                <Typography variant="body2" color="error" sx={{ mb: 2, textAlign: 'center' }}>
                    {errors.selected_time_slot}
                </Typography>
            )}

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                        Loading available time slots...
                    </Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && availability.length === 0 && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    No available time slots found. Please try again later or contact the specialist.
                </Alert>
            )}

            {!loading && !error && availability.length > 0 && (
                <Box>
                    {Object.entries(groupedByDate).map(([date, slots]) => (
                        <Box key={date} sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarToday fontSize="small" />
                                {formatDate(date)}
                            </Typography>
                            <Grid container spacing={2}>
                                {slots.map((slot, index) => {
                                    const isSelected = selectedSlot && selectedSlot.start === slot.start;
                                    return (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                            <Card
                                                sx={{
                                                    cursor: 'pointer',
                                                    border: isSelected ? 2 : 1,
                                                    borderColor: isSelected ? 'primary.main' : 'divider',
                                                    bgcolor: isSelected ? 'action.selected' : 'background.paper',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                        boxShadow: 3,
                                                    },
                                                }}
                                                onClick={() => handleSlotSelect(slot)}
                                            >
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <AccessTime fontSize="small" />
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {formatTime(slot.time)} - {formatTime(slot.time_end)}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Duration: {slot.duration_minutes} minutes
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default Step4SelectTime;

