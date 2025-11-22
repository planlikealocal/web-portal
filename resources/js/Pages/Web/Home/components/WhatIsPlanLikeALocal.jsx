import React from 'react';
import { Typography, Box, Container, Grid, Card, CardContent, Button } from '@mui/material';
import { Landscape } from '@mui/icons-material';
import { Link } from '@inertiajs/react';

const WhatIsPlanLikeALocal = ({
    title = 'What is Plan Like a Local?',
    subtitle = 'Quod Enchiridion Epictetus stoici',
    learnMoreLink = '/what-we-do'
}) => {
    // Create 4 identical cards
    const cards = Array(4).fill({
        icon: <Landscape />,
        text: 'Text'
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

                {/* Four cards in a row */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {cards.map((card, index) => (
                        <Grid size={{xs:6, sm: 3}} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    textAlign: 'center',
                                    backgroundColor: '#F3F4F6',
                                    boxShadow: 'none',
                                    border: 'none'
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            mb: 2
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: { xs: '60px', md: '80px' },
                                                height: { xs: '60px', md: '80px' },
                                                backgroundColor: '#9CA3AF',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 1,
                                                '& svg': {
                                                    fontSize: { xs: '2rem', md: '2.5rem' },
                                                    color: '#4B5563'
                                                }
                                            }}
                                        >
                                            {card.icon}
                                        </Box>
                                    </Box>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 500,
                                            color: 'text.primary'
                                        }}
                                    >
                                        {card.text}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Learn More Button */}
                <Box sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        component={Link}
                        href={learnMoreLink}
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
                        Learn More
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default WhatIsPlanLikeALocal;

