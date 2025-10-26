import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import WebsiteLayout from '../../Layouts/WebsiteLayout.jsx';

export default function AppointmentBooking({ specialists = [] }) {
    const [selectedSpecialist, setSelectedSpecialist] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [bookingForm, setBookingForm] = useState({
        client_name: '',
        client_email: '',
        client_phone: '',
        notes: '',
        duration: 60
    });

    const handleSpecialistSelect = async (specialist) => {
        setSelectedSpecialist(specialist);
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/availability/${specialist.id}?duration=${bookingForm.duration}`);
            const data = await response.json();

            if (data.error) {
                setError(data.error);
                return;
            }

            setAvailableSlots(data.available_slots || []);
        } catch (error) {
            console.error('Error fetching availability:', error);
            setError('Failed to fetch availability');
        } finally {
            setLoading(false);
        }
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setBookingForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSpecialist || !selectedSlot) {
            setError('Please select a specialist and time slot');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    specialist_id: selectedSpecialist.id,
                    start_time: selectedSlot.start,
                    duration: bookingForm.duration,
                    client_name: bookingForm.client_name,
                    client_email: bookingForm.client_email,
                    client_phone: bookingForm.client_phone,
                    notes: bookingForm.notes
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Appointment booked successfully! You will receive a confirmation email shortly.');
                // Reset form
                setSelectedSpecialist(null);
                setSelectedSlot(null);
                setAvailableSlots([]);
                setBookingForm({
                    client_name: '',
                    client_email: '',
                    client_phone: '',
                    notes: '',
                    duration: 60
                });
            } else {
                setError(data.error || 'Failed to book appointment');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            setError('Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <WebsiteLayout>
            <Head title="Book Appointment" />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Book an Appointment
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Select a specialist and choose your preferred time slot
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                {success}
                            </Alert>
                        )}

                        {/* Step 1: Select Specialist */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                1. Choose a Specialist
                            </Typography>
                            <Grid container spacing={2}>
                                {specialists.map((specialist) => (
                                    <Grid item xs={12} sm={6} md={4} key={specialist.id}>
                                        <Card
                                            sx={{
                                                cursor: 'pointer',
                                                border: selectedSpecialist?.id === specialist.id ? 2 : 1,
                                                borderColor: selectedSpecialist?.id === specialist.id ? 'primary.main' : 'divider',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    backgroundColor: 'action.hover'
                                                }
                                            }}
                                            onClick={() => handleSpecialistSelect(specialist)}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: '50%',
                                                            backgroundColor: 'primary.light',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'primary.contrastText'
                                                        }}
                                                    >
                                                        <Typography variant="h6">
                                                            {specialist.name.charAt(0)}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {specialist.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {specialist.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {/* Step 2: Select Time Slot */}
                        {selectedSpecialist && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    2. Choose a Time Slot
                                </Typography>

                                <Box sx={{ mb: 3 }}>
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <InputLabel>Duration</InputLabel>
                                        <Select
                                            name="duration"
                                            value={bookingForm.duration}
                                            onChange={handleFormChange}
                                            label="Duration"
                                        >
                                            <MenuItem value={30}>30 minutes</MenuItem>
                                            <MenuItem value={60}>1 hour</MenuItem>
                                            <MenuItem value={90}>1.5 hours</MenuItem>
                                            <MenuItem value={120}>2 hours</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                        <CircularProgress />
                                        <Typography sx={{ ml: 2 }}>Loading available slots...</Typography>
                                    </Box>
                                ) : (
                                    <Grid container spacing={1}>
                                        {availableSlots.map((slot, index) => (
                                            <Grid item xs={6} sm={4} md={3} key={index}>
                                                <Button
                                                    variant={selectedSlot?.start === slot.start ? "contained" : "outlined"}
                                                    fullWidth
                                                    onClick={() => handleSlotSelect(slot)}
                                                    sx={{ py: 1 }}
                                                >
                                                    <Box>
                                                        <Typography variant="caption" display="block">
                                                            {slot.date}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {slot.time}
                                                        </Typography>
                                                    </Box>
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}

                                {availableSlots.length === 0 && !loading && (
                                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                        No available slots found for the selected duration.
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {/* Step 3: Booking Form */}
                        {selectedSlot && (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    3. Your Details
                                </Typography>

                                <Box component="form" onSubmit={handleBookingSubmit} sx={{ mt: 2 }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="client_name"
                                                value={bookingForm.client_name}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                name="client_email"
                                                type="email"
                                                value={bookingForm.client_email}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                name="client_phone"
                                                value={bookingForm.client_phone}
                                                onChange={handleFormChange}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Additional Notes"
                                                name="notes"
                                                multiline
                                                rows={3}
                                                value={bookingForm.notes}
                                                onChange={handleFormChange}
                                                placeholder="Any special requirements or questions..."
                                            />
                                        </Grid>
                                    </Grid>

                                    <Paper sx={{ p: 2, mt: 3, backgroundColor: 'grey.50' }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Appointment Summary
                                        </Typography>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Specialist:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {selectedSpecialist?.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Date:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {selectedSlot?.date}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Time:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {selectedSlot?.time}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Duration:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {bookingForm.duration} minutes
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        disabled={loading}
                                        sx={{ mt: 3 }}
                                    >
                                        {loading ? 'Booking...' : 'Book Appointment'}
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </WebsiteLayout>
    );
}
