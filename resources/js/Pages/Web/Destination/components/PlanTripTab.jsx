import React, { useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Box, Card, CardContent, Typography, Button, Avatar } from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';

const PlanTripTab = ({ destination, id }) => {
    const specialists = destination?.specialists || [];
    const primary = useMemo(() => specialists.find((s) => s) || null, [specialists]);

    const handleSchedulePlanning = () => {
        if (!primary?.id) {
            alert('No specialist available');
            return;
        }

        router.post('/plans', {
            specialist_id: primary.id,
            destination_id: destination?.id || null,
        });
    };

    return (
        <Box id={id}>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
            <Typography variant="h3" sx={{ mb: 1 }}>
                Plan your Trip
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start planning with a local specialist. Share your preferences and get a custom itinerary.
            </Typography>
            </Box>
            <Card>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
                    
                    <Avatar
                        src={primary?.avatar_url || ''}
                        alt={primary?.full_name || 'Specialist'}
                        sx={{ width: 112, height: 112 }}
                    />
                    <Box>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                            {primary?.full_name || 'A Local Specialist'}
                        </Typography>
                        {(() => {
                            // Format location as "Region, Country"
                            let locationText = '';
                            
                            if (destination?.state_province || destination?.country) {
                                const parts = [];
                                if (destination.state_province) {
                                    parts.push(destination.state_province);
                                }
                                if (destination.country?.name || destination.country) {
                                    parts.push(destination.country?.name || destination.country);
                                }
                                locationText = parts.join(', ');
                            } else if (primary?.location) {
                                // For specialist, try to extract region and country from location
                                // Location format is typically "City, Region, Country"
                                const locationParts = primary.location.split(',').map(s => s.trim());
                                // Get last two parts (region and country) if available
                                if (locationParts.length >= 2) {
                                    locationText = locationParts.slice(-2).join(', ');
                                } else {
                                    locationText = primary.location;
                                }
                            }
                            
                            return locationText && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                    <LocationIcon fontSize="small" />
                                    <Typography variant="body2">
                                        {locationText}
                                    </Typography>
                                </Box>
                            );
                        })()}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 560 }}>
                        {primary?.bio || 'Tell us what you want to experience and we will craft a tailored trip with the best timings, activities and stays.'}
                    </Typography>
                    {primary?.id && (
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1 }}
                            onClick={handleSchedulePlanning}
                        >
                            {`Schedule planning with ${primary?.full_name || 'a specialist'}`}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default PlanTripTab;


