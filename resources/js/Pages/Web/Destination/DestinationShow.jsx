import React, { useState, useEffect, useRef } from "react";
import HeaderSection from "./components/HeaderSection.jsx";
import OverviewTab from "./components/OverviewTab.jsx";
import SeasonsTab from "./components/SeasonsTab.jsx";
import ActivitiesTab from "./components/ActivitiesTab.jsx";
import ItinerariesTab from "./components/ItinerariesTab.jsx";
import PlanTripTab from "./components/PlanTripTab.jsx";
import WebsiteLayout from "../../../Layouts/WebsiteLayout.jsx";
import { Box, ButtonGroup, Button } from "@mui/material";

const tabs = [
    { id: 'overview-tab', label: 'OVERVIEW' },
    { id: 'seasons-tab', label: 'BEST TIME TO GO' },
    { id: 'itineraries-tab', label: 'ITINERARIES' },
    { id: 'activities-tab', label: 'ACTIVITIES' },
    { id: 'plan-trip-tab', label: 'PLAN YOUR TRIP' }
];

const DestinationShow = ({ destination }) => {
    const [activeTab, setActiveTab] = useState('overview-tab');
    const observerRef = useRef(null);

    useEffect(() => {
        const tabIds = tabs.map(tab => tab.id);
        
        // Create Intersection Observer to track which section is in view
        observerRef.current = new IntersectionObserver(
            (entries) => {
                // Find the entry with the highest intersection ratio (most visible)
                let mostVisible = null;
                let maxRatio = 0;

                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                        maxRatio = entry.intersectionRatio;
                        mostVisible = entry.target.id;
                    }
                });

                // If we found a most visible section, set it as active
                if (mostVisible) {
                    setActiveTab(mostVisible);
                } else {
                    // Fallback: find the section closest to the viewport top
                    const visibleEntries = entries.filter(e => e.isIntersecting);
                    if (visibleEntries.length > 0) {
                        visibleEntries.sort((a, b) => {
                            const aTop = a.boundingClientRect.top;
                            const bTop = b.boundingClientRect.top;
                            return Math.abs(aTop - 100) - Math.abs(bTop - 100);
                        });
                        setActiveTab(visibleEntries[0].target.id);
                    }
                }
            },
            {
                root: null,
                rootMargin: '-100px 0px -60% 0px', // Account for sticky header and trigger earlier
                threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0]
            }
        );

        // Observe all tab sections after a small delay to ensure they're rendered
        const timeoutId = setTimeout(() => {
            tabIds.forEach((tabId) => {
                const element = document.getElementById(tabId);
                if (element && observerRef.current) {
                    observerRef.current.observe(element);
                }
            });
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    const handleTabClick = (tabId) => {
        const element = document.getElementById(tabId);
        if (element) {
            setActiveTab(tabId);
            const offset = 150; // Account for sticky header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <WebsiteLayout>
            <div className="min-h-screen bg-white">
                <HeaderSection destination={destination} />

                {/* Tabs Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Box
                        sx={{
                            mb: 3,
                            position: 'sticky',
                            top: 65,
                            zIndex: 100,
                            backgroundColor: 'white',
                            pt: 2,
                            pb: 2,
                        }}
                    >
                        <ButtonGroup
                            variant="outlined"
                            aria-label="Basic button group"
                        >
                            {tabs.map((tab) => (
                                <Button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    variant={activeTab === tab.id ? 'contained' : 'outlined'}
                                    sx={{
                                        backgroundColor: activeTab === tab.id ? 'primary.main' : 'transparent',
                                        color: activeTab === tab.id ? 'white' : 'primary.main',
                                        '&:hover': {
                                            backgroundColor: activeTab === tab.id ? 'primary.dark' : 'primary.light',
                                            color: activeTab === tab.id ? 'white' : 'primary.main',
                                        }
                                    }}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </ButtonGroup>
        
                    </Box>

                    <OverviewTab destination={destination} className="mb-6" id="overview-tab"/>
                    <SeasonsTab seasons={destination.seasons} className="mb-6" id="seasons-tab"/>
                    <ItinerariesTab itineraries={destination.itineraries} className="mb-6" id="itineraries-tab"/>
                    <ActivitiesTab activities={destination.activities} className="mb-6" id="activities-tab"/>
                    <PlanTripTab destination={destination} className="mb-6" id="plan-trip-tab"/>
                </div>

                {/* Bottom spacing */}
                <div className="pb-12"></div>
            </div>
        </WebsiteLayout>
    );
};

export default DestinationShow;
