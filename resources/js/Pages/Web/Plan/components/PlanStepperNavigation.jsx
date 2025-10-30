import React from 'react';
import { Box, Button } from '@mui/material';

const PlanStepperNavigation = ({
    activeStep,
    totalSteps,
    onBack,
    onNext,
    processing,
}) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
                disabled={activeStep === 0}
                onClick={onBack}
                variant="outlined"
                sx={{ minWidth: 100 }}
            >
                ← Back
            </Button>
            <Button
                variant="contained"
                onClick={onNext}
                disabled={processing}
                sx={{ minWidth: 150, bgcolor: '#424242', '&:hover': { bgcolor: '#212121' } }}
            >
                {processing ? 'Saving...' : activeStep === totalSteps - 1 ? 'Create Plan' : 'Continue →'}
            </Button>
        </Box>
    );
};

export default PlanStepperNavigation;

