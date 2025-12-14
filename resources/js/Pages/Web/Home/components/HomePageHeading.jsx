import React from 'react';
import { Typography, Box, Button, Container } from '@mui/material';
import { Link } from '@inertiajs/react';
import CurvedSection from '../../../../Components/CurvedSection.jsx';

const HomePageHeading = ({
    title = 'Some header will go here',
    subtitle = 'Subheader',
    viewDestinationsLink = '/destinations',
    planTripLink = '/plan'
}) => {
    return (
        <CurvedSection
            showBottomSection={false}
            topBgColor="#FFFFFF"
            bottomBgColor="#CED4DA"
            curveType="smile"
            curveHeight={400}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        textAlign: 'center',
                        mt: { xs: 8, md: 20 },
                        pb: { xs: 8, md: 12 },
                        px: 4
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            mb: 2,
                            color: 'text.primary'
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="h5"
                        component="h2"
                        color="text.secondary"
                        sx={{
                            mb: 4,
                            fontSize: { xs: '1.25rem', md: '1.5rem' }
                        }}
                    >
                        {subtitle}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}
                    >
                        <Button
                            variant="outlined"
                            size="large"
                            component={Link}
                            href={viewDestinationsLink}
                            sx={{
                                minWidth: 180,
                                py: 1.5,
                                px: 4,
                                fontSize: '1rem',
                                textTransform: 'none',
                                borderColor: 'grey.400',
                                color: 'text.primary',
                                '&:hover': {
                                    borderColor: 'grey.600',
                                    backgroundColor: 'grey.50'
                                }
                            }}
                        >
                            View Destinations
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            component={Link}
                            href={planTripLink}
                            sx={{
                                minWidth: 180,
                                py: 1.5,
                                px: 4,
                                fontSize: '1rem',
                                textTransform: 'none',
                                borderColor: 'grey.400',
                                color: 'text.primary',
                                '&:hover': {
                                    borderColor: 'grey.600',
                                    backgroundColor: 'grey.50'
                                }
                            }}
                        >
                            Plan a trip
                        </Button>
                    </Box>
                </Box>
            </Container>
        </CurvedSection>
    );
};

export default HomePageHeading;

