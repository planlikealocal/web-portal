import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Box, Container, Stepper, Step, StepLabel, Paper, Alert, Typography } from "@mui/material";
import WebsiteLayout from "../../../Layouts/WebsiteLayout.jsx";
import PlanATripGuide from "./components/PlanATripGuide.jsx";
import PlanStepperHeader from "./components/PlanStepperHeader.jsx";
import PlanStepperNavigation from "./components/PlanStepperNavigation.jsx";
import Step1PersonalInfo from "./components/Step1PersonalInfo.jsx";
import Step2TripDetails from "./components/Step2TripDetails.jsx";
import Step3SelectPlan from "./components/Step3SelectPlan.jsx";
import Step4SelectTime from "./components/Step4SelectTime.jsx";

const steps = [
    "Tell us a bit about you",
    "Trip Details",
    "Select a Plan",
    "Select Time",
];

const PlanStepper = ({ plan, destinations = [] }) => {
    const { flash } = usePage().props;
    
    // If plan is completed, start at step 3 (Select Time), otherwise start at step 0
    const initialStep = plan.status === 'completed' ? 3 : 0;
    const [activeStep, setActiveStep] = useState(initialStep);
    
    // Lock steps 1-3 if appointment is completed
    const isAppointmentCompleted = plan.status === 'completed';
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

        // Check if we're on step 3 (Select Time - final step)
        const isAppointmentStep = activeStep === 3;

        // If this is step 3 (Select Time), the confirmation and payment redirect
        // will be handled by Step4SelectTime component
        if (isAppointmentStep) {
            // Don't proceed automatically - let Step4SelectTime handle confirmation
            return;
        } else {
            // Save current step data before moving to next step
            put(`/plans/${plan.id}`, {
                preserveScroll: true,
                preserveState: true, // Keep state preserved to maintain activeStep
                onSuccess: (page) => {
                    console.log('Update successful, moving to next step');
                    console.log('Received page data:', page);

                    // Use functional update to ensure we have the latest activeStep value
                    setActiveStep((currentStep) => {
                        const nextStep = currentStep < steps.length - 1 ? currentStep + 1 : currentStep;
                        console.log('Updating step from', currentStep, 'to', nextStep);
                        return nextStep;
                    });
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
        }
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

    // Check if step 3 (plan selection) has plan selected
    const isStep3Valid = () => {
        return data.selected_plan || data.plan_type;
    };

    // Check if step 4 (time selection) has time slot selected
    const isStep4Valid = () => {
        return data.selected_time_slot || (data.appointment_start && data.appointment_end);
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
            case 3:
                return (
                    <Step4SelectTime
                        data={data}
                        setData={setData}
                        errors={errors}
                        planId={plan.id}
                        specialist={plan.specialist}
                        disabled={isAppointmentCompleted}
                        plan={plan}
                        onConfirm={async () => {
                            // Validate that appointment details are selected
                            // Check both data and selectedSlot from Step4
                            const hasAppointmentData = data.selected_time_slot || 
                                                       (data.appointment_start && data.appointment_end);
                            
                            if (!hasAppointmentData) {
                                throw new Error('Please select a time slot before confirming the appointment.');
                            }

                            // Ensure appointment data is set
                            if (data.selected_time_slot && typeof data.selected_time_slot === 'object') {
                                if (!data.appointment_start) {
                                    setData('appointment_start', data.selected_time_slot.start);
                                }
                                if (!data.appointment_end) {
                                    setData('appointment_end', data.selected_time_slot.end);
                                }
                            }

                            // Set status to completed
                            setData("status", "completed");
                            
                            // Save plan with completed status and create Google Calendar event
                            return new Promise((resolve, reject) => {
                                put(`/plans/${plan.id}`, {
                                    preserveScroll: true,
                                    preserveState: true,
                                    onSuccess: () => {
                                        resolve();
                                    },
                                    onError: (errors) => {
                                        console.error('Error completing plan:', errors);
                                        const errorMessage = errors.error || 'Failed to complete appointment. Please try again.';
                                        reject(new Error(errorMessage));
                                    },
                                });
                            });
                        }}
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
                <Container sx={{ mb: 10, mt: 10, px: 4, py: 4, bgcolor: "background.default" }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <PlanStepperHeader
                            activeStep={activeStep}
                            totalSteps={steps.length}
                        />

                        {/* Display Success/Error Messages */}
                        {flash?.payment_success && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                {flash.payment_success}
                            </Alert>
                        )}
                        {flash?.payment_cancelled && (
                            <Alert severity="warning" sx={{ mb: 3 }}>
                                {flash.payment_cancelled}
                            </Alert>
                        )}
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
                            {steps.map((label, index) => (
                                <Step 
                                    key={label}
                                    disabled={isAppointmentCompleted && index < 3}
                                >
                                    <StepLabel 
                                        error={isAppointmentCompleted && index < 3}
                                    >
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {/* Step Content */}
                        <Box sx={{ mb: 4, minHeight: 200 }}>
                            {renderStepContent(activeStep)}
                        </Box>

                        {/* Navigation Buttons - Hide on final step (payment handled in Step4) */}
                        {activeStep < steps.length - 1 && (
                            <PlanStepperNavigation
                                activeStep={activeStep}
                                totalSteps={steps.length}
                                onBack={handleBack}
                                onNext={handleNext}
                                processing={processing}
                                isNextDisabled={
                                    isAppointmentCompleted ||
                                    (activeStep === 0 && !isStep1Valid()) ||
                                    (activeStep === 1 && !isStep2Valid()) ||
                                    (activeStep === 2 && !isStep3Valid())
                                }
                            />
                        )}
                    </Paper>
                </Container>
            </Box>
        </WebsiteLayout>
    );
};

export default PlanStepper;
