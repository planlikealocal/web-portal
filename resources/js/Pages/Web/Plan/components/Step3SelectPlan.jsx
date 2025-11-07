import React, { useState } from 'react';
import { Grid, Typography, Card, CardContent, Box, Avatar } from '@mui/material';
import { Subscriptions } from '@mui/icons-material';

const plans = [
    {
        icon: '/images/plans/explore.png',
        id: 'explore',
        name: 'Explore chat',
        description: 'Si ergo illa tantum fastidium compesce contra naturalem usum habili, quem habetis',
        features: [
            '1-hour video chat with your local specialist',
            'AI-generated notes summarizing your session',
        ],
        price: '$',
        time: "30 minutes",
    },
    {
        icon: '/images/plans/pathfinder.png',
        id: 'pathfinder',
        name: 'Pathfinder chat',
        description: 'Si ergo illa tantum fastidium compesce contra naturalem usum habili, quem habetis',
        features: [
            '1-hour video chat with your local specialist',
            'AI-generated notes summarizing your session',
            'Curated must-do list of activities, dining, and insider tips tailored to your trip',
        ],
        price: '$$',
        recommended: true,
        time: "40 minutes",
    },
    {
        id: 'premium',
        icon: '/images/plans/premium.png',
        name: 'Premium chat',
        description: 'Si ergo illa tantum fastidium compesce contra naturalem usum habili, quem habetis',
        features: [
            '1-hour video chat with your local specialist',
            'AI-generated notes summarizing your session',
            'Curated must-do list of activities, dining, and insider tips tailored to your trip',
            'Priority support and extended consultation time',
        ],
        price: '$$$',
        time: "60 minutes",
    },
];

const Step3SelectPlan = ({ data, setData, errors }) => {
    const [selectedPlanId, setSelectedPlanId] = useState(data.plan_type || data.selected_plan || 'pathfinder');

    const handlePlanSelect = (planId) => {
        setSelectedPlanId(planId);
        setData('plan_type', planId);
        setData('selected_plan', planId);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 4, textAlign: 'center' }}>
                Select a Plan
            </Typography>
            
            {errors.plan_type && (
                <Typography variant="body2" color="error" sx={{ mb: 2, textAlign: 'center' }}>
                    {errors.plan_type}
                </Typography>
            )}

            <Grid container spacing={3}>
                {plans.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    const isRecommended = plan.recommended;

                    return (
                        <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    border: isSelected ? 2 : 1,
                                    borderColor: isSelected ? 'primary.main' : 'divider',
                                    bgcolor: isSelected ? 'action.selected' : 'background.paper',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        boxShadow: 3,
                                    },
                                    position: 'relative',
                                }}
                                onClick={() => handlePlanSelect(plan.id)}
                            >
                            
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                        
                                        <Avatar>
                                            <Subscriptions />
                                        </Avatar>
                                    </Box>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600}}>
                                            {plan.name}
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 2, minHeight: 60 }}
                                    >
                                        {plan.description}
                                    </Typography>

                                    <Box sx={{ mb: 8 }}>
                                        {plan.features.map((feature, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    mb: 1,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: 'success.main',
                                                        mr: 1,
                                                        fontSize: '1.2rem',
                                                    }}
                                                >
                                                    ✓
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {feature}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    <Box
                                        sx={{
                                            paddingTop: 2,
                                            borderTop: 1,
                                            borderColor: 'divider',
                                            position: 'absolute',
                                            bottom: 10,
                                            left: 0,
                                            right: 0,
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {plan.price}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default Step3SelectPlan;

