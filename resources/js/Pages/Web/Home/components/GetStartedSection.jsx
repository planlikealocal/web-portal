import React from 'react';
import { Typography, Box, Container, Button, Paper } from '@mui/material';
import { Link } from '@inertiajs/react';
import CurvedSection from '../../../../Components/CurvedSection.jsx';

const GetStartedSection = ({
    title = 'Ready to Plan Your Next Adventure?',
    description = 'Connect with local specialists and create unforgettable travel experiences tailored just for you.',
    primaryCtaText = 'Browse Destinations',
    primaryCtaLink = '/destinations',
    secondaryCtaText = 'Learn More',
    secondaryCtaLink = '/what-we-do'
}) => {
    return (
        <CurvedSection
            showBottomSection={false}
            topBgColor="#F8F9FA"
            bottomBgColor="#FFFFFF"
            curveType="smile"
            curveHeight={150}
        >
            <Container maxWidth="md">
                <Box 
                    sx={{ 
                        textAlign: 'center', 
                        py: { xs: 8, md: 12 },
                        px: 4
                    }}
                >
                    <Paper 
                        elevation={3}
                        sx={{ 
                            p: { xs: 4, md: 6 },
                            backgroundColor: 'white',
                            borderRadius: 2
                        }}
                    >
                        <Typography 
                            variant="h3" 
                            component="h2" 
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                fontSize: { xs: '2rem', md: '2.5rem' }
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography 
                            variant="body1" 
                            color="text.secondary"
                            sx={{ 
                                mb: 4,
                                fontSize: { xs: '1rem', md: '1.125rem' },
                                maxWidth: '600px',
                                mx: 'auto'
                            }}
                        >
                            {description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                size="large"
                                component={Link}
                                href={primaryCtaLink}
                                sx={{
                                    minWidth: 200,
                                    py: 1.5,
                                    px: 4,
                                    fontSize: '1.1rem',
                                    textTransform: 'none'
                                }}
                            >
                                {primaryCtaText}
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                component={Link}
                                href={secondaryCtaLink}
                                sx={{
                                    minWidth: 200,
                                    py: 1.5,
                                    px: 4,
                                    fontSize: '1.1rem',
                                    textTransform: 'none'
                                }}
                            >
                                {secondaryCtaText}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </CurvedSection>
    );
};

export default GetStartedSection;

