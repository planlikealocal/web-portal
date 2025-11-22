import React from 'react';
import { Typography, Box, Container, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from '@inertiajs/react';
import { LocationOn, Landscape } from '@mui/icons-material';

const DestinationsSection = ({
    title = 'Destinations',
    subtitle = 'See Our Created Travels',
    discoverMoreLink = '/destinations'
}) => {
    // Create 4 identical placeholder cards
    const cards = Array(4).fill({
        location: 'Location',
        title: 'Title',
        description: 'Tanta petere igitur, ne sineres memini fieri etiam aliquam.'
    });

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

                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {cards.map((card, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: '#F5F5F5',
                                    border: '1px solid #E0E0E0',
                                    boxShadow: 'none',
                                    borderRadius: 1
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
                                        {card.location}
                                    </Typography>
                                </Box>

                                <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {/* Image placeholder */}
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
                                            '& svg': {
                                                fontSize: '4rem',
                                                color: '#9CA3AF'
                                            }
                                        }}
                                    >
                                        <Landscape />
                                    </Box>

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
                                        {card.title}
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
                                            flexGrow: 1
                                        }}
                                    >
                                        {card.description}
                                    </Typography>

                                    {/* Button text (not clickable) */}
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: '#9CA3AF',
                                            fontSize: '0.875rem',
                                            textAlign: 'center',
                                            mt: 'auto'
                                        }}
                                    >
                                        Button
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

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

export default DestinationsSection;

