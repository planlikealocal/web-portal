import React, { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Grid, TextField, Typography, Checkbox, FormControlLabel, Autocomplete, Box, Avatar, Card, CardContent } from '@mui/material';

const Step2TripDetails = ({ data, setData, errors, onInterestChange, activities = [], destinations = [], destinationData = null, planId }) => {
    const hasActivities = Array.isArray(activities) && activities.length > 0;
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [specialists, setSpecialists] = useState([]);
    const [destinationActivities, setDestinationActivities] = useState(activities);
    const isInitialized = useRef(false);
    const isUserChange = useRef(false);

    // Initialize selected destination from destination_id or destination_data (only once on mount)
    useEffect(() => {
        // Only initialize if not already initialized and not from user change
        if (isInitialized.current || isUserChange.current) {
            return;
        }

        if (destinations.length === 0) {
            return; // Wait for destinations to load
        }

        // If we already have a selected destination that matches the data, don't reset
        if (selectedDestination) {
            const currentId = selectedDestination.id;
            const matchesData = 
                (destinationData && currentId === destinationData.id) ||
                (data.destination_id && currentId === data.destination_id) ||
                (data.destination && selectedDestination.name === data.destination);
            
            if (matchesData) {
                isInitialized.current = true;
                return;
            }
        }

        let destination = null;
        
        if (destinationData && destinationData.id) {
            destination = destinations.find(d => d.id === destinationData.id);
            if (destination && (!selectedDestination || selectedDestination.id !== destination.id)) {
                setSelectedDestination(destination);
                setSpecialists(destinationData.specialists || []);
                isInitialized.current = true;
            }
        } else if (data.destination_id) {
            destination = destinations.find(d => d.id === data.destination_id);
            if (destination && (!selectedDestination || selectedDestination.id !== destination.id)) {
                setSelectedDestination(destination);
                isInitialized.current = true;
            }
        } else if (data.destination) {
            // Try to find by name
            destination = destinations.find(d => d.name === data.destination);
            if (destination && (!selectedDestination || selectedDestination.id !== destination.id)) {
                setSelectedDestination(destination);
                isInitialized.current = true;
            }
        }
    }, [destinations, destinationData, data.destination_id, data.destination]);

    // Update activities when destination changes
    useEffect(() => {
        if (destinationData && destinationData.activities) {
            setDestinationActivities(destinationData.activities);
        }
    }, [destinationData]);

    const handleDestinationChange = (event, newValue) => {
        isUserChange.current = true;
        setSelectedDestination(newValue);
        
        if (newValue) {
            // Update destination name and ID
            setData('destination', newValue.name);
            setData('destination_id', newValue.id);
            
            // Fetch destination details with specialists using fetch API
            // Don't include X-Inertia header to get JSON response instead of Inertia response
            fetch(`/destinations/${newValue.id}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    // Explicitly exclude X-Inertia header to get JSON response
                },
                credentials: 'same-origin',
            })
                .then(response => {
                    // Check if this is an Inertia response (has X-Inertia header in response)
                    const isInertiaResponse = response.headers.get('X-Inertia');
                    
                    return response.json().then(result => {
                        // If it's an Inertia response, extract the props.destination
                        if (isInertiaResponse || result.component || result.props) {
                            // Inertia response format: { component: '...', props: { destination: {...} } }
                            return result.props?.destination || result;
                        }
                        // Regular JSON response format: { data: {...} }
                        return result.data || result;
                    });
                })
                .then(dest => {
                    if (dest) {
                        setSpecialists(dest.specialists || []);
                        if (dest.activities) {
                            setDestinationActivities(dest.activities.filter(a => a.status === true || a.status === 1));
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching destination:', error);
                });
        } else {
            setData('destination', '');
            setData('destination_id', '');
            setSpecialists([]);
            setDestinationActivities([]);
        }
    };

    const displayActivities = destinationActivities.length > 0 ? destinationActivities : activities;
    const hasDisplayActivities = Array.isArray(displayActivities) && displayActivities.length > 0;

    return (
        <Grid container spacing={3}>
            {/* Destination Section */}
            <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                    options={destinations}
                    value={selectedDestination}
                    onChange={handleDestinationChange}
                    getOptionLabel={(option) => option?.name || ''}
                    isOptionEqualToValue={(option, value) => {
                        if (!option || !value) return false;
                        return String(option.id) === String(value.id);
                    }}
                    filterOptions={(options, state) => {
                        return options.filter(option =>
                            option.name.toLowerCase().includes(state.inputValue.toLowerCase())
                        );
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Where do you want to go?"
                            error={!!errors.destination}
                            helperText={errors.destination}
                        />
                    )}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Need help choosing where to go?{' '}
                    <a href="#" style={{ color: '#1976d2' }}>Click here</a> to help figure out what you may be interested in.
                </Typography>
            </Grid>

            {/* Specialists Section */}
            {specialists.length > 0 && (
                <Grid size={{ xs: 12, sm: 6 }}>

                    <Grid container spacing={2}>
                        {specialists.map((specialist) => (
                            <Grid size={{ xs: 12}} key={specialist.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar
                                            src={specialist.avatar_url}
                                            alt={specialist.full_name}
                                            sx={{ width: 60, height: 60 }}
                                        >
                                            {specialist.full_name?.charAt(0) || 'S'}  
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                {specialist.full_name} 
                                            </Typography>
                                            {/* {specialist.bio && (
                                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    {specialist.bio.substring(0, 60) + '...'}
                                                </Typography>
                                            )} */}
                                            {specialist.location && (
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                                    {specialist.location}
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            )}

            {/* Travel Dates Section */}
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    label="What are your dates of travel"
                    value={data.travel_dates}
                    onChange={(e) => setData('travel_dates', e.target.value)}
                    error={!!errors.travel_dates}
                    helperText={errors.travel_dates}
                />
            </Grid>

            {/* Travelers Section */}
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    label="Who will be your traveling?"
                    value={data.travelers}
                    onChange={(e) => setData('travelers', e.target.value)}
                    error={!!errors.travelers}
                    helperText={errors.travelers}
                />
            </Grid>

            {/* Interests Section */}
            <Grid size={{ xs: 12 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    What are your interests?
                </Typography>
                {hasDisplayActivities ? (
                    <Grid container spacing={2}>
                        {displayActivities.map((activity) => {
                            const activityId = activity.id || activity;
                            const activityName = activity.name || activity;
                            
                            return (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={activityId}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={data.interests.includes(activityName)}
                                                onChange={() => onInterestChange(activityName)}
                                            />
                                        }
                                        label={activityName}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        No activities available for this destination. Please add your other interests below.
                    </Typography>
                )}
            </Grid>

            {/* Other Interests Section */}
            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Any Other interests"
                    value={data.other_interests}
                    onChange={(e) => setData('other_interests', e.target.value)}
                    error={!!errors.other_interests}
                    helperText={errors.other_interests}
                />
            </Grid>
        </Grid>
    );
};

export default Step2TripDetails;

