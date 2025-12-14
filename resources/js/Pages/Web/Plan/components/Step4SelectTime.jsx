import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Card, CardContent, CircularProgress, Alert, Divider, Button } from '@mui/material';
import { AccessTime, CalendarToday, Payment, CheckCircle } from '@mui/icons-material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import SpecialistInfo from './SpecialistInfo';

const Step4SelectTime = ({ data, setData, errors, planId, specialist, disabled = false, onConfirm, plan }) => {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateValue, setSelectedDateValue] = useState(null);
    const [confirming, setConfirming] = useState(false);

    // Initialize selected slot from data if available
    useEffect(() => {
        if (data.selected_time_slot && typeof data.selected_time_slot === 'object') {
            setSelectedSlot(data.selected_time_slot);
        } else if (data.appointment_start && data.appointment_end) {
            // Create slot object from appointment times
            setSelectedSlot({
                start: data.appointment_start,
                end: data.appointment_end,
                time: new Date(data.appointment_start).toTimeString().slice(0, 5),
                time_end: new Date(data.appointment_end).toTimeString().slice(0, 5),
            });
            // Set selected date from appointment start
            const appointmentDate = new Date(data.appointment_start);
            setSelectedDate(dayjs(appointmentDate).format('YYYY-MM-DD'));
            setSelectedDateValue(dayjs(appointmentDate));
        }
    }, [data.selected_time_slot, data.appointment_start, data.appointment_end]);

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

    // Format date and time for appointment display
    const formatAppointmentDateTime = (dateString) => {
        if (!dateString) return null;
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

    // Calculate plan price based on plan type
    const getPlanPrice = () => {
        const planType = data.selected_plan || data.plan_type || 'pathfinder';
        const prices = data.plan_prices || {
            'explore': 99,
            'pathfinder': 149,
            'premium': 249,
        };
        return prices[planType] || prices['pathfinder'] || 149;
    };

    const price = getPlanPrice();
    const total = price;

    // Get selected appointment time from data or selectedSlot
    const selectedAppointmentTime = data.appointment_start || (selectedSlot ? selectedSlot.start : null);
    const selectedAppointmentEnd = data.appointment_end || (selectedSlot ? selectedSlot.end : null);
    
    // Check if appointment is confirmed
    const isAppointmentConfirmed = data.status === 'completed' || plan?.status === 'completed';
    const isPaymentPaid = data.payment_status === 'paid' || plan?.payment_status === 'paid';
    
    // Disable appointment selection if confirmed
    const isDisabled = disabled || isAppointmentConfirmed;

    // Handle confirm appointment - moves to step 5 (Payment)
    const handleConfirmAppointment = async () => {
        // Validate that appointment details are selected
        if (!selectedSlot && !(data.appointment_start && data.appointment_end)) {
            setError('Please select a time slot before confirming the appointment.');
            return;
        }

        setConfirming(true);
        setError(null);

        try {
            // Ensure all appointment data is saved to form data before confirming
            // This ensures the PUT request includes all necessary fields
            if (selectedSlot) {
                setData('selected_time_slot', selectedSlot);
                setData('appointment_start', selectedSlot.start);
                setData('appointment_end', selectedSlot.end);
            } else if (data.appointment_start && data.appointment_end) {
                // If we have appointment data but no selectedSlot, ensure it's set
                if (!data.selected_time_slot) {
                    setData('selected_time_slot', {
                        start: data.appointment_start,
                        end: data.appointment_end,
                    });
                }
            }
            
            // Also ensure status is set in form data before calling onConfirm
            setData('status', 'completed');
            
            // Wait a bit for data to be set in the form
            await new Promise(resolve => setTimeout(resolve, 100));

            // Confirm the appointment (set status to completed and create Google Calendar event)
            // onConfirm will handle moving to step 5 (Payment)
            if (onConfirm) {
                await onConfirm();
            } else {
                // If onConfirm is not provided, use fetch to save directly
                const response = await fetch(`/plans/${planId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: JSON.stringify({
                        status: 'completed',
                        appointment_start: data.appointment_start || selectedSlot?.start,
                        appointment_end: data.appointment_end || selectedSlot?.end,
                        selected_time_slot: data.selected_time_slot || selectedSlot,
                    }),
                    credentials: 'same-origin',
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to confirm appointment');
                }
            }
        } catch (err) {
            console.error('Error confirming appointment:', err);
            setError(err.message || 'Failed to confirm appointment. Please try again.');
            setConfirming(false);
        }
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
                    {isAppointmentConfirmed && (
                        <Alert severity={isPaymentPaid ? "success" : "info"} sx={{ mb: 3 }}>
                            {isPaymentPaid 
                                ? "Appointment confirmed and payment completed. Time slot cannot be changed."
                                : "Appointment confirmed. Please proceed to payment."}
                        </Alert>
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
                                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                    border: isSelected ? 2 : 1,
                                                    borderColor: isSelected ? 'primary.main' : 'divider',
                                                    bgcolor: isSelected ? 'action.selected' : 'background.paper',
                                                    opacity: isDisabled ? 0.6 : 1,
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        borderColor: isDisabled ? 'divider' : 'primary.main',
                                                        boxShadow: isDisabled ? 0 : 3,
                                                    },
                                                }}
                                                onClick={() => !isDisabled && handleSlotSelect(slot)}
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
                                    disabled={isDisabled}
                                    slotProps={{
                                        actionBar: {
                                            actions: [],
                                        },
                                    }}
                                />
                            </Box>
                        </LocalizationProvider>
                    </Box>
                    {/* Payment Amount Display */}
                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Payment />
                                Payment Summary
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">
                                    Total Amount
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                    ${total.toFixed(2)}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Plan: {data.selected_plan || data.plan_type || 'Pathfinder'}
                            </Typography>

                            {/* Confirm Appointment Button */}
                            {!isAppointmentConfirmed && selectedAppointmentTime && (
                                <>
                                    <Divider sx={{ my: 3 }} />
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        onClick={handleConfirmAppointment}
                                        disabled={confirming || !selectedAppointmentTime}
                                        startIcon={confirming ? <CircularProgress size={20} /> : <CheckCircle />}
                                        sx={{ py: 1.5, mt: 2 }}
                                    >
                                        {confirming
                                            ? 'Confirming Appointment...'
                                            : 'Confirm Appointment & Continue'}
                                    </Button>
                                </>
                            )}

                            {/* Payment Status */}
                            {isAppointmentConfirmed && isPaymentPaid && (
                                <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircle />}>
                                    Payment completed successfully!
                                </Alert>
                            )}


                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Step4SelectTime;

