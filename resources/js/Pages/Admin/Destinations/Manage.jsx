import React, {useState} from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Fab,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import {router, usePage} from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout.jsx';

const Manage = (props) => {
    const {destination} = props;
    const [basicInfo, setBasicInfo] = useState({
        name: destination.name || '',
        description: destination.description || '',
        overview_title: destination.overview_title || '',
        overview: destination.overview || '',
    });
    const [basicInfoErrors, setBasicInfoErrors] = useState({});
    const [savingBasicInfo, setSavingBasicInfo] = useState(false);

    // Dialog states
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [seasonDialogOpen, setSeasonDialogOpen] = useState(false);
    const [activityDialogOpen, setActivityDialogOpen] = useState(false);
    const [itineraryDialogOpen, setItineraryDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const handleBasicInfoChange = (field) => (event) => {
        setBasicInfo(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        if (basicInfoErrors[field]) {
            setBasicInfoErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const handleSaveBasicInfo = () => {
        setSavingBasicInfo(true);
        setBasicInfoErrors({});

        router.post(`/admin/destinations/${destination.id}`, basicInfo, {
            onSuccess: () => {
                setSavingBasicInfo(false);
            },
            onError: (errors) => {
                setSavingBasicInfo(false);
                setBasicInfoErrors(errors);
            },
        });
    };

    const handleAddImage = () => {
        setEditingItem(null);
        setImageDialogOpen(true);
    };

    const handleEditImage = (image) => {
        setEditingItem(image);
        setImageDialogOpen(true);
    };

    const handleDeleteImage = (imageId) => {
        if (confirm('Are you sure you want to delete this image?')) {
            router.delete(`/admin/destinations/${destination.id}/images/${imageId}`);
        }
    };

    const handleAddSeason = () => {
        setEditingItem(null);
        setSeasonDialogOpen(true);
    };

    const handleEditSeason = (season) => {
        setEditingItem(season);
        setSeasonDialogOpen(true);
    };

    const handleDeleteSeason = (seasonId) => {
        if (confirm('Are you sure you want to delete this season?')) {
            router.delete(`/admin/destinations/${destination.id}/seasons/${seasonId}`);
        }
    };

    const handleAddActivity = () => {
        setEditingItem(null);
        setActivityDialogOpen(true);
    };

    const handleEditActivity = (activity) => {
        setEditingItem(activity);
        setActivityDialogOpen(true);
    };

    const handleDeleteActivity = (activityId) => {
        if (confirm('Are you sure you want to delete this activity?')) {
            router.delete(`/admin/destinations/${destination.id}/activities/${activityId}`);
        }
    };

    const handleAddItinerary = () => {
        setEditingItem(null);
        setItineraryDialogOpen(true);
    };

    const handleEditItinerary = (itinerary) => {
        setEditingItem(itinerary);
        setItineraryDialogOpen(true);
    };

    const handleDeleteItinerary = (itineraryId) => {
        if (confirm('Are you sure you want to delete this itinerary?')) {
            router.delete(`/admin/destinations/${destination.id}/itineraries/${itineraryId}`);
        }
    };

    return (
        <AdminLayout>
            <Box sx={{p: 3}}>
                <Typography variant="h4" component="h1" sx={{mb: 3}}>
                    Manage Destination: {destination.name}
                </Typography>

                {/* Section 1: Basic Information */}
                <Card sx={{mb: 3}}>
                    <CardContent>
                        <Typography variant="h6" sx={{mb: 2}}>
                            1. Basic Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Name"
                                    value={basicInfo.name}
                                    onChange={handleBasicInfoChange('name')}
                                    error={!!basicInfoErrors.name}
                                    helperText={basicInfoErrors.name}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Overview Title"
                                    value={basicInfo.overview_title}
                                    onChange={handleBasicInfoChange('overview_title')}
                                    error={!!basicInfoErrors.overview_title}
                                    helperText={basicInfoErrors.overview_title}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    value={basicInfo.description}
                                    onChange={handleBasicInfoChange('description')}
                                    error={!!basicInfoErrors.description}
                                    helperText={basicInfoErrors.description}
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Overview"
                                    value={basicInfo.overview}
                                    onChange={handleBasicInfoChange('overview')}
                                    error={!!basicInfoErrors.overview}
                                    helperText={basicInfoErrors.overview}
                                    fullWidth
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSaveBasicInfo}
                                    disabled={savingBasicInfo}
                                >
                                    {savingBasicInfo ? 'Saving...' : 'Save Basic Information'}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Section 2: Destination Images */}
                <Card sx={{mb: 3}}>
                    <CardContent>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                            <Typography variant="h6">
                                2. Destination Images
                            </Typography>
                            <Fab size="small" color="primary" onClick={handleAddImage}>
                                <AddIcon />
                            </Fab>
                        </Box>
                        <Grid container spacing={2}>
                            {destination.images?.map((image) => (
                                <Grid item xs={12} sm={6} md={4} key={image.id}>
                                    <Card>
                                        <Box sx={{position: 'relative'}}>
                                            <Box
                                                component="img"
                                                src={image.url}
                                                alt={image.name}
                                                sx={{
                                                    width: '100%',
                                                    height: 150,
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <Box sx={{position: 'absolute', top: 8, right: 8}}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditImage(image)}
                                                    sx={{bgcolor: 'white', mr: 1}}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteImage(image.id)}
                                                    sx={{bgcolor: 'white'}}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        <CardContent sx={{p: 1}}>
                                            <Typography variant="subtitle2" noWrap>
                                                {image.name}
                                            </Typography>
                                            <Chip 
                                                label={image.image_type} 
                                                size="small" 
                                                color="primary" 
                                                variant="outlined"
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {(!destination.images || destination.images.length === 0) && (
                                <Grid item xs={12}>
                                    <Typography color="text.secondary" textAlign="center">
                                        No images added yet. Click the + button to add images.
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Section 3: Destination Seasons */}
                <Card sx={{mb: 3}}>
                    <CardContent>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                            <Typography variant="h6">
                                3. Destination Seasons
                            </Typography>
                            <Fab size="small" color="primary" onClick={handleAddSeason}>
                                <AddIcon />
                            </Fab>
                        </Box>
                        <Grid container spacing={2}>
                            {destination.seasons?.map((season) => (
                                <Grid item xs={12} sm={6} md={4} key={season.id}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1}}>
                                                <Typography variant="h6">{season.name}</Typography>
                                                <Box>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditSeason(season)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteSeason(season.id)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                                Duration: {season.duration}
                                            </Typography>
                                            <Typography variant="body2">
                                                {season.description}
                                            </Typography>
                                            <Chip 
                                                label={season.status ? 'Active' : 'Inactive'} 
                                                size="small" 
                                                color={season.status ? 'success' : 'default'}
                                                sx={{mt: 1}}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {(!destination.seasons || destination.seasons.length === 0) && (
                                <Grid item xs={12}>
                                    <Typography color="text.secondary" textAlign="center">
                                        No seasons added yet. Click the + button to add seasons.
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Section 4: Destination Activities */}
                <Card sx={{mb: 3}}>
                    <CardContent>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                            <Typography variant="h6">
                                4. Destination Activities
                            </Typography>
                            <Fab size="small" color="primary" onClick={handleAddActivity}>
                                <AddIcon />
                            </Fab>
                        </Box>
                        <Grid container spacing={2}>
                            {destination.activities?.map((activity) => (
                                <Grid item xs={12} sm={6} md={4} key={activity.id}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1}}>
                                                <Typography variant="h6">{activity.name}</Typography>
                                                <Box>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditActivity(activity)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteActivity(activity.id)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            {activity.image_url && (
                                                <Box
                                                    component="img"
                                                    src={activity.image_url}
                                                    alt={activity.name}
                                                    sx={{
                                                        width: '100%',
                                                        height: 100,
                                                        objectFit: 'cover',
                                                        borderRadius: 1,
                                                        mb: 1,
                                                    }}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {(!destination.activities || destination.activities.length === 0) && (
                                <Grid item xs={12}>
                                    <Typography color="text.secondary" textAlign="center">
                                        No activities added yet. Click the + button to add activities.
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Section 5: Destination Itineraries */}
                <Card sx={{mb: 3}}>
                    <CardContent>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                            <Typography variant="h6">
                                5. Destination Itineraries
                            </Typography>
                            <Fab size="small" color="primary" onClick={handleAddItinerary}>
                                <AddIcon />
                            </Fab>
                        </Box>
                        <Grid container spacing={2}>
                            {destination.itineraries?.map((itinerary) => (
                                <Grid item xs={12} sm={6} md={4} key={itinerary.id}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1}}>
                                                <Typography variant="h6">{itinerary.title}</Typography>
                                                <Box>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditItinerary(itinerary)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteItinerary(itinerary.id)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <Typography variant="body2" sx={{mb: 1}}>
                                                {itinerary.description}
                                            </Typography>
                                            {itinerary.image_url && (
                                                <Box
                                                    component="img"
                                                    src={itinerary.image_url}
                                                    alt={itinerary.title}
                                                    sx={{
                                                        width: '100%',
                                                        height: 100,
                                                        objectFit: 'cover',
                                                        borderRadius: 1,
                                                        mb: 1,
                                                    }}
                                                />
                                            )}
                                            <Chip 
                                                label={itinerary.status} 
                                                size="small" 
                                                color={itinerary.status === 'active' ? 'success' : 'default'}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {(!destination.itineraries || destination.itineraries.length === 0) && (
                                <Grid item xs={12}>
                                    <Typography color="text.secondary" textAlign="center">
                                        No itineraries added yet. Click the + button to add itineraries.
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </AdminLayout>
    );
};

export default Manage;
