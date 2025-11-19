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
    ContactMail as ContactMailIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    Topic as TopicIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import {Link, router, usePage} from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout.jsx';

const Show = ({contactRequest}) => {
    const {flash} = usePage().props;
    const [status, setStatus] = useState(contactRequest.status || 'new');
    const [notes, setNotes] = useState(contactRequest.notes || '');
    const [updating, setUpdating] = useState(false);

    const getStatusColor = (status) => {
        const colors = {
            new: 'primary',
            contacted: 'warning',
            resolved: 'success',
        };
        return colors[status] || 'default';
    };

    const handleUpdateStatus = () => {
        setUpdating(true);
        router.post(`/admin/contact-requests/${contactRequest.id}/update-status`, {
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
                        href="/admin/contact-requests"
                        startIcon={<ArrowBackIcon/>}
                        variant="outlined"
                    >
                        Back to Contact Requests
                    </Button>
                    <Typography variant="h4" component="h1">
                        Contact Request Details
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
                                title="Contact Information"
                                avatar={<PersonIcon/>}
                            />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="caption" color="text.secondary">
                                            First Name
                                        </Typography>
                                        <Typography variant="body1" sx={{mb: 2}}>
                                            {contactRequest.first_name}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="caption" color="text.secondary">
                                            Last Name
                                        </Typography>
                                        <Typography variant="body1" sx={{mb: 2}}>
                                            {contactRequest.last_name}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 12}}>
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                            <EmailIcon fontSize="small"/>
                                            Email
                                        </Typography>
                                        <Typography variant="body1" sx={{mb: 2}}>
                                            <a href={`mailto:${contactRequest.email}`}>{contactRequest.email}</a>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card sx={{mb: 3}}>
                            <CardHeader
                                title="Message Details"
                                avatar={<ContactMailIcon/>}
                            />
                            <CardContent>
                                <Box sx={{mb: 2}}>
                                    <Typography variant="caption" color="text.secondary"
                                                sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                        <TopicIcon fontSize="small"/>
                                        Topic
                                    </Typography>
                                    <Chip
                                        label={contactRequest.topic}
                                        color="primary"
                                        sx={{mt: 1}}
                                    />
                                </Box>
                                <Divider sx={{my: 2}}/>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Message
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
                                        {contactRequest.message}
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
                                        <MenuItem value="contacted">Contacted</MenuItem>
                                        <MenuItem value="resolved">Resolved</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    label="Notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any notes about this contact request..."
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
                                        {dayjs(contactRequest.created_at).format('YYYY-MM-DD HH:mm:ss')}
                                    </Typography>
                                </Box>

                                {contactRequest.updated_at && (
                                    <Box sx={{mt: 2}}>
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 1}}>
                                            <CalendarIcon fontSize="small"/>
                                            Last Updated
                                        </Typography>
                                        <Typography variant="body2">
                                            {dayjs(contactRequest.updated_at).format('YYYY-MM-DD HH:mm:ss')}
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{mt: 2}}>
                                    <Typography variant="caption" color="text.secondary" sx={{mb: 1}}>
                                        Current Status
                                    </Typography>
                                    <Chip
                                        label={contactRequest.status}
                                        color={getStatusColor(contactRequest.status)}
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

