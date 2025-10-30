import React, { useState } from 'react';
import HeaderSection from './components/HeaderSection.jsx';
import TabPanel from './components/TabPanel.jsx';
import OverviewTab from './components/OverviewTab.jsx';
import ImagesTab from './components/ImagesTab.jsx';
import SeasonsTab from './components/SeasonsTab.jsx';
import ActivitiesTab from './components/ActivitiesTab.jsx';
import ItinerariesTab from './components/ItinerariesTab.jsx';
import PlanTripTab from './components/PlanTripTab.jsx';
import WebsiteLayout from '../../../Layouts/WebsiteLayout.jsx';
import {
    Box,
    Tabs,
    Tab,
} from '@mui/material';
import { } from '@mui/icons-material';

const DestinationShow = ({ destination }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <WebsiteLayout>
            <div className="min-h-screen bg-white">
                <HeaderSection destination={destination} />

                {/* Tabs Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            aria-label="destination preview tabs"
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    minHeight: 60,
                                },
                            }}
                        >
                            <Tab label="OVERVIEW" id="destination-tab-0" aria-controls="destination-tabpanel-0" />
                            <Tab label={`BEST TIME TO GO (${destination.seasons?.length || 0})`} id="destination-tab-1" aria-controls="destination-tabpanel-1" />
                            <Tab label={`ACTIVITIES (${destination.activities?.length || 0})`} id="destination-tab-2" aria-controls="destination-tabpanel-2" />
                            <Tab label={`ITINERARIES (${destination.itineraries?.length || 0})`} id="destination-tab-3" aria-controls="destination-tabpanel-3" />
                            <Tab label="PLAN YOUR TRIP" id="destination-tab-4" aria-controls="destination-tabpanel-4" />
                        </Tabs>
                    </Box>

                    {/* Tab Panels */}
                    <TabPanel value={activeTab} index={0}>
                        <OverviewTab destination={destination} />
                    </TabPanel>
                    {/* Seasons Tab */}
                    <TabPanel value={activeTab} index={1}>
                        <SeasonsTab seasons={destination.seasons} />
                    </TabPanel>

                    {/* Activities Tab */}
                    <TabPanel value={activeTab} index={2}>
                        <ActivitiesTab activities={destination.activities} />
                    </TabPanel>

                    {/* Itineraries Tab */}
                    <TabPanel value={activeTab} index={3}>
                        <ItinerariesTab itineraries={destination.itineraries} />
                    </TabPanel>

                    {/* Plan Your Trip Tab */}
                    <TabPanel value={activeTab} index={4}>
                        <PlanTripTab destination={destination} />
                    </TabPanel>
                </div>

                {/* Bottom spacing */}
                <div className="pb-12"></div>
            </div>
        </WebsiteLayout>
    );
};

export default DestinationShow;
