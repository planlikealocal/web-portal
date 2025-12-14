import React from 'react';
import { Typography, Box, Container, Grid } from '@mui/material';
import CurvedSection from '../../../../Components/CurvedSection.jsx';

const MissionVisionSection = ({
    missionTitle,
    missionDescription,
    visionTitle ,
    visionDescription
}) => {
    const bottomContent = (
        <Box sx={{ pb:4 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid size={{xs:12, md: 6}}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>

                            <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 2 }}>
                                {missionTitle}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                {missionDescription}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{xs:12, md: 6}}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>

                        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 2 }}>
                            {visionTitle}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            {visionDescription}
                        </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );

    return (
        <CurvedSection
            topBgColor="#FFFFFF"
            bottomBgColor="#CED4DA"
            curveHeight={150}
            bottomContent={bottomContent}
        >
            <Box />
        </CurvedSection>
    );
};

export default MissionVisionSection;

