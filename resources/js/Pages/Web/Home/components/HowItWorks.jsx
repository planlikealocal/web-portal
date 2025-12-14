import React from 'react';
import { Typography, Box, Container, Grid, Card, CardContent } from '@mui/material';
import { Landscape } from '@mui/icons-material';

const HowItWorks = ({
    title = 'How it works?'
}) => {
    // Create 4 identical cards
    const cards = Array(4).fill({
        icon: <Landscape />,
        title: 'Title',
        description: 'Praeterea, ex culpa non invenies unum aut non accusatis unum. Et nihil'
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
                </Box>

                <Grid container spacing={3}>
                    {cards.map((card, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    textAlign: 'center',
                                    backgroundColor: '#E0E0E0',
                                    boxShadow: 'none',
                                    border: 'none',
                                    borderRadius: 1
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
                                                backgroundColor: '#A0A0A0',
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
                                        variant="h6" 
                                        component="h3" 
                                        gutterBottom
                                        sx={{ 
                                            fontWeight: 700,
                                            mb: 1.5,
                                            color: 'text.primary'
                                        }}
                                    >
                                        {card.title}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: 'text.primary',
                                            fontSize: '0.875rem',
                                            lineHeight: 1.6
                                        }}
                                    >
                                        {card.description}
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

export default HowItWorks;

