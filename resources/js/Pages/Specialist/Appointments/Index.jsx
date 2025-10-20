import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Link } from '@inertiajs/react';
import SpecialistLayout from '../../../Layouts/SpecialistLayout';

const AppointmentsIndex = ({ appointments }) => {
  // Mock data for demonstration
  const mockAppointments = [
    {
      id: 1,
      clientName: 'John Doe',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'confirmed',
      service: 'Travel Consultation',
    },
    {
      id: 2,
      clientName: 'Jane Smith',
      date: '2024-01-16',
      time: '2:00 PM',
      status: 'pending',
      service: 'Trip Planning',
    },
    {
      id: 3,
      clientName: 'Mike Johnson',
      date: '2024-01-17',
      time: '11:30 AM',
      status: 'completed',
      service: 'Destination Review',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <SpecialistLayout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">
            Appointments
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            href="/specialist/appointments/create"
          >
            New Appointment
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Upcoming Appointments */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Appointments
                </Typography>
                {mockAppointments.length > 0 ? (
                  <Grid container spacing={2}>
                    {mockAppointments.map((appointment) => (
                      <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                        <Paper sx={{ p: 2, border: '1px solid', borderColor: 'grey.300' }}>
                          <Box display="flex" alignItems="center" mb={1}>
                            <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="subtitle2">
                              {appointment.clientName}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
                            <Typography variant="body2">
                              {appointment.date}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <TimeIcon sx={{ mr: 1, fontSize: 16 }} />
                            <Typography variant="body2">
                              {appointment.time}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" mb={1}>
                            {appointment.service}
                          </Typography>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No upcoming appointments scheduled.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  Total Appointments
                </Typography>
                <Typography variant="h4">
                  {mockAppointments.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">
                  Confirmed
                </Typography>
                <Typography variant="h4">
                  {mockAppointments.filter(a => a.status === 'confirmed').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="warning.main">
                  Pending
                </Typography>
                <Typography variant="h4">
                  {mockAppointments.filter(a => a.status === 'pending').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="info.main">
                  Completed
                </Typography>
                <Typography variant="h4">
                  {mockAppointments.filter(a => a.status === 'completed').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </SpecialistLayout>
  );
};

export default AppointmentsIndex;
