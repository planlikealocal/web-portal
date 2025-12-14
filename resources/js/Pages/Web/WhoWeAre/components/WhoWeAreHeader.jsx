import React from 'react';
import { Typography, Box } from '@mui/material';
import CurvedSection from '../../../../Components/CurvedSection.jsx';

const WhoWeAreHeader = ({ title = 'Who We Are', description }) => {
    return (
        <CurvedSection
            showBottomSection={false}
            topBgColor="#FFFFFF"
            bottomBgColor="#CED4DA"
            curveType="smile"
        >
            <Box sx={{ textAlign: 'center', pt: 8, px: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {description}
                </Typography>
            </Box>
        </CurvedSection>
    );
};

export default WhoWeAreHeader;

