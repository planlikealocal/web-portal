import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import LandscapeIcon from '@mui/icons-material/Landscape';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VideoChatIcon from '@mui/icons-material/VideoChat';
import DescriptionIcon from '@mui/icons-material/Description';

const PlanATripGuide = () => {
    const steps = [
        {
            title: 'Choose a destination',
            description: 'Praeterea, ex culpa non invenies unum aut non',
            icon: <LandscapeIcon sx={{ fontSize: 48, color: '#1F2937' }} />,
        },
        {
            title: 'Schedule a meeting with Specialist',
            description: 'Praeterea, ex culpa non invenies unum aut non',
            icon: <CalendarMonthIcon sx={{ fontSize: 48, color: '#1F2937' }} />,
        },
        {
            title: 'Video Chat',
            description: 'Praeterea, ex culpa non invenies unum aut non',
            icon: <VideoChatIcon sx={{ fontSize: 48, color: '#1F2937' }} />,
        },
        {
            title: 'Final Itinerary',
            description: 'Praeterea, ex culpa non invenies unum aut non',
            icon: <DescriptionIcon sx={{ fontSize: 48, color: '#1F2937' }} />,
        },
    ];

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
            }}
        >
            {/* Top Section: Plan a Trip */}
            <Box
                sx={{
                    bgcolor: '#FFFFFF',
                    pt: 8,
                    pb: 6,
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 700,
                            color: '#1F2937',
                            mb: 2,
                            fontSize: { xs: '2rem', md: '3rem' },
                        }}
                    >
                        Plan a Trip
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#1F2937',
                            fontSize: { xs: '0.875rem', md: '1rem' },
                        }}
                    >
                        Quidam alii sunt, et non est in nostra
                    </Typography>
                </Container>
            </Box>

            {/* SVG Wave Divider */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '80px',
                    overflow: 'hidden',
                    mt: '-1px',
                }}
            >
                <svg
                    viewBox="0 0 1200 80"
                    preserveAspectRatio="none"
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'block',
                    }}
                >
                    <path
                        d="M0,40 Q300,0 600,40 T1200,40 L1200,80 L0,80 Z"
                        fill="#DDE6ED"
                    />
                </svg>
            </Box>

            {/* Curved Background with Wave Effect */}
            <Box
                sx={{
                    position: 'relative',
                    bgcolor: '#DDE6ED',
                    pt: 8,
                    pb: 10,
                    mt: '-1px',
                    // Dotted pattern overlay
                    backgroundImage: `radial-gradient(circle, rgba(31, 41, 55, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    {/* How it Works Section */}
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 700,
                                color: '#1F2937',
                                mb: 2,
                                fontSize: { xs: '2rem', md: '3rem' },
                            }}
                        >
                            How it Works
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#1F2937',
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                maxWidth: '800px',
                                mx: 'auto',
                            }}
                        >
                            Tollere odium autem in nostra potestate sint, ab omnibus et contra
                            naturam transferre in nobis.
                        </Typography>
                    </Box>

                    {/* Process Steps Grid */}
                    <Grid container spacing={4}>
                        {steps.map((step, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* Image Placeholder */}
                                    <Box
                                        sx={{
                                            width: { xs: 120, md: 150 },
                                            height: { xs: 120, md: 150 },
                                            bgcolor: '#F3F4F6',
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2,
                                            border: '1px solid #E5E7EB',
                                        }}
                                    >
                                        {step.icon}
                                    </Box>

                                    {/* Title */}
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            color: '#1F2937',
                                            mb: 1,
                                            fontSize: { xs: '1rem', md: '1.125rem' },
                                        }}
                                    >
                                        {step.title}
                                    </Typography>

                                    {/* Description */}
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#1F2937',
                                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                                        }}
                                    >
                                        {step.description}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default PlanATripGuide;

