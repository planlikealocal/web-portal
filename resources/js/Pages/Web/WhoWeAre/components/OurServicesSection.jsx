import React from 'react';
import { Typography, Box, Container, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';

const OurServicesSection = ({
    title = 'Our Services',
    description = 'From plan to discovery, we\'ve got you covered.',
    services = []
}) => {
    const defaultServices = [
        {
            videoUrl: '',
            description: 'Si osculantur puer tuus aut uxorem tuam, osculum, non dico quod omnia quae sunt'
        },
        {
            videoUrl: '',
            description: 'Si osculantur puer tuus aut uxorem tuam, osculum, non dico quod omnia quae sunt'
        },
        {
            videoUrl: '',
            description: 'Si osculantur puer tuus aut uxorem tuam, osculum, non dico quod omnia quae sunt'
        },
        {
            videoUrl: '',
            description: 'Si osculantur puer tuus aut uxorem tuam, osculum, non dico quod omnia quae sunt'
        }
    ];

    const displayServices = services.length > 0 ? services : defaultServices;

    return (
        <Box sx={{ py: 8, px: 4, backgroundColor: '#FFFFFF' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" component="h2" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mt: 2 }}>
                        {description}
                    </Typography>
                </Box>
                <Grid container spacing={4}>
                    {displayServices.map((service, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: 2,
                                    '&:hover': {
                                        boxShadow: 4,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        paddingTop: '56.25%', // 16:9 aspect ratio
                                        backgroundColor: '#E5E7EB',
                                    }}
                                >
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#E5E7EB',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 64,
                                                height: 64,
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                color: 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                    transform: 'scale(1.1)',
                                                },
                                            }}
                                        >
                                            <PlayArrow sx={{ fontSize: 32, ml: 0.5 }} />
                                        </Box>
                                    </CardMedia>
                                </Box>
                                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        {service.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default OurServicesSection;

