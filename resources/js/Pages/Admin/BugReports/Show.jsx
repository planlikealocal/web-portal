import React, {useState} from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
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
import Grid from '@mui/material/Grid';
import {
    ArrowBack as ArrowBackIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    BugReport as BugReportIcon,
    CalendarToday as CalendarIcon,
    Image as ImageIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import {Link, router, usePage} from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout.jsx';

const issueTypeLabels = {
    ui_issue: 'UI Issue',
    crash: 'Crash',
    performance: 'Performance',
    feature_request: 'Feature Request',
    other: 'Other',
};

const Show = ({bugReport, screenshotUrl}) => {
    const {flash} = usePage().props;
    const [status, setStatus] = useState(bugReport.status || 'new');
    const [adminNotes, setAdminNotes] = useState(bugReport.admin_notes || '');
    const [updating, setUpdating] = useState(false);

    const getStatusColor = (status) => {
        const colors = {
            new: 'primary',
            in_review: 'warning',
            resolved: 'success',
            closed: 'default',
        };
        return colors[status] || 'default';
    };

    const getIssueTypeColor = (type) => {
        const colors = {
            crash: 'error',
            ui_issue: 'warning',
            performance: 'info',
            feature_request: 'success',
            other: 'default',
        };
        return colors[type] || 'default';
    };

    const handleUpdateStatus = () => {
        setUpdating(true);
        router.post(`/admin/bug-reports/${bugReport.id}/update-status`, {
            status,
            admin_notes: adminNotes,
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
                        href="/admin/bug-reports"
                        startIcon={<ArrowBackIcon/>}
                        variant="outlined"
                    >
                        Back to Bug Reports
                    </Button>
                    <Typography variant="h4" component="h1">
                        Bug Report Details
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
                                title="Reporter Information"
                                avatar={<PersonIcon/>}
                            />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="caption" color="text.secondary">
                                            Name
                                        </Typography>
                                        <Typography variant="body1" sx={{mb: 2}}>
                                            {bugReport.user?.name || 'N/A'}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                            <EmailIcon fontSize="small"/>
                                            Email
                                        </Typography>
                                        <Typography variant="body1" sx={{mb: 2}}>
                                            <a href={`mailto:${bugReport.user?.email}`}>{bugReport.user?.email || 'N/A'}</a>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card sx={{mb: 3}}>
                            <CardHeader
                                title="Bug Report Details"
                                avatar={<BugReportIcon/>}
                            />
                            <CardContent>
                                <Box sx={{mb: 2}}>
                                    <Typography variant="caption" color="text.secondary">
                                        Issue Type
                                    </Typography>
                                    <Box sx={{mt: 1}}>
                                        <Chip
                                            label={issueTypeLabels[bugReport.issue_type] || bugReport.issue_type}
                                            color={getIssueTypeColor(bugReport.issue_type)}
                                        />
                                    </Box>
                                </Box>
                                <Divider sx={{my: 2}}/>
                                <Box sx={{mb: 2}}>
                                    <Typography variant="caption" color="text.secondary">
                                        Title
                                    </Typography>
                                    <Typography variant="h6" sx={{mt: 0.5}}>
                                        {bugReport.title}
                                    </Typography>
                                </Box>
                                <Divider sx={{my: 2}}/>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Description
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
                                        {bugReport.description}
                                    </Paper>
                                </Box>

                                {screenshotUrl && (
                                    <>
                                        <Divider sx={{my: 2}}/>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary"
                                                        sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                                <ImageIcon fontSize="small"/>
                                                Screenshot
                                            </Typography>
                                            <Box sx={{mt: 1}}>
                                                <a href={screenshotUrl} target="_blank" rel="noopener noreferrer">
                                                    <img
                                                        src={screenshotUrl}
                                                        alt="Bug report screenshot"
                                                        style={{
                                                            maxWidth: '100%',
                                                            maxHeight: 400,
                                                            borderRadius: 8,
                                                            border: '1px solid #dee2e6',
                                                            cursor: 'pointer',
                                                        }}
                                                    />
                                                </a>
                                            </Box>
                                        </Box>
                                    </>
                                )}
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
                                        <MenuItem value="in_review">In Review</MenuItem>
                                        <MenuItem value="resolved">Resolved</MenuItem>
                                        <MenuItem value="closed">Closed</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    label="Admin Notes"
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add any notes about this bug report..."
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
                                        {dayjs(bugReport.created_at).format('YYYY-MM-DD HH:mm:ss')}
                                    </Typography>
                                </Box>

                                {bugReport.updated_at && (
                                    <Box sx={{mt: 2}}>
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 1}}>
                                            <CalendarIcon fontSize="small"/>
                                            Last Updated
                                        </Typography>
                                        <Typography variant="body2">
                                            {dayjs(bugReport.updated_at).format('YYYY-MM-DD HH:mm:ss')}
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{mt: 2}}>
                                    <Typography variant="caption" color="text.secondary" sx={{mb: 1}}>
                                        Current Status
                                    </Typography>
                                    <Box sx={{mt: 0.5}}>
                                        <Chip
                                            label={bugReport.status === 'in_review' ? 'In Review' : bugReport.status.charAt(0).toUpperCase() + bugReport.status.slice(1)}
                                            color={getStatusColor(bugReport.status)}
                                            size="small"
                                        />
                                    </Box>
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
