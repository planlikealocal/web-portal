import React, {useState} from 'react';
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
    CardHeader,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    Work as WorkIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import {Link, router, usePage} from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout.jsx';

const Show = ({application}) => {
    const {flash} = usePage().props;
    const [status, setStatus] = useState(application.status || 'new');
    const [notes, setNotes] = useState(application.notes || '');
    const [updating, setUpdating] = useState(false);

    const getStatusColor = (status) => {
        const colors = {
            new: 'primary',
            reviewed: 'warning',
            approved: 'success',
            rejected: 'error',
        };
        return colors[status] || 'default';
    };

    const handleUpdateStatus = () => {
        setUpdating(true);
        router.post(`/admin/specialist-applications/${application.id}/update-status`, {
            status,
            notes,
        }, {
            onSuccess: () => {
                setUpdating(false);
            },
            onError: () => {
                setUpdating(false);
            },
        });
    };

    return (
        <AdminLayout>
            <Box>
                <Box sx={{mb: 3, display: 'flex', alignItems: 'center', gap: 2}}>
                    <Button
                        component={Link}
                        href="/admin/specialist-applications"
                        startIcon={<ArrowBackIcon/>}
                        variant="outlined"
                    >
                        Back to Applications
                    </Button>
                    <Typography variant="h4" component="h1">
                        Specialist Application Details
                    </Typography>
                </Box>

                {flash?.success && (
                    <Alert severity="success" sx={{mb: 3}}>
                        {flash.success}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    <Grid size={{xs: 12, md: 8}}>
                        <Card sx={{mb: 3}}>
                            <CardHeader
                                title="Index Information"
                                avatar={<PersonIcon/>}
                            />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="caption" color="text.secondary">
                                            First Name
                                        </Typography>
                                        <Typography variant="body1" sx={{mb: 2}}>
                                            {application.first_name}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="caption" color="text.secondary">
                                            Last Name
                                        </Typography>
                                        <Typography variant="body1" sx={{mb: 2}}>
                                            {application.last_name}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 12}}>
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                            <EmailIcon fontSize="small"/>
                                            Email
                                        </Typography>
                                        <Typography variant="body1" sx={{mb: 2}}>
                                            <a href={`mailto:${application.email}`}>{application.email}</a>
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                            <LocationIcon fontSize="small"/>
                                            City & State
                                        </Typography>
                                        <Typography variant="body1" sx={{mb: 2}}>
                                            {application.city_state}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                            <PhoneIcon fontSize="small"/>
                                            Phone
                                        </Typography>
                                        <Typography variant="body1" sx={{mb: 2}}>
                                            {application.phone}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card sx={{mb: 3}}>
                            <CardHeader
                                title="Application Details"
                                avatar={<WorkIcon/>}
                            />
                            <CardContent>
                                <Box sx={{mb: 3}}>
                                    <Typography variant="caption" color="text.secondary">
                                        What is this destination known for?
                                    </Typography>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            mt: 1,
                                            backgroundColor: 'grey.50',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {application.destination_known_for}
                                    </Paper>
                                </Box>
                                <Divider sx={{my: 2}}/>
                                <Box sx={{mb: 3}}>
                                    <Typography variant="caption" color="text.secondary">
                                        What make you a qualified expert?
                                    </Typography>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            mt: 1,
                                            backgroundColor: 'grey.50',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {application.qualified_expert}
                                    </Paper>
                                </Box>
                                <Divider sx={{my: 2}}/>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Best way to contact
                                    </Typography>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            mt: 1,
                                            backgroundColor: 'grey.50',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {application.best_way_to_contact}
                                    </Paper>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, md: 4}}>
                        <Card>
                            <CardHeader title="Status & Notes"/>
                            <CardContent>
                                <FormControl fullWidth sx={{mb: 2}}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={status}
                                        label="Status"
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <MenuItem value="new">New</MenuItem>
                                        <MenuItem value="reviewed">Reviewed</MenuItem>
                                        <MenuItem value="approved">Approved</MenuItem>
                                        <MenuItem value="rejected">Rejected</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    label="Notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any notes about this application..."
                                    sx={{mb: 2}}
                                />

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleUpdateStatus}
                                    disabled={updating}
                                >
                                    {updating ? 'Updating...' : 'Update Status'}
                                </Button>

                                <Divider sx={{my: 3}}/>

                                <Box>
                                    <Typography variant="caption" color="text.secondary"
                                                sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 1}}>
                                        <CalendarIcon fontSize="small"/>
                                        Created At
                                    </Typography>
                                    <Typography variant="body2">
                                        {dayjs(application.created_at).format('YYYY-MM-DD HH:mm:ss')}
                                    </Typography>
                                </Box>

                                {application.updated_at && (
                                    <Box sx={{mt: 2}}>
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 1}}>
                                            <CalendarIcon fontSize="small"/>
                                            Last Updated
                                        </Typography>
                                        <Typography variant="body2">
                                            {dayjs(application.updated_at).format('YYYY-MM-DD HH:mm:ss')}
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{mt: 2}}>
                                    <Typography variant="caption" color="text.secondary" sx={{mb: 1}}>
                                        Current Status
                                    </Typography>
                                    <Chip
                                        label={application.status}
                                        color={getStatusColor(application.status)}
                                        size="small"
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </AdminLayout>
    );
};

export default Show;

