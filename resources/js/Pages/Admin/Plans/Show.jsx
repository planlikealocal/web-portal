import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  Link as MuiLink,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Place as PlaceIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout.jsx';

const Show = ({ plan }) => {
  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      active: 'success',
      completed: 'info',
      canceled: 'error',
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      paid: 'success',
      failed: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <AdminLayout>
      <Box>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            component={Link}
            href="/admin/plans"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Back to Plans
          </Button>
          <Typography variant="h4" component="h1">
            Plan Details
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  Customer Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {plan.first_name} {plan.last_name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailIcon fontSize="small" />
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {plan.email || 'N/A'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneIcon fontSize="small" />
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {plan.phone || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Plan Status */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Plan Status
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={plan.status || 'draft'}
                        color={getStatusColor(plan.status)}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Appointment Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={plan.appointment_status || 'draft'}
                        color={getStatusColor(plan.appointment_status)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Payment Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={plan.payment_status || 'pending'}
                        color={getPaymentStatusColor(plan.payment_status)}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Plan Type
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={plan.plan_type || plan.selected_plan || 'N/A'}
                        color={plan.plan_type === 'premium' ? 'primary' : 'default'}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Travel Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PlaceIcon />
                  Travel Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Destination
                    </Typography>
                    <Typography variant="body1">
                      {plan.destination || 'N/A'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Travel Dates
                    </Typography>
                    <Typography variant="body1">
                      {plan.travel_dates || 'N/A'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Number of Travelers
                    </Typography>
                    <Typography variant="body1">
                      {plan.travelers || 'N/A'}
                    </Typography>
                  </Box>
                  {plan.interests && plan.interests.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Interests
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {plan.interests.map((interest, index) => (
                          <Chip key={index} label={interest} size="small" />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {plan.other_interests && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Other Interests
                      </Typography>
                      <Typography variant="body1">
                        {plan.other_interests}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Appointment Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon />
                  Appointment Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {plan.appointment_start && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ScheduleIcon fontSize="small" />
                        Start Time
                      </Typography>
                      <Typography variant="body1">
                        {dayjs(plan.appointment_start).format('MMMM DD, YYYY [at] HH:mm')}
                      </Typography>
                    </Box>
                  )}
                  {plan.appointment_end && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        End Time
                      </Typography>
                      <Typography variant="body1">
                        {dayjs(plan.appointment_end).format('MMMM DD, YYYY [at] HH:mm')}
                      </Typography>
                    </Box>
                  )}
                  {plan.meeting_link && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Meeting Link
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <MuiLink
                          href={plan.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                        >
                          {plan.meeting_link}
                        </MuiLink>
                      </Box>
                    </Box>
                  )}
                  {plan.google_calendar_event_id && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Google Calendar Event ID
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {plan.google_calendar_event_id}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Information */}
          {plan.amount && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon />
                    Payment Information
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Amount
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${parseFloat(plan.amount).toFixed(2)}
                      </Typography>
                    </Box>
                    {plan.paid_at && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CheckCircleIcon fontSize="small" />
                          Paid At
                        </Typography>
                        <Typography variant="body1">
                          {dayjs(plan.paid_at).format('MMMM DD, YYYY [at] HH:mm')}
                        </Typography>
                      </Box>
                    )}
                    {plan.stripe_payment_intent_id && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Stripe Payment Intent ID
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {plan.stripe_payment_intent_id}
                        </Typography>
                      </Box>
                    )}
                    {plan.stripe_session_id && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Stripe Session ID
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {plan.stripe_session_id}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Specialist Information */}
          {plan.specialist_id && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Specialist Information
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Specialist ID
                    </Typography>
                    <Typography variant="body1">
                      {plan.specialist_id}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Cancellation Information */}
          {plan.canceled_at && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                    <CancelIcon />
                    Cancellation Information
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Canceled At
                      </Typography>
                      <Typography variant="body1">
                        {dayjs(plan.canceled_at).format('MMMM DD, YYYY [at] HH:mm')}
                      </Typography>
                    </Box>
                    {plan.canceled_by && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Canceled By
                        </Typography>
                        <Typography variant="body1">
                          {plan.canceled_by.name || `${plan.canceled_by.type} (ID: ${plan.canceled_by.id})`}
                        </Typography>
                      </Box>
                    )}
                    {plan.cancellation_comment && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Cancellation Comment
                        </Typography>
                        <Typography variant="body1">
                          {plan.cancellation_comment}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Completion Information */}
          {plan.completed_at && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                    <CheckCircleIcon />
                    Completion Information
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Completed At
                      </Typography>
                      <Typography variant="body1">
                        {dayjs(plan.completed_at).format('MMMM DD, YYYY [at] HH:mm')}
                      </Typography>
                    </Box>
                    {plan.completion_comment && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Completion Comment
                        </Typography>
                        <Typography variant="body1">
                          {plan.completion_comment}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Timestamps */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Timestamps
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography variant="body1">
                      {plan.created_at
                        ? dayjs(plan.created_at).format('MMMM DD, YYYY [at] HH:mm')
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {plan.updated_at
                        ? dayjs(plan.updated_at).format('MMMM DD, YYYY [at] HH:mm')
                        : 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default Show;

