import React from 'react';
import { Box } from '@mui/material';
import WebsiteLayout from '../../../Layouts/WebsiteLayout.jsx';
import WhoWeAreHeader from './components/WhoWeAreHeader.jsx';
import MissionVisionSection from './components/MissionVisionSection.jsx';
import ValuesSection from './components/ValuesSection.jsx';

const Index = () => {


    return (
        <WebsiteLayout>
            <Box sx={{ minHeight: '100vh' }}>
                <WhoWeAreHeader
                    title="Who We Are"
                    description="Quidam alii sunt, et non est in nostra"
                />
                <MissionVisionSection
                    missionTitle="Our Mission"
                    missionDescription="Quidam alii sunt, et non est in nostra potestate. Quae omnia in nostra sententia, pursuit, cupiditatem, aversatio, ex quibus in Verbo, quicquid non suis actibus"
                    visionTitle="Our Vision"
                    visionDescription="Quidam alii sunt, et non est in nostra potestate. Quae omnia in nostra sententia, pursuit, cupiditatem, aversatio, ex quibus in Verbo, quicquid non suis actibus"
                />

            </Box>
        </WebsiteLayout>
    );
};

export default Index;
