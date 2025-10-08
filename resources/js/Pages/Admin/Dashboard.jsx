import React from 'react';
import {Typography, Box, Grid, Card, CardContent, CardActions, Button} from '@mui/material';
import {People as PeopleIcon, TrendingUp as TrendingUpIcon} from '@mui/icons-material';
import {Link} from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

const AdminDashboard = ({specialistsCount = 0}) => {
    return (
        <AdminLayout>
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    Admin Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{mb: 4}}>
                    Welcome to the admin portal. Manage specialists and monitor system activity.
                </Typography>

                <Grid container spacing={3}>
                    <Grid item size={{xs: 12, sm: 6, md: 3}}>
                        <Card>
                            <CardContent>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <PeopleIcon sx={{fontSize: 40, color: 'primary.main', mr: 2}}/>
                                    <Box>
                                        <Typography variant="h4" component="div">
                                            {specialistsCount}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Specialists
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button component={Link} href="/admin/specialists">
                                    View All
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </AdminLayout>
    );
};

export default AdminDashboard;
