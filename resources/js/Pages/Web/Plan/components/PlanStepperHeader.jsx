import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const PlanStepperHeader = ({ activeStep, totalSteps }) => {
    return (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                Let's Plan like a Local
            </Typography>
            <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress
                    variant="determinate"
                    value={((activeStep + 1) / totalSteps) * 100}
                    sx={{ height: 4, borderRadius: 2 }}
                />
            </Box>
        </Box>
    );
};

export default PlanStepperHeader;

