import React from 'react';
import { Box } from '@mui/material';
import WebsiteLayout from '../../../Layouts/WebsiteLayout.jsx';
import HomePageHeading from './components/HomePageHeading.jsx';
import WhatIsPlanLikeALocal from './components/WhatIsPlanLikeALocal.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import DestinationsSection from './components/DestinationsSection.jsx';
import GetStartedSection from './components/GetStartedSection.jsx';

const Index = ({ destinations = [] }) => {
  return (
    <WebsiteLayout>
      <Box sx={{ minHeight: '100vh' }}>
        <HomePageHeading />
        <WhatIsPlanLikeALocal />
        <HowItWorks />
        <DestinationsSection destinations={destinations} />
        <GetStartedSection />
      </Box>
    </WebsiteLayout>
  );
};

export default Index;
