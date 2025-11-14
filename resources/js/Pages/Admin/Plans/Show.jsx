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
    Link as MuiLink, CardHeader,
    Avatar,
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
    Details as DetailsIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import {Link, router} from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout.jsx';

const Show = ({plan}) => {
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
                <Box sx={{mb: 3, display: 'flex', alignItems: 'center', gap: 2}}>
                    <Button
                        component={Link}
                        href="/admin/plans"
                        startIcon={<ArrowBackIcon/>}
                        variant="outlined"
                    >
                        Back to Plans
                    </Button>
                    <Typography variant="h4" component="h1">
                        Plan Details
                    </Typography>
                </Box>

                <Card sx={{mb: 3}}>
                    <CardHeader title="Customer information" avatar={<PersonIcon/>}/>
                    <CardContent>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 10, mb: 4,}}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Name
                                </Typography>
                                <Typography variant="body1">
                                    {plan.first_name} {plan.last_name}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary"
                                            sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                    <EmailIcon fontSize="small"/>
                                    Email
                                </Typography>
                                <Typography variant="body1">
                                    {plan.email || 'N/A'}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary"
                                            sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                    <PhoneIcon fontSize="small"/>
                                    Phone
                                </Typography>
                                <Typography variant="body1">
                                    {plan.phone || 'N/A'}
                                </Typography>
                            </Box>
                        </Box>

                    </CardContent>
                </Card>
                <Card sx={{mb: 3}}>
                    <CardHeader title="Travel Information" avatar={<PlaceIcon/>}/>
                    <CardContent>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 4, mb: 4}}>
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
                                    <Box sx={{mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                        {plan.interests.map((interest, index) => (
                                            <Chip key={index} label={interest} size="small"/>
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
                <Card sx={{mb: 3}}>
                    <CardHeader title="Appointment Information" avatar={<CalendarIcon/>}/>
                    <CardContent>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 4, mb: 4,}}>
                            {plan.appointment_start && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary"
                                                sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                        <ScheduleIcon fontSize="small"/>
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
                                    <Box sx={{mt: 0.5}}>
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
                                    <Typography variant="body2" sx={{fontFamily: 'monospace', fontSize: '0.75rem'}}>
                                        {plan.google_calendar_event_id}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Card>
                {plan.amount && (
                    <Card sx={{mb: 3}}>
                        <CardHeader title="Payment Information" avatar={<MoneyIcon/>}/>
                        <CardContent>
                            <Box sx={{display: 'flex', flexDirection: 'row', gap: 4}}>
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
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                            <CheckCircleIcon fontSize="small"/>
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
                                        <Typography variant="body2" sx={{fontFamily: 'monospace', fontSize: '0.75rem'}}>
                                            {plan.stripe_payment_intent_id}
                                        </Typography>
                                    </Box>
                                )}
                                {plan.stripe_session_id && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Stripe Session ID
                                        </Typography>
                                        <Typography variant="body2" sx={{fontFamily: 'monospace', fontSize: '0.75rem'}}>
                                            {plan.stripe_session_id}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>

                    </Card>
                )}
                {/* Specialist Information */}
                {plan.specialist && (
                    <Card sx={{mb: 3}}>
                        <CardHeader 
                            title="Specialist Information" 
                            avatar={
                                plan.specialist.profile_pic ? (
                                    <Avatar
                                        src={plan.specialist.profile_pic.startsWith('http') ? plan.specialist.profile_pic : `/storage/${plan.specialist.profile_pic}`}
                                        alt={plan.specialist.full_name || `${plan.specialist.first_name} ${plan.specialist.last_name}`}
                                        sx={{ width: 40, height: 40 }}
                                    >
                                        {plan.specialist.first_name?.charAt(0)}{plan.specialist.last_name?.charAt(0)}
                                    </Avatar>
                                ) : (
                                    <Avatar sx={{ width: 40, height: 40 }}>
                                        {plan.specialist.first_name?.charAt(0)}{plan.specialist.last_name?.charAt(0)}
                                    </Avatar>
                                )
                            }
                        />
                        <CardContent>
                            <Box sx={{display: 'flex', flexDirection: 'row', gap: 4, mb: 4, flexWrap: 'wrap'}}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Name
                                    </Typography>
                                    <Typography variant="body1">
                                        {plan.specialist.full_name || `${plan.specialist.first_name} ${plan.specialist.last_name}`}
                                    </Typography>
                                </Box>
                                {plan.specialist.email && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                            <EmailIcon fontSize="small"/>
                                            Email
                                        </Typography>
                                        <Typography variant="body1">
                                            {plan.specialist.email}
                                        </Typography>
                                    </Box>
                                )}
                                {plan.specialist.contact_no && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                            <PhoneIcon fontSize="small"/>
                                            Contact Number
                                        </Typography>
                                        <Typography variant="body1">
                                            {plan.specialist.contact_no}
                                        </Typography>
                                    </Box>
                                )}
                                {plan.specialist.country && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                            <PlaceIcon fontSize="small"/>
                                            Country
                                        </Typography>
                                        <Typography variant="body1">
                                            {plan.specialist.country.name}
                                        </Typography>
                                    </Box>
                                )}
                                {plan.specialist.city && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            City
                                        </Typography>
                                        <Typography variant="body1">
                                            {plan.specialist.city}
                                            {plan.specialist.state_province && `, ${plan.specialist.state_province}`}
                                        </Typography>
                                    </Box>
                                )}
                                {plan.specialist.timezone && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Timezone
                                        </Typography>
                                        <Typography variant="body1">
                                            {plan.specialist.timezone}
                                        </Typography>
                                    </Box>
                                )}
                                {plan.specialist.status && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Status
                                        </Typography>
                                        <Chip
                                            label={plan.specialist.status}
                                            color={plan.specialist.status === 'active' ? 'success' : 'default'}
                                            size="small"
                                            sx={{mt: 0.5}}
                                        />
                                    </Box>
                                )}
                            </Box>
                            {plan.specialist.bio && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Bio
                                    </Typography>
                                    <Typography variant="body1" sx={{mt: 0.5}}>
                                        {plan.specialist.bio}
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Cancellation Information */}
                {plan.canceled_at && (
                    <Card sx={{mb: 3}}>
                        <CardHeader title="Cancellation Information" avatar={<CancelIcon/>}/>
                        <CardContent>
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
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
                )}

                {/* Completion Information */}
                {plan.completed_at && (
                    <Card sx={{mb: 3}}>
                        <CardHeader title="Completion Information" avatar={<CheckCircleIcon/>}/>
                        <CardContent>
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
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
                )}

                {/* Timestamps */}
                <Card sx={{mb: 3}}>
                    <CardHeader title="Timestamps" avatar={<DetailsIcon/>}/>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, md: 6}}>
                                <Typography variant="caption" color="text.secondary">
                                    Created At
                                </Typography>
                                <Typography variant="body1">
                                    {plan.created_at
                                        ? dayjs(plan.created_at).format('MMMM DD, YYYY [at] HH:mm')
                                        : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
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
            </Box>
        </AdminLayout>
    );
};

export default Show;
