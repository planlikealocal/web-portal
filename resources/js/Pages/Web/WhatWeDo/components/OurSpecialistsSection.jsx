import React from 'react';
import { Typography, Box, Stack } from '@mui/material';
import RandomAvatarCloud from '../../../../Components/RandomAvatarCloud.jsx';

const OurSpecialistsSection = ({
    subtitle = 'Our Specialists',
    title = 'Meet the people who know your destination best',
    description,
    avatarUrls = [],
    totalCircles = 20,
    minSize = 40,
    maxSize = 120,
    spacing = 2
}) => {
    return (
        <Stack direction="row" spacing={2} sx={{ mb: 4, px: 4, py: 4 }}>
            <Box sx={{ width: '50%', display: 'flex', justifyContent: 'right', textAlign: 'right', pt: 3 }}>
                <Box sx={{ mt: 4, width: "60%" }}>
                    <Typography variant="h6" gutterBottom>
                        {subtitle}
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="p" gutterBottom>
                        {description}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ width: '50%' }}>
                <Box sx={{ mt: 4, width: "60%" }}>
                    <RandomAvatarCloud
                        avatarUrls={avatarUrls}
                        totalCircles={totalCircles}
                        minSize={minSize}
                        maxSize={maxSize}
                        spacing={spacing}
                    />
                </Box>
            </Box>
        </Stack>
    );
};

export default OurSpecialistsSection;

