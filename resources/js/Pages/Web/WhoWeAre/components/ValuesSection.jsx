import React from 'react';
import { Typography, Box, Container, Grid } from '@mui/material';

const ValuesSection = ({
    title = 'Our Values',
    subtitle = 'What drives us forward',
    description = 'These core values guide everything we do and shape how we work with our clients and specialists.',
    values = []
}) => {
    const defaultValues = [
        {
            title: 'Excellence',
            description: 'We strive for excellence in every interaction and service we provide.'
        },
        {
            title: 'Integrity',
            description: 'We conduct our business with honesty, transparency, and ethical practices.'
        },
        {
            title: 'Innovation',
            description: 'We continuously innovate to provide the best solutions for our clients.'
        }
    ];

    const displayValues = values.length > 0 ? values : defaultValues;

    return (
        <Box sx={{ py: 8, px: 4, backgroundColor: '#FFFFFF' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        {subtitle}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mt: 2 }}>
                        {description}
                    </Typography>
                </Box>
                <Grid container spacing={4}>
                    {displayValues.map((value, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" component="h3" gutterBottom>
                                    {value.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {value.description}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default ValuesSection;

