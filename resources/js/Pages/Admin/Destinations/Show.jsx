import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Button,
    Tabs,
    Tab,
    Paper,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    LocationOn as LocationIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout.jsx';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`destination-tabpanel-${index}`}
            aria-labelledby={`destination-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

const Show = ({ destination }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleBack = () => {
        router.visit('/admin/destinations');
    };

    const handleManage = () => {
        router.visit(`/admin/destinations/${destination.id}/manage`);
    };

    return (
        <AdminLayout>
            <Box sx={{ p: 3 }}>
                {/* Header Section */}
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                        variant="outlined"
                    >
                        Back to Destinations
                    </Button>
                    <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                        {destination.name}
                    </Typography>
                    <Chip
                        label={destination.status === 'active' ? 'Active' : destination.status === 'draft' ? 'Draft' : 'Inactive'}
                        color={destination.status === 'active' ? 'success' : destination.status === 'draft' ? 'warning' : 'error'}
                        variant="outlined"
                    />
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleManage}
                        color="primary"
                    >
                        Manage
                    </Button>
                </Box>

                {/* Banner Image Section */}
                {destination.banner_image && (
                    <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                        <img
                            src={destination.banner_image}
                            alt={destination.name}
                            style={{
                                width: '100%',
                                height: '300px',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>
                )}

                {/* Location Info */}
                {(destination.country || destination.state_province || destination.city) && (
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon color="action" />
                        <Typography variant="body1" color="text.secondary">
                            {[destination.city, destination.state_province, destination.country?.name].filter(Boolean).join(', ') || destination.full_location}
                        </Typography>
                    </Box>
                )}

                {/* Tabs Section */}
                <Paper sx={{ width: '100%', mb: 3 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="destination preview tabs"
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 500,
                            },
                        }}
                    >
                        <Tab label="Overview" id="destination-tab-0" aria-controls="destination-tabpanel-0" />
                        <Tab label={`Images (${destination.images?.length || 0})`} id="destination-tab-1" aria-controls="destination-tabpanel-1" />
                        <Tab label={`Seasons (${destination.seasons?.length || 0})`} id="destination-tab-2" aria-controls="destination-tabpanel-2" />
                        <Tab label={`Activities (${destination.activities?.length || 0})`} id="destination-tab-3" aria-controls="destination-tabpanel-3" />
                        <Tab label={`Itineraries (${destination.itineraries?.length || 0})`} id="destination-tab-4" aria-controls="destination-tabpanel-4" />
                    </Tabs>
                </Paper>

                {/* Tab Panels */}
                {/* Overview Tab */}
                <TabPanel value={activeTab} index={0}>
                    <Grid container spacing={3}>
                        {/* Main Images */}
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                {destination.home_image && (
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Home Page Image
                                                </Typography>
                                                <Box
                                                    component="img"
                                                    src={destination.home_image}
                                                    alt="Home page"
                                                    sx={{
                                                        width: '100%',
                                                        height: 250,
                                                        objectFit: 'cover',
                                                        borderRadius: 1,
                                                    }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                                {destination.grid_image && (
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Grid Image
                                                </Typography>
                                                <Box
                                                    component="img"
                                                    src={destination.grid_image}
                                                    alt="Grid"
                                                    sx={{
                                                        width: '100%',
                                                        height: 250,
                                                        objectFit: 'cover',
                                                        borderRadius: 1,
                                                    }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>

                        {/* Description */}
                        {destination.description && (
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Description
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {destination.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                        {/* Overview */}
                        {destination.overview_title && (
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {destination.overview_title}
                                        </Typography>
                                        {destination.overview && (
                                            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                                                {destination.overview}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* Images Tab */}
                <TabPanel value={activeTab} index={1}>
                    {destination.images && destination.images.length > 0 ? (
                        <Grid container spacing={2}>
                            {destination.images.map((image) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={image.url}
                                            alt={image.name}
                                            sx={{
                                                width: '100%',
                                                height: 200,
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" gutterBottom>
                                                {image.name}
                                            </Typography>
                                            {image.description && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {image.description}
                                                </Typography>
                                            )}
                                            <Chip
                                                label={image.image_type}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{ mt: 1 }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 8,
                                border: '2px dashed #e0e0e0',
                                borderRadius: 2,
                                bgcolor: '#fafafa',
                            }}
                        >
                            <Typography variant="h6" color="text.secondary">
                                No images available
                            </Typography>
                        </Box>
                    )}
                </TabPanel>

                {/* Seasons Tab */}
                <TabPanel value={activeTab} index={2}>
                    {destination.seasons && destination.seasons.length > 0 ? (
                        <Grid container spacing={2}>
                            {destination.seasons.map((season) => (
                                <Grid item xs={12} sm={6} md={4} key={season.id}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Typography variant="h6">{season.name}</Typography>
                                                <Chip
                                                    label={season.status ? 'Active' : 'Inactive'}
                                                    size="small"
                                                    color={season.status ? 'success' : 'default'}
                                                />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Duration: {season.duration}
                                            </Typography>
                                            {season.description && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    {season.description}
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 8,
                                border: '2px dashed #e0e0e0',
                                borderRadius: 2,
                                bgcolor: '#fafafa',
                            }}
                        >
                            <Typography variant="h6" color="text.secondary">
                                No seasons available
                            </Typography>
                        </Box>
                    )}
                </TabPanel>

                {/* Activities Tab */}
                <TabPanel value={activeTab} index={3}>
                    {destination.activities && destination.activities.length > 0 ? (
                        <Grid container spacing={2}>
                            {destination.activities.map((activity) => (
                                <Grid item xs={12} sm={6} md={4} key={activity.id}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Typography variant="h6">{activity.name}</Typography>
                                                <Chip
                                                    label={activity.status ? 'Active' : 'Inactive'}
                                                    size="small"
                                                    color={activity.status ? 'success' : 'default'}
                                                />
                                            </Box>
                                            {activity.description && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    {activity.description}
                                                </Typography>
                                            )}
                                            {activity.image_url && (
                                                <Box
                                                    component="img"
                                                    src={activity.image_url}
                                                    alt={activity.name}
                                                    sx={{
                                                        width: '100%',
                                                        height: 150,
                                                        objectFit: 'cover',
                                                        borderRadius: 1,
                                                        mt: 1,
                                                    }}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 8,
                                border: '2px dashed #e0e0e0',
                                borderRadius: 2,
                                bgcolor: '#fafafa',
                            }}
                        >
                            <Typography variant="h6" color="text.secondary">
                                No activities available
                            </Typography>
                        </Box>
                    )}
                </TabPanel>

                {/* Itineraries Tab */}
                <TabPanel value={activeTab} index={4}>
                    {destination.itineraries && destination.itineraries.length > 0 ? (
                        <Grid container spacing={2}>
                            {destination.itineraries.map((itinerary) => (
                                <Grid item xs={12} sm={6} md={4} key={itinerary.id}>
                                    <Card>
                                        {itinerary.image_url && (
                                            <Box
                                                component="img"
                                                src={itinerary.image_url}
                                                alt={itinerary.title}
                                                sx={{
                                                    width: '100%',
                                                    height: 200,
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        )}
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Typography variant="h6">{itinerary.title}</Typography>
                                                <Chip
                                                    label={itinerary.status}
                                                    size="small"
                                                    color={
                                                        itinerary.status === 'active'
                                                            ? 'success'
                                                            : itinerary.status === 'draft'
                                                            ? 'warning'
                                                            : 'default'
                                                    }
                                                />
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {itinerary.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 8,
                                border: '2px dashed #e0e0e0',
                                borderRadius: 2,
                                bgcolor: '#fafafa',
                            }}
                        >
                            <Typography variant="h6" color="text.secondary">
                                No itineraries available
                            </Typography>
                        </Box>
                    )}
                </TabPanel>
            </Box>
        </AdminLayout>
    );
};

export default Show;
