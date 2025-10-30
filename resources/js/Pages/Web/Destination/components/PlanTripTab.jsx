import React, { useMemo } from 'react';
import { Box, Card, CardContent, Typography, Button, Avatar } from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';

const PlanTripTab = ({ destination }) => {
    const specialists = destination?.specialists || [];
    const primary = useMemo(() => specialists.find((s) => s) || null, [specialists]);

    return (
        <Box>
            
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
                        {(primary?.location || destination?.full_location) && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                <LocationIcon fontSize="small" />
                                <Typography variant="body2">
                                    {primary?.location || destination?.full_location}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 560 }}>
                        {primary?.bio || 'Tell us what you want to experience and we will craft a tailored trip with the best timings, activities and stays.'}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 1 }}
                    >
                        {`Schedule planning with ${primary?.full_name || 'a specialist'}`}
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PlanTripTab;


