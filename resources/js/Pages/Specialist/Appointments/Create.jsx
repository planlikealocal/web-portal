import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm } from '@inertiajs/react';
import SpecialistLayout from '../../../Layouts/SpecialistLayout';

const AppointmentsCreate = () => {
  const { data, setData, post, processing, errors } = useForm({
    client_name: '',
    client_email: '',
    client_phone: '',
    appointment_date: '',
    appointment_time: '',
    service_type: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/specialist/appointments');
  };

  const serviceTypes = [
    'Travel Consultation',
    'Trip Planning',
    'Destination Review',
    'Custom Itinerary',
    'Group Travel Planning',
    'Business Travel',
  ];

  return (
    <SpecialistLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Create New Appointment
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Schedule a new appointment with a client
        </Typography>

        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Client Name"
                    value={data.client_name}
                    onChange={(e) => setData('client_name', e.target.value)}
                    error={!!errors.client_name}
                    helperText={errors.client_name}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Client Email"
                    type="email"
                    value={data.client_email}
                    onChange={(e) => setData('client_email', e.target.value)}
                    error={!!errors.client_email}
                    helperText={errors.client_email}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Client Phone"
                    value={data.client_phone}
                    onChange={(e) => setData('client_phone', e.target.value)}
                    error={!!errors.client_phone}
                    helperText={errors.client_phone}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Service Type</InputLabel>
                    <Select
                      value={data.service_type}
                      onChange={(e) => setData('service_type', e.target.value)}
                      error={!!errors.service_type}
                    >
                      {serviceTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Appointment Date"
                    type="date"
                    value={data.appointment_date}
                    onChange={(e) => setData('appointment_date', e.target.value)}
                    error={!!errors.appointment_date}
                    helperText={errors.appointment_date}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Appointment Time"
                    type="time"
                    value={data.appointment_time}
                    onChange={(e) => setData('appointment_time', e.target.value)}
                    error={!!errors.appointment_time}
                    helperText={errors.appointment_time}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={4}
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    error={!!errors.notes}
                    helperText={errors.notes}
                    placeholder="Additional notes about the appointment..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" gap={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={processing}
                    >
                      {processing ? 'Creating...' : 'Create Appointment'}
                    </Button>
                    <Button
                      variant="outlined"
                      href="/specialist/appointments"
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </SpecialistLayout>
  );
};

export default AppointmentsCreate;
