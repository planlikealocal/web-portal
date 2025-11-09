import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { AccessTime, CalendarToday } from '@mui/icons-material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import SpecialistInfo from './SpecialistInfo';

const Step4SelectTime = ({ data, setData, errors, planId, specialist }) => {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateValue, setSelectedDateValue] = useState(null);

    const fetchAvailability = async (date) => {
        if (!planId || !date) {
            return;
        }

        setLoading(true);
        setError(null);
        setAvailability([]);
        setSelectedSlot(null); // Clear selected slot when fetching new availability

        try {
            const dateString = dayjs(date).format('YYYY-MM-DD');
            const response = await fetch(`/plans/${planId}/availability?date=${dateString}`, {
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
            setAvailability([]);
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

    // Get slots for selected date (availability is already filtered by date from backend)
    const slotsForSelectedDate = availability;

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

    // Handle date selection from StaticDatePicker
    const handleDateChange = (newDate) => {
        if (newDate) {
            const dateString = newDate.format('YYYY-MM-DD');
            setSelectedDate(dateString);
            setSelectedDateValue(newDate);
            // Fetch availability for the selected date
            fetchAvailability(newDate);
        }
    };

    // Check if a date should be disabled (only disable past dates and today/tomorrow)
    const shouldDisableDate = (date) => {
        const today = dayjs().startOf('day');
        const tomorrow = today.add(1, 'day');
        const dayAfterTomorrow = today.add(2, 'day');
        const dateToCheck = date.startOf('day');

        // Disable dates before day after tomorrow
        return dateToCheck.isBefore(dayAfterTomorrow);
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
            <Grid container spacing={2}>
                <Grid size={{xs:6}}>
                    {/* Specialist Info Section */}
                    {specialist && (
                        <Box sx={{ mb: 4 }}>
                            <SpecialistInfo specialist={specialist} />
                        </Box>
                    )}
                    <Typography variant="h5" sx={{ mb: 4, textAlign: 'center' }}>
                        Select a Time Slot
                    </Typography>
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

                    {/* Calendar View with StaticDatePicker */}

                    {/* Time Slots for Selected Date */}
                    {selectedDate && !loading && !error && slotsForSelectedDate.length > 0 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccessTime fontSize="small" />
                                Available Time Slots for {formatDate(selectedDate)}
                            </Typography>
                            <Grid container spacing={2}>
                                {slotsForSelectedDate.map((slot, index) => {
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
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Typography variant="caption">
                                                            {formatTime(slot.time)} - {formatTime(slot.time_end)}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    )}

                    {selectedDate && !loading && !error && slotsForSelectedDate.length === 0 && (
                        <Alert severity="info" sx={{ mb: 3 }}>
                            No available time slots for {formatDate(selectedDate)}. Please select another date.
                        </Alert>
                    )}

                    {!selectedDate && !loading && !error && (
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Please select a date to view available time slots.
                        </Alert>
                    )}

                </Grid>

                <Grid size={{xs:6}}>
                    {errors.selected_time_slot && (
                        <Typography variant="body2" color="error" sx={{ mb: 2, textAlign: 'center' }}>
                            {errors.selected_time_slot}
                        </Typography>
                    )}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" sx={{ mb: 4, textAlign: 'center' }}>
                            <CalendarToday fontSize="small" />
                            Select a Date
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                '& .MuiPickersCalendarHeader-root': {
                                    marginTop: 0,
                                },
                            }}>
                                <StaticDatePicker
                                    displayStaticWrapperAs="desktop"
                                    value={selectedDateValue}
                                    onChange={handleDateChange}
                                    shouldDisableDate={shouldDisableDate}
                                    minDate={dayjs().add(3, 'day')} // Day after tomorrow
                                    slotProps={{
                                        actionBar: {
                                            actions: [],
                                        },
                                    }}
                                />
                            </Box>
                        </LocalizationProvider>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Step4SelectTime;

