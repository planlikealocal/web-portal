import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Box, Container, Stepper, Step, StepLabel, Paper } from "@mui/material";
import WebsiteLayout from "../../../Layouts/WebsiteLayout.jsx";
import PlanStepperHeader from "./components/PlanStepperHeader.jsx";
import PlanStepperNavigation from "./components/PlanStepperNavigation.jsx";
import Step1PersonalInfo from "./components/Step1PersonalInfo.jsx";
import Step2Destination from "./components/Step2Destination.jsx";
import Step3Travelers from "./components/Step3Travelers.jsx";
import Step4Interests from "./components/Step4Interests.jsx";

const steps = [
    "Tell us a bit about you",
    "Where do you want to go?",
    "Who will be your traveling?",
    "What are your interests?",
];

const PlanStepper = ({ plan }) => {
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
        travel_dates: plan.travel_dates || "",
        travelers: plan.travelers || "",
        interests: plan.interests || [],
        other_interests: plan.other_interests || "",
    });

    const handleNext = () => {
        // Save current step data before moving to next step
        put(`/plans/${plan.id}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                if (activeStep < steps.length - 1) {
                    setActiveStep(activeStep + 1);
                } else {
                    // Final step - mark as completed
                    setData("status", "completed");
                    put(`/plans/${plan.id}`, {
                        preserveScroll: true,
                        preserveState: true,
                        onSuccess: () => {
                            // Plan completed - could redirect to a success page or show confirmation
                            alert("Plan created successfully!");
                        },
                    });
                }
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
                    <Step2Destination
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                );
            case 2:
                return (
                    <Step3Travelers
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                );
            case 3:
                return (
                    <Step4Interests
                        data={data}
                        setData={setData}
                        errors={errors}
                        onInterestChange={handleInterestChange}
                        activities={activities}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <WebsiteLayout>
            <Box
                sx={{
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
                        />
                    </Paper>
                </Container>
            </Box>
        </WebsiteLayout>
    );
};

export default PlanStepper;
