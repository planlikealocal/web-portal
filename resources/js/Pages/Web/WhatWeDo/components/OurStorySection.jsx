import React from 'react';
import { Typography, Box, Stack } from '@mui/material';

const OurStorySection = ({
    imageSrc = '/web/our-story-image.webp',
    imageAlt = 'Our Story',
    subtitle = 'Our Story',
    title = 'Travel Inspired by passionate local explorers',
    description
}) => {
    return (
        <Box className={'container, bg-gray-300'}>
            <Stack direction="row" spacing={2} sx={{ mb: 4, px: 4, py: 4 }}>
                <Box sx={{ width: '50%', display: 'flex', justifyContent: 'right', textAlign: 'right' }}>
                    <Box
                        component="img"
                        src={imageSrc}
                        alt={imageAlt}
                        sx={{
                            width: '50%',
                            height: 'auto',
                            objectFit: 'contain',
                        }}
                    />
                </Box>
                <Box sx={{ width: '50%' }}>
                    <Box sx={{ width: '50%' }}>
                        <Typography variant="h5" component="h1" gutterBottom>
                            {subtitle}
                        </Typography>
                        <Typography variant="h4" component="h3" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {description}
                        </Typography>
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};

export default OurStorySection;

