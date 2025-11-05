import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Box, Container, Stepper, Step, StepLabel, Paper, Alert, Typography } from "@mui/material";
import WebsiteLayout from "../../../Layouts/WebsiteLayout.jsx";
import PlanATripGuide from "./components/PlanATripGuide.jsx";
import PlanStepperHeader from "./components/PlanStepperHeader.jsx";
import PlanStepperNavigation from "./components/PlanStepperNavigation.jsx";
import Step1PersonalInfo from "./components/Step1PersonalInfo.jsx";
import Step2TripDetails from "./components/Step2TripDetails.jsx";
import Step3SelectPlan from "./components/Step3SelectPlan.jsx";

const steps = [
    "Tell us a bit about you",
    "Trip Details",
    "Select a Plan",
];

const PlanStepper = ({ plan, destinations = [] }) => {
    const [activeStep, setActiveStep] = useState(0);
    // Get activities from multiple possible locations
    const activities = plan.activities || 
                      plan.destination_data?.activities || 
                      plan.destination?.activities || 
                      [];
    
    // Debug: Log to see what we have
    console.log('PlanStepper - Plan:', plan);
    console.log('PlanStepper - Activities:', activities);
    const { data, setData, put, processing, errors } = useForm({
        first_name: plan.first_name || "",
        last_name: plan.last_name || "",
        email: plan.email || "",
        phone: plan.phone || "",
        destination: plan.destination || "",
        destination_id: plan.destination_id || null,
        travel_dates: plan.travel_dates || "",
        travelers: plan.travelers || "",
        interests: plan.interests || [],
        other_interests: plan.other_interests || "",
        plan_type: plan.plan_type || plan.selected_plan || "",
        selected_plan: plan.selected_plan || plan.plan_type || "",
    });

    const handleNext = () => {
        console.log('handleNext called, activeStep:', activeStep);
        console.log('Current form data:', data);
        console.log('Current errors:', errors);
        
        // Save current step data before moving to next step
        put(`/plans/${plan.id}`, {
            preserveScroll: true,
            preserveState: true, // Keep state preserved to maintain activeStep
            onSuccess: (page) => {
                console.log('Update successful, moving to next step');
                console.log('Received page data:', page);
                
                // Check if we're on the final step before updating
                const isFinalStep = activeStep === steps.length - 1;
                
                // Use functional update to ensure we have the latest activeStep value
                setActiveStep((currentStep) => {
                    const nextStep = currentStep < steps.length - 1 ? currentStep + 1 : currentStep;
                    console.log('Updating step from', currentStep, 'to', nextStep);
                    return nextStep;
                });
                
                // If this is the final step, mark as completed
                if (isFinalStep) {
                    setData("status", "completed");
                    put(`/plans/${plan.id}`, {
                        preserveScroll: true,
                        preserveState: true,
                        onSuccess: () => {
                            // Plan completed - could redirect to a success page or show confirmation
                            alert("Plan created successfully!");
                        },
                        onError: (errors) => {
                            console.error('Error completing plan:', errors);
                        },
                    });
                }
            },
            onError: (errors) => {
                console.error('Error updating plan:', errors);
                console.error('Form errors:', errors);
                // Errors are automatically displayed via the errors prop from useForm
            },
            onFinish: () => {
                console.log('Request finished');
            },
        });
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleInterestChange = (interest) => {
        const newInterests = data.interests.includes(interest)
            ? data.interests.filter((i) => i !== interest)
            : [...data.interests, interest];
        setData("interests", newInterests);
    };

    // Check if step 1 (first step) fields are all filled
    const isStep1Valid = () => {
        return (
            data.first_name?.trim() &&
            data.last_name?.trim() &&
            data.email?.trim() &&
            data.phone?.trim()
        );
    };

    // Check if step 2 (trip details) has destination selected
    const isStep2Valid = () => {
        return data.destination_id && data.destination_id !== null && data.destination_id !== '';
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Step1PersonalInfo
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                );
            case 1:
                return (
                    <Step2TripDetails
                        data={data}
                        setData={setData}
                        errors={errors}
                        onInterestChange={handleInterestChange}
                        activities={activities}
                        destinations={destinations || []}
                        destinationData={plan.destination_data}
                        planId={plan.id}
                    />
                );
            case 2:
                return (
                    <Step3SelectPlan
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <WebsiteLayout>
            {/* Plan a Trip Guide Section */}
            <PlanATripGuide />

            <Box
                sx={{
                    mt: 10,
                    minHeight: "100vh",
                    bgcolor: "background.default",
                    py: 4,
                }}
            >
                <Container maxWidth="md">
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <PlanStepperHeader
                            activeStep={activeStep}
                            totalSteps={steps.length}
                        />

                        {/* Display Errors */}
                        {Object.keys(errors).length > 0 && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    Please fix the following errors:
                                </Typography>
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                    {Object.entries(errors).map(([key, value]) => (
                                        <li key={key}>
                                            <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
                                        </li>
                                    ))}
                                </ul>
                            </Alert>
                        )}

                        {/* Stepper */}
                        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {/* Step Content */}
                        <Box sx={{ mb: 4, minHeight: 200 }}>
                            {renderStepContent(activeStep)}
                        </Box>

                        {/* Navigation Buttons */}
                        <PlanStepperNavigation
                            activeStep={activeStep}
                            totalSteps={steps.length}
                            onBack={handleBack}
                            onNext={handleNext}
                            processing={processing}
                            isNextDisabled={
                                (activeStep === 0 && !isStep1Valid()) ||
                                (activeStep === 1 && !isStep2Valid())
                            }
                        />
                    </Paper>
                </Container>
            </Box>
        </WebsiteLayout>
    );
};

export default PlanStepper;
