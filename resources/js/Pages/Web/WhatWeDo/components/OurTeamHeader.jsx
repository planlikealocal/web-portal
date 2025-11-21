import React from 'react';
import { Typography, Box } from '@mui/material';

const OurTeamHeader = ({ title = 'Our Team' }) => {
    return (
        <Box fullfillWidth sx={{ mb: 4, px: 4, py: 4, textAlign: 'center' }}>
            <Typography sx={{ mb: 4, width: "100%" }} variant="h3" component="h1" gutterBottom align="center">
                {title}
            </Typography>
        </Box>
    );
};

export default OurTeamHeader;

