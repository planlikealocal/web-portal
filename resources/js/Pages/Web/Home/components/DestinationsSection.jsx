import React, { useState } from 'react';
import { Typography, Box, Container, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from '@inertiajs/react';
import { LocationOn, Landscape } from '@mui/icons-material';

// Helper function to get the best available image for a destination
const getDestinationImage = (destination) => {
    return destination.home_image || 
           destination.grid_image || 
           destination.main_image || 
           destination.banner_image || 
           null;
};

const DestinationsSection = ({
    destinations = [],
    title = 'Destinations',
    subtitle = 'See Our Created Travels',
    discoverMoreLink = '/destinations'
}) => {
    // Limit to 4 destinations for homepage
    const displayDestinations = destinations.slice(0, 4);

    return (
        <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#FFFFFF' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography 
                        variant="h3" 
                        component="h2" 
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            fontSize: { xs: '2rem', md: '2.75rem' },
                            color: 'text.primary'
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ 
                            fontSize: { xs: '1rem', md: '1.125rem' }
                        }}
                    >
                        {subtitle}
                    </Typography>
                </Box>

                {displayDestinations.length > 0 ? (
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        {displayDestinations.map((destination) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={destination.id}>
                                <Card 
                                    component={Link}
                                    href={`/destinations/${destination.id}`}
                                    sx={{ 
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        backgroundColor: '#F5F5F5',
                                        border: '1px solid #E0E0E0',
                                        boxShadow: 'none',
                                        borderRadius: 1,
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            boxShadow: 3,
                                            transform: 'translateY(-4px)',
                                            borderColor: '#4B5563'
                                        }
                                    }}
                                >
                                    {/* Location bar at top */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            px: 2,
                                            py: 1,
                                            borderBottom: '1px solid #E0E0E0',
                                            backgroundColor: '#FAFAFA'
                                        }}
                                    >
                                        <LocationOn sx={{ fontSize: '1rem', color: '#4B5563', mr: 0.5 }} />
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                fontSize: '0.875rem',
                                                color: '#4B5563',
                                                fontWeight: 500
                                            }}
                                        >
                                            {destination.country || destination.full_location || 'Location'}
                                        </Typography>
                                    </Box>

                                    <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        {/* Image */}
                                        <DestinationImage destination={destination} />

                                        {/* Title */}
                                        <Typography 
                                            variant="h6" 
                                            component="h3" 
                                            gutterBottom
                                            sx={{ 
                                                fontWeight: 700,
                                                mb: 1.5,
                                                color: 'text.primary',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {destination.name}
                                        </Typography>

                                        {/* Description */}
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: 'text.primary',
                                                fontSize: '0.875rem',
                                                lineHeight: 1.6,
                                                mb: 2,
                                                textAlign: 'center',
                                                flexGrow: 1,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {destination.description || destination.overview || 'No description available.'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 6, mb: 6 }}>
                        <Typography variant="body1" color="text.secondary">
                            No destinations available at the moment.
                        </Typography>
                    </Box>
                )}

                {/* Discover more button */}
                <Box sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        component={Link}
                        href={discoverMoreLink}
                        sx={{
                            backgroundColor: '#4B5563',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            borderRadius: 1,
                            '&:hover': {
                                backgroundColor: '#374151'
                            }
                        }}
                    >
                        Discover more
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

// Separate component for destination image with error handling
const DestinationImage = ({ destination }) => {
    const [imageError, setImageError] = useState(false);
    const imageUrl = getDestinationImage(destination);
    
    return (
        <Box
            sx={{
                width: '100%',
                aspectRatio: '1',
                maxWidth: '200px',
                backgroundColor: '#4B5563',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                mb: 2,
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {imageUrl && !imageError ? (
                <Box
                    component="img"
                    src={imageUrl}
                    alt={destination.name}
                    onError={() => setImageError(true)}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            ) : (
                <Landscape sx={{ fontSize: '4rem', color: '#9CA3AF' }} />
            )}
        </Box>
    );
};

export default DestinationsSection;

