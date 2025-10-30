import React, {useState, useEffect} from 'react';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    CloudUpload as UploadIcon,
    ToggleOn as ToggleOnIcon,
    ToggleOff as ToggleOffIcon,
} from '@mui/icons-material';
import {router, usePage} from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout.jsx';
import ImageUploader from '../../../Components/ImageUploader.jsx';
import MultiSelect from '../../../Components/MultiSelect.jsx';
import ImageUploadDialog from '../../../Components/ImageUploadDialog.jsx';
import SeasonDialog from '../../../Components/SeasonDialog.jsx';
import ActivityDialog from '../../../Components/ActivityDialog.jsx';
import ActivityBulkUploadDialog from '../../../Components/ActivityBulkUploadDialog.jsx';
import ItineraryDialog from '../../../Components/ItineraryDialog.jsx';

const Manage = (props) => {
    const {destination, specialists = [], countries = []} = props;
    const [basicInfo, setBasicInfo] = useState({
        name: destination.name || '',
        description: destination.description || '',
        overview_title: destination.overview_title || '',
        overview: destination.overview || '',
        home_image: destination.home_image || null,
        grid_image: destination.grid_image || null,
        banner_image: destination.banner_image || null,
        country_id: destination.country_id || null,
        state_province: destination.state_province || null,
        specialist_ids: destination.specialist_ids ?
            (Array.isArray(destination.specialist_ids) ? destination.specialist_ids : destination.specialist_ids.split(',').map(id => parseInt(id.trim()))) :
            [],
    });
    const [basicInfoErrors, setBasicInfoErrors] = useState({});
    const [savingBasicInfo, setSavingBasicInfo] = useState(false);
    const [filteredSpecialists, setFilteredSpecialists] = useState(specialists);

    // Initialize filtered specialists
    useEffect(() => {
        setFilteredSpecialists(specialists);
    }, [specialists]);

    // Function to fetch specialists by country
    const fetchSpecialistsByCountry = async (countryId) => {
        try {
            const response = await fetch(`/admin/destinations/specialists-by-country?country_id=${countryId || ''}`);
            const data = await response.json();
            setFilteredSpecialists(data.specialists);
        } catch (error) {
            console.error('Error fetching specialists:', error);
        }
    };

    // Dialog states
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [seasonDialogOpen, setSeasonDialogOpen] = useState(false);
    const [activityDialogOpen, setActivityDialogOpen] = useState(false);
    const [activityBulkDialogOpen, setActivityBulkDialogOpen] = useState(false);
    const [itineraryDialogOpen, setItineraryDialogOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [seasonDeleteConfirmOpen, setSeasonDeleteConfirmOpen] = useState(false);
    const [activityDeleteConfirmOpen, setActivityDeleteConfirmOpen] = useState(false);
    const [itineraryDeleteConfirmOpen, setItineraryDeleteConfirmOpen] = useState(false);
    const [toggleStatusConfirmOpen, setToggleStatusConfirmOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [seasonToDelete, setSeasonToDelete] = useState(null);
    const [activityToDelete, setActivityToDelete] = useState(null);
    const [itineraryToDelete, setItineraryToDelete] = useState(null);

    const handleBasicInfoChange = (field) => (value) => {
        // If country changes, clear selected specialists first, then update country
        if (field === 'country_id') {
            setBasicInfo(prev => ({
                ...prev,
                [field]: value,
                specialist_ids: [] // Clear specialists when country changes
            }));
            // Fetch specialists for the new country
            fetchSpecialistsByCountry(value);
        } else {
            setBasicInfo(prev => ({
                ...prev,
                [field]: value
            }));
        }

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

        const formData = new FormData();
        formData.append('name', basicInfo.name);
        formData.append('description', basicInfo.description);
        formData.append('overview_title', basicInfo.overview_title);
        formData.append('overview', basicInfo.overview);
        if (basicInfo.country_id) {
            formData.append('country_id', basicInfo.country_id);
        }
        formData.append('state_province', basicInfo.state_province || '');
        formData.append('specialist_ids', JSON.stringify(basicInfo.specialist_ids || []));

        // Handle file uploads - only append if it's a File object (new upload)
        if (basicInfo.home_image instanceof File) {
            formData.append('home_image', basicInfo.home_image);
        }
        if (basicInfo.grid_image instanceof File) {
            formData.append('grid_image', basicInfo.grid_image);
        }
        if (basicInfo.banner_image instanceof File) {
            formData.append('banner_image', basicInfo.banner_image);
        }

        router.post(`/admin/destinations/${destination.id}`, formData, {
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
        setEditing(null);
        setImageDialogOpen(true);
    };

    const handleEditImage = (image) => {
        setEditing(image);
        setImageDialogOpen(true);
    };

    const handleCloseImageDialog = () => {
        setImageDialogOpen(false);
        setEditing(null);
    };

    const handleDeleteImage = (imageId) => {
        setImageToDelete(imageId);
        setDeleteConfirmOpen(true);
    };

    const confirmDeleteImage = () => {
        if (imageToDelete) {
            router.delete(`/admin/destinations/${destination.id}/images/${imageToDelete}`);
            setDeleteConfirmOpen(false);
            setImageToDelete(null);
        }
    };

    const cancelDeleteImage = () => {
        setDeleteConfirmOpen(false);
        setImageToDelete(null);
    };

    const handleAddSeason = () => {
        setEditing(null);
        setSeasonDialogOpen(true);
    };

    const handleEditSeason = (season) => {
        setEditing(season);
        setSeasonDialogOpen(true);
    };

    const handleDeleteSeason = (seasonId) => {
        setSeasonToDelete(seasonId);
        setSeasonDeleteConfirmOpen(true);
    };

    const confirmDeleteSeason = () => {
        if (seasonToDelete) {
            router.delete(`/admin/destinations/${destination.id}/seasons/${seasonToDelete}`);
            setSeasonDeleteConfirmOpen(false);
            setSeasonToDelete(null);
        }
    };

    const cancelDeleteSeason = () => {
        setSeasonDeleteConfirmOpen(false);
        setSeasonToDelete(null);
    };

    const handleAddActivity = () => {
        setEditing(null);
        setActivityDialogOpen(true);
    };

    const handleBulkUploadActivities = () => {
        setActivityBulkDialogOpen(true);
    };

    const handleEditActivity = (activity) => {
        setEditing(activity);
        setActivityDialogOpen(true);
    };

    const handleDeleteActivity = (activityId) => {
        setActivityToDelete(activityId);
        setActivityDeleteConfirmOpen(true);
    };

    const confirmDeleteActivity = () => {
        if (activityToDelete) {
            router.delete(`/admin/destinations/${destination.id}/activities/${activityToDelete}`);
            setActivityDeleteConfirmOpen(false);
            setActivityToDelete(null);
        }
    };

    const cancelDeleteActivity = () => {
        setActivityDeleteConfirmOpen(false);
        setActivityToDelete(null);
    };

    const handleAddItinerary = () => {
        setEditing(null);
        setItineraryDialogOpen(true);
    };

    const handleEditItinerary = (itinerary) => {
        setEditing(itinerary);
        setItineraryDialogOpen(true);
    };

    const handleDeleteItinerary = (itineraryId) => {
        setItineraryToDelete(itineraryId);
        setItineraryDeleteConfirmOpen(true);
    };

    const confirmDeleteItinerary = () => {
        if (itineraryToDelete) {
            router.delete(`/admin/destinations/${destination.id}/itineraries/${itineraryToDelete}`);
            setItineraryDeleteConfirmOpen(false);
            setItineraryToDelete(null);
        }
    };

    const cancelDeleteItinerary = () => {
        setItineraryDeleteConfirmOpen(false);
        setItineraryToDelete(null);
    };

    const handleToggleStatus = () => {
        setToggleStatusConfirmOpen(true);
    };

    const confirmToggleStatus = () => {
        router.post(`/admin/destinations/${destination.id}/toggle-status`);
        setToggleStatusConfirmOpen(false);
    };

    const cancelToggleStatus = () => {
        setToggleStatusConfirmOpen(false);
    };

    return (
        <AdminLayout>
            <Box sx={{p: 3}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                    <Typography variant="h4" component="h1">
                        Manage Destination: {destination.name}
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        <Chip
                            label={destination.status === 'active' ? 'Active' : 'Inactive'}
                            color={destination.status === 'active' ? 'success' : 'error'}
                            variant="outlined"
                        />
                        <Button
                            variant={destination.status === 'active' ? 'outlined' : 'contained'}
                            color={destination.status === 'active' ? 'error' : 'success'}
                            startIcon={destination.status === 'active' ? <ToggleOffIcon /> : <ToggleOnIcon />}
                            onClick={handleToggleStatus}
                            sx={{minWidth: 140}}
                        >
                            {destination.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                    </Box>
                </Box>
                {/* Section 1: Home Page Information */}
                <Card sx={{mb: 2}}>
                    <CardContent>
                        <Typography variant="h6" sx={{mb: 2}}>
                           Basic Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{xs: 6}}>
                                <Grid container spacing={2}>
                                    <Grid size={{xs: 6}}>
                                        <TextField
                                            label="Name"
                                            value={basicInfo.name}
                                            onChange={(e) => handleBasicInfoChange('name')(e.target.value)}
                                            error={!!basicInfoErrors.name}
                                            helperText={basicInfoErrors.name}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid size={{xs: 6}}>
                                        <TextField
                                            label="Overview Title"
                                            value={basicInfo.overview_title}
                                            onChange={(e) => handleBasicInfoChange('overview_title')(e.target.value)}
                                            error={!!basicInfoErrors.overview_title}
                                            helperText={basicInfoErrors.overview_title}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid size={{xs: 12}}>
                                        <TextField
                                            label="Description"
                                            value={basicInfo.description}
                                            onChange={(e) => handleBasicInfoChange('description')(e.target.value)}
                                            error={!!basicInfoErrors.description}
                                            helperText={basicInfoErrors.description}
                                            fullWidth
                                            multiline
                                            rows={3}
                                        />
                                    </Grid>
                                    <Grid size={{xs: 12}}>
                                        <TextField
                                            label="Overview"
                                            value={basicInfo.overview}
                                            onChange={(e) => handleBasicInfoChange('overview')(e.target.value)}
                                            error={!!basicInfoErrors.overview}
                                            helperText={basicInfoErrors.overview}
                                            fullWidth
                                            multiline
                                            rows={3}
                                        />
                                    </Grid>
                                    <Grid size={{xs: 6}}>
                                        <FormControl fullWidth error={!!basicInfoErrors.country_id}>
                                            <InputLabel>Country</InputLabel>
                                            <Select
                                                value={basicInfo.country_id || ''}
                                                onChange={(e) => handleBasicInfoChange('country_id')(e.target.value)}
                                                label="Country"
                                                variant="outlined">
                                                <MenuItem value="">
                                                    <em>Select a country</em>
                                                </MenuItem>
                                                {countries.map((country) => (
                                                    <MenuItem key={country.id} value={country.id}>
                                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                            <Avatar
                                                                src={country.flag_url}
                                                                sx={{width: 20, height: 12}}
                                                                variant="rounded"
                                                            />
                                                            {country.name}
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {basicInfoErrors.country_id && (
                                                <Typography variant="caption" color="error" sx={{mt: 0.5, ml: 1.5}}>
                                                    {basicInfoErrors.country_id}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{xs: 6}}>
                                        <TextField
                                            label="State / Province"
                                            value={basicInfo.state_province}
                                            onChange={(e) => handleBasicInfoChange('state_province')(e.target.value)}
                                            error={!!basicInfoErrors.state_province}
                                            helperText={basicInfoErrors.state_province}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid size={{xs: 6}}>
                                        <MultiSelect
                                            label="Specialists"
                                            value={basicInfo.specialist_ids}
                                            onChange={handleBasicInfoChange('specialist_ids')}
                                            options={filteredSpecialists.map(specialist => ({
                                                id: specialist.id,
                                                name: specialist.full_name || `${specialist.first_name} ${specialist.last_name}`
                                            }))}
                                            error={!!basicInfoErrors.specialist_ids}
                                            helperText={basicInfoErrors.specialist_ids}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={{xs: 2}}>
                                <Card sx={{height: 418}} variant="outlined">
                                    <CardContent>
                                        <Typography variant="p" sx={{mb: 2, fontSize: '0.8rem'}}>
                                            Home Page Image
                                        </Typography>
                                        <ImageUploader
                                            value={basicInfo.home_image}
                                            onChange={handleBasicInfoChange('home_image')}
                                            error={!!basicInfoErrors.home_image}
                                            helperText={basicInfoErrors.home_image}
                                            label={""}
                                            previewHeight={300}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{xs: 4}}>
                                <Grid container spacing={2}>
                                    <Grid size={{xs: 6}}>
                                        <Card sx={{height: 200}} variant="outlined">
                                            <CardContent>
                                                <Typography variant="p" sx={{mb: 2, fontSize: '0.8rem'}}>
                                                    Grid Image
                                                </Typography>
                                                <ImageUploader
                                                    value={basicInfo.grid_image}
                                                    onChange={handleBasicInfoChange('grid_image')}
                                                    error={!!basicInfoErrors.grid_image}
                                                    helperText={basicInfoErrors.grid_image}
                                                    label={""}
                                                    previewHeight={100}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid size={{xs: 12}}>
                                        <Card sx={{mb: 2, height: 200}} variant="outlined">
                                            <CardContent>
                                                <Typography variant="p" sx={{mb: 2, fontSize: '0.8rem'}}>
                                                    Banner Image
                                                </Typography>
                                                <ImageUploader
                                                    value={basicInfo.banner_image}
                                                    onChange={handleBasicInfoChange('banner_image')}
                                                    error={!!basicInfoErrors.banner_image}
                                                    helperText={basicInfoErrors.banner_image}
                                                    label={""}
                                                    previewHeight={100}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={{xs: 12}} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon/>}
                                    onClick={handleSaveBasicInfo}
                                    disabled={savingBasicInfo}
                                >
                                    {savingBasicInfo ? 'Saving...' : 'Save'}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>


                {/* Section 2: Destination Images */}
                <Card sx={{mb: 3}}>
                    <CardContent>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', aligns: 'center', mb: 2}}>
                            <Typography variant="h6">
                                Destination Images
                            </Typography>
                            <Fab size="small" color="primary" onClick={handleAddImage}>
                                <AddIcon/>
                            </Fab>
                        </Box>
                        <Grid container spacing={2}>
                            {(destination.images || []).filter(Boolean).map((image, idx) => (
                                <Grid size={{xs: 2}} key={image.id || idx}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 3,
                                            }
                                        }}
                                    >
                                        <Box sx={{position: 'relative', flex: 1}}>
                                            <Box
                                                component="img"
                                                src={image?.url || ''}
                                                alt={image?.name || 'Image'}
                                                sx={{
                                                    width: '100%',
                                                    height: 120,
                                                    objectFit: 'cover',
                                                    borderRadius: '4px 4px 0 0',
                                                }}
                                            />
                                            <Box sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                display: 'flex',
                                                gap: 0.5
                                            }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditImage(image)}
                                                    sx={{
                                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                        backdropFilter: 'blur(4px)',
                                                        width: 24,
                                                        height: 24,
                                                        '&:hover': {
                                                            bgcolor: 'rgba(255, 255, 255, 1)',
                                                        }
                                                    }}
                                                >
                                                    <EditIcon sx={{fontSize: '0.8rem'}}/>
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteImage(image.id)}
                                                    sx={{
                                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                        backdropFilter: 'blur(4px)',
                                                        width: 24,
                                                        height: 24,
                                                        '&:hover': {
                                                            bgcolor: 'rgba(255, 255, 255, 1)',
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon sx={{fontSize: '0.8rem'}}/>
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        <CardContent sx={{p: 1, flex: 0}}>
                                            <Typography variant="caption" noWrap sx={{mb: 0.5, display: 'block'}}>
                                                {image?.name || 'Untitled'}
                                            </Typography>
                                            <Chip
                                                label={image?.image_type || 'Image'}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{fontSize: '0.7rem'}}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {(!destination.images || destination.images.length === 0) && (
                                <Grid size={{xs: 12}}>
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            py: 4,
                                            border: '2px dashed #e0e0e0',
                                            borderRadius: 2,
                                            bgcolor: '#fafafa'
                                        }}
                                    >
                                        <Typography color="text.secondary" variant="h6" sx={{mb: 1}}>
                                            No images added yet
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            Click the + button above to add destination images
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Section 3: Destination Seasons */}
                <Card sx={{mb: 3}}>
                    <CardContent>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', aligns: 'center', mb: 2}}>
                            <Typography variant="h6">
                                Destination Seasons
                            </Typography>
                            <Fab size="small" color="primary" onClick={handleAddSeason}>
                                <AddIcon/>
                            </Fab>
                        </Box>
                        <Grid container spacing={2}>
                            {destination.seasons?.map((season) => (
                                <Grid size={{xs: 4}} key={season.id}>
                                    <Card  variant="outlined">
                                        <CardContent sx={{p: 1, flex: 1}}>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                aligns: 'flex-start',
                                                mb: 1
                                            }}>
                                                <Typography variant="h6">{season.name}</Typography>
                                                <Box>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditSeason(season)}
                                                    >
                                                        <EditIcon fontSize="small"/>
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteSeason(season.id)}
                                                    >
                                                        <DeleteIcon fontSize="small"/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                                Duration: {season.duration}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    height: 60,
                                                    overflow: 'auto',
                                                    mb: 1,
                                                    pr: 0.5,
                                                    '&::-webkit-scrollbar': {
                                                        width: '4px',
                                                    },
                                                    '&::-webkit-scrollbar-track': {
                                                        background: '#f1f1f1',
                                                        borderRadius: '2px',
                                                    },
                                                    '&::-webkit-scrollbar-thumb': {
                                                        background: '#c1c1c1',
                                                        borderRadius: '2px',
                                                    },
                                                    '&::-webkit-scrollbar-thumb:hover': {
                                                        background: '#a8a8a8',
                                                    },
                                                }}
                                            >
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
                                <Grid size={{xs: 12}}>
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
                                Destination Activities
                            </Typography>
                            <Box sx={{display: 'flex', gap: 1}}>
                                <Fab size="small" color="secondary" onClick={handleBulkUploadActivities}>
                                    <UploadIcon/>
                                </Fab>
                                <Fab size="small" color="primary" onClick={handleAddActivity}>
                                    <AddIcon/>
                                </Fab>
                            </Box>
                        </Box>
                        <Grid container spacing={2}>
                            {destination.activities?.map((activity) => (
                                <Grid size={{xs: 3}} key={activity.id}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                aligns: 'flex-start',
                                                mb: 1
                                            }}>
                                                <Typography variant="h6">{activity.name}</Typography>
                                                <Box>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditActivity(activity)}
                                                    >
                                                        <EditIcon fontSize="small"/>
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteActivity(activity.id)}
                                                    >
                                                        <DeleteIcon fontSize="small"/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            {activity.description && (
                                                <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
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
                                                        height: 100,
                                                        objectFit: 'cover',
                                                        borderRadius: 1,
                                                        mb: 1,
                                                    }}
                                                />
                                            )}
                                            <Chip
                                                label={activity.status ? 'Active' : 'Inactive'}
                                                size="small"
                                                color={activity.status ? 'success' : 'default'}
                                                sx={{mt: 1}}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {(!destination.activities || destination.activities.length === 0) && (
                                <Grid size={{xs: 12}}>
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
                                Destination Itinerary Manage
                            </Typography>
                            <Fab size="small" color="primary" onClick={handleAddItinerary}>
                                <AddIcon/>
                            </Fab>
                        </Box>
                        <Grid container spacing={2}>
                            {destination.itineraries?.map((itinerary) => (
                                <Grid size={{xs: 3}} sm={6} md={4} key={itinerary.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 3,
                                            }
                                        }}
                                    >
                                        <Box sx={{position: 'relative', flex: 1}}>
                                            {itinerary.image_url && (
                                                <Box
                                                    component="img"
                                                    src={itinerary.image_url}
                                                    alt={itinerary.title}
                                                    sx={{
                                                        width: '100%',
                                                        height: 200,
                                                        objectFit: 'cover',
                                                        borderRadius: '4px 4px 0 0',
                                                    }}
                                                />
                                            )}
                                            <Box sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                display: 'flex',
                                                gap: 0.5
                                            }}>
                                                <IconButton
                                                    onClick={() => handleEditItinerary(itinerary)}
                                                    sx={{
                                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                        backdropFilter: 'blur(4px)',
                                                        width: 24,
                                                        height: 24,
                                                        '&:hover': {
                                                            bgcolor: 'rgba(255, 255, 255, 1)',
                                                        }
                                                    }}
                                                >
                                                    <EditIcon sx={{fontSize: '0.8rem'}}/>
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDeleteItinerary(itinerary.id)}
                                                    sx={{
                                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                        backdropFilter: 'blur(4px)',
                                                        width: 24,
                                                        height: 24,
                                                        '&:hover': {
                                                            bgcolor: 'rgba(255, 255, 255, 1)',
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon sx={{fontSize: '0.8rem'}}/>
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        <CardContent sx={{p: 2, flex: 0}}>
                                            <Typography variant="h6" sx={{mb: 1, fontSize: '1rem'}}>
                                                {itinerary.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    height: 60,
                                                    overflow: 'auto',
                                                    mb: 1,
                                                    pr: 0.5,
                                                    '&::-webkit-scrollbar': {
                                                        width: '4px',
                                                    },
                                                    '&::-webkit-scrollbar-track': {
                                                        background: '#f1f1f1',
                                                        borderRadius: '2px',
                                                    },
                                                    '&::-webkit-scrollbar-thumb': {
                                                        background: '#c1c1c1',
                                                        borderRadius: '2px',
                                                    },
                                                    '&::-webkit-scrollbar-thumb:hover': {
                                                        background: '#a8a8a8',
                                                    },
                                                }}
                                            >
                                                {itinerary.description}
                                            </Typography>
                                            <Chip
                                                label={itinerary.status}
                                                size="small"
                                                color={itinerary.status === 'active' ? 'success' : itinerary.status === 'draft' ? 'warning' : 'default'}
                                                sx={{mt: 1}}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {(!destination.itineraries || destination.itineraries.length === 0) && (
                                <Grid size={{xs: 12}}>
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            py: 4,
                                            border: '2px dashed #e0e0e0',
                                            borderRadius: 2,
                                            bgcolor: '#fafafa'
                                        }}
                                    >
                                        <Typography color="text.secondary" variant="h6" sx={{mb: 1}}>
                                            No itinerary item added yet
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            Click the + button above to add destination itineraries
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Image Upload Dialog */}
                <Dialog
                    open={imageDialogOpen}
                    onClose={handleCloseImageDialog}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        {editing ? 'Edit Image' : 'Add New Image'}
                    </DialogTitle>
                    <DialogContent>
                        <ImageUploadDialog
                            destination={destination}
                            editing={editing}
                            onClose={handleCloseImageDialog}
                        />
                    </DialogContent>
                </Dialog>

                {/* Season Dialog */}
                <SeasonDialog
                    open={seasonDialogOpen}
                    onClose={() => {
                        setSeasonDialogOpen(false);
                        setEditing(null);
                    }}
                    destination={destination}
                    editing={editing}
                />

                {/* Activity Dialog */}
                <ActivityDialog
                    open={activityDialogOpen}
                    onClose={() => {
                        setActivityDialogOpen(false);
                        setEditing(null);
                    }}
                    destination={destination}
                    editing={editing}
                />

                {/* Activity Bulk Upload Dialog */}
                <ActivityBulkUploadDialog
                    open={activityBulkDialogOpen}
                    onClose={() => {
                        setActivityBulkDialogOpen(false);
                    }}
                    destination={destination}
                />

                {/* Itinerary Dialog */}
                <Dialog
                    open={itineraryDialogOpen}
                    onClose={() => {
                        setItineraryDialogOpen(false);
                        setEditing(null);
                    }}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        {editing ? 'Edit Itinerary' : 'Add New Itinerary'}
                    </DialogTitle>
                    <DialogContent>
                        <ItineraryDialog
                            destination={destination}
                            editing={editing}
                            onClose={() => {
                                setItineraryDialogOpen(false);
                                setEditing(null);
                            }}
                        />
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteConfirmOpen}
                    onClose={cancelDeleteImage}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        Confirm Delete
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this image? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={cancelDeleteImage}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDeleteImage}
                            color="error"
                            variant="contained"
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Season Delete Confirmation Dialog */}
                <Dialog
                    open={seasonDeleteConfirmOpen}
                    onClose={cancelDeleteSeason}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        Confirm Delete Season
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this season? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={cancelDeleteSeason}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDeleteSeason}
                            color="error"
                            variant="contained"
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Activity Delete Confirmation Dialog */}
                <Dialog
                    open={activityDeleteConfirmOpen}
                    onClose={cancelDeleteActivity}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        Confirm Delete Activity
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this activity? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={cancelDeleteActivity}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDeleteActivity}
                            color="error"
                            variant="contained"
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Itinerary Delete Confirmation Dialog */}
                <Dialog
                    open={itineraryDeleteConfirmOpen}
                    onClose={cancelDeleteItinerary}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        Confirm Delete Itinerary
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this itinerary? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={cancelDeleteItinerary}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDeleteItinerary}
                            color="error"
                            variant="contained"
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Toggle Status Confirmation Dialog */}
                <Dialog
                    open={toggleStatusConfirmOpen}
                    onClose={cancelToggleStatus}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        {destination.status === 'active' ? 'Deactivate Destination' : 'Activate Destination'}
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to {destination.status === 'active' ? 'deactivate' : 'activate'} the destination "{destination.name}"?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                            {destination.status === 'active' 
                                ? 'Deactivating will make this destination unavailable to users.' 
                                : 'Activating will make this destination available to users.'
                            }
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={cancelToggleStatus}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmToggleStatus}
                            color={destination.status === 'active' ? 'error' : 'success'}
                            variant="contained"
                        >
                            {destination.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AdminLayout>
    );
};

export default Manage;
