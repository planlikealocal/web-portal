import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Chip,
    Button,
    Divider,
} from '@mui/material';
import {ArrowBack as ArrowBackIcon, Edit as EditIcon} from '@mui/icons-material';
import {router} from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

const SpecialistShow = ({specialist}) => {
    const handleEdit = () => {
        router.visit(`/admin/specialists/${specialist.id}/edit`);
    };

    const handleBack = () => {
        router.visit('/admin/specialists');
    };

    return (
        <AdminLayout>
            <Box sx={{p: 3}}>
                <Box sx={{mb: 3, display: 'flex', alignItems: 'center', gap: 2}}>
                    <Button
                        startIcon={<ArrowBackIcon/>}
                        onClick={handleBack}
                        variant="outlined"
                    >
                        Back to Specialists
                    </Button>
                    <Typography variant="h4" component="h1">
                        Specialist Details
                    </Typography>
                </Box>

                <Card>
                    <CardContent>
                        <Grid container spacing={3}>
                            {/* Profile Section */}
                            <Grid item xs={12} md={4}>
                                <Box sx={{textAlign: 'center'}}>
                                    {specialist.profile_pic ? (
                                        <Avatar
                                            src={specialist.profile_pic.startsWith('http') ? specialist.profile_pic : `/storage/${specialist.profile_pic}`}
                                            alt={`${specialist.first_name} ${specialist.last_name}`}
                                            sx={{
                                                width: 150,
                                                height: 150,
                                                mx: 'auto',
                                                mb: 2,
                                            }}
                                        />
                                    ) : (
                                        <Avatar
                                            sx={{
                                                width: 150,
                                                height: 150,
                                                mx: 'auto',
                                                mb: 2,
                                                fontSize: '3rem',
                                            }}
                                        >
                                            {specialist.first_name.charAt(0)}{specialist.last_name.charAt(0)}
                                        </Avatar>
                                    )}
                                    <Typography variant="h5" gutterBottom>
                                        {specialist.first_name} {specialist.last_name}
                                    </Typography>
                                    <Chip
                                        label={specialist.status}
                                        color={specialist.status === 'active' ? 'success' : 'error'}
                                        sx={{mb: 2}}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {specialist.no_of_trips} trips completed
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Details Section */}
                            <Grid item xs={12} md={8}>
                                <Box sx={{mb: 3}}>
                                    <Typography variant="h6" gutterBottom>
                                        Contact Information
                                    </Typography>
                                    <Divider sx={{mb: 2}}/>
                                    <Grid container spacing={2}>
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
                                    </Grid>
                                </Box>

                                <Box sx={{mb: 3}}>
                                    <Typography variant="h6" gutterBottom>
                                        Location Information
                                    </Typography>
                                    <Divider sx={{mb: 2}}/>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Country
                                            </Typography>
                                            <Typography variant="body1">
                                                {specialist.country}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                State/Province
                                            </Typography>
                                            <Typography variant="body1">
                                                {specialist.state_province}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                City
                                            </Typography>
                                            <Typography variant="body1">
                                                {specialist.city}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Postal Code
                                            </Typography>
                                            <Typography variant="body1">
                                                {specialist.postal_code}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary">
                                                Address
                                            </Typography>
                                            <Typography variant="body1">
                                                {specialist.address}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {specialist.bio && (
                                    <Box sx={{mb: 3}}>
                                        <Typography variant="h6" gutterBottom>
                                            Biography
                                        </Typography>
                                        <Divider sx={{mb: 2}}/>
                                        <Typography variant="body1">
                                            {specialist.bio}
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{mt: 3}}>
                                    <Button
                                        variant="contained"
                                        startIcon={<EditIcon/>}
                                        onClick={handleEdit}
                                    >
                                        Edit Specialist
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </AdminLayout>
    );
};

export default SpecialistShow;
