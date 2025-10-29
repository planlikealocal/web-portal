import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';

const ItinerariesTab = ({ itineraries }) => {
    return itineraries && itineraries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {itineraries.map((itinerary) => (
                <Card key={itinerary.id}>
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
            ))}
        </div>
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
    );
};

export default ItinerariesTab;


