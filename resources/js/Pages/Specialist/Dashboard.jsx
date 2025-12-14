import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Alert,
  Button,
  AlertTitle
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Warning
} from '@mui/icons-material';
import { Link } from '@inertiajs/react';
import SpecialistLayout from '../../Layouts/SpecialistLayout';

const SpecialistDashboard = ({ user, specialist }) => {
  return (
    <SpecialistLayout user={user}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Here's an overview of your specialist portal
        </Typography>

        {/* Google Calendar Connection Alert */}
        {!user?.hasGoogleCalendarConnected && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                component={Link}
                href="/specialist/google-calendar-settings"
              >
                Connect Now
              </Button>
            }
          >
            <AlertTitle>Google Calendar Required</AlertTitle>
            You need to connect your Google Calendar to access appointment features and enable client bookings.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Quick Stats Cards */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CalendarIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">Appointments</Typography>
                    <Typography variant="h4" color="primary">
                      12
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This month
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PersonIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">Clients</Typography>
                    <Typography variant="h4" color="success.main">
                      8
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active clients
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">Revenue</Typography>
                    <Typography variant="h4" color="warning.main">
                      $2,450
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This month
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Specialist Information */}
          {specialist && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Your Profile Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {specialist.first_name} {specialist.last_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {specialist.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Contact Number
                    </Typography>
                    <Typography variant="body1">
                      {specialist.contact_no}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color={specialist.status === 'active' ? 'success.main' : 'error.main'}
                    >
                      {specialist.status?.charAt(0).toUpperCase() + specialist.status?.slice(1)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {specialist.city}, {specialist.state_province}, {specialist.country}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No recent activity to display.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </SpecialistLayout>
  );
};

export default SpecialistDashboard;
