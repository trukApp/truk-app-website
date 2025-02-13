'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Stepper, Step, StepLabel, Grid, useMediaQuery, useTheme, Box, Typography } from '@mui/material';
import ShipFrom from '@/Components/CreatePackageTabs/CreatePackageShipFrom';
import ShipTo from '@/Components/CreatePackageTabs/CreatePackageShipTo';
import AdditionalInformation from '@/Components/CreatePackageTabs/AddtionalInformation';
import TaxInfo from '@/Components/CreatePackageTabs/CreatePackageTax';
import PickupDropoff from '@/Components/CreatePackageTabs/PickUpAndDropOffDetails';
import PackageDetails from '@/Components/CreatePackageTabs/PackageDetailsTab';
import BillTo from '@/Components/CreatePackageTabs/CreatePackageBillTo';
import SnackbarAlert from '@/Components/ReusableComponents/SnackbarAlerts';
import { RootState } from '@/store';
import { setCompletedState } from '@/store/authSlice';

const steps = ['Ship From', 'Ship To', 'Package Details', 'Bill To', 'Additional Info', 'Pickup/Drop off', 'Tax Info'];

const CreatePackage = () => {
    const dispatch=useDispatch()
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Get completed steps from Redux
    const completedSteps = useSelector((state: RootState) => state.auth.completedState);
    console.log("Completed Steps:", completedSteps);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>("success");
    const [activeStep, setActiveStep] = useState(0);

    // Set the initial active step to the first unfilled step
    useEffect(() => {
        if (completedSteps.length > 0) {
            const firstUnfilledIndex = completedSteps.findIndex(step => !step);
            setActiveStep(firstUnfilledIndex !== -1 ? firstUnfilledIndex : completedSteps.length);
        }
    }, [completedSteps]);

    const handleNext = (stepIndex: number) => {
    dispatch(setCompletedState(stepIndex));
    setActiveStep(stepIndex + 1);
};

    const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

    const handleStepClick = (stepIndex: number) => {
        setActiveStep(stepIndex);
    };

    const handleSubmit = () => {
        const firstUnfilledIndex = completedSteps.findIndex((step) => !step);
        if (firstUnfilledIndex === -1) {
            console.log('✅ All steps are filled. Submitting package details...');
            dispatch(setCompletedState(0))
        } else {
            console.log('🚨 Some steps are unfilled! Navigating to first unfilled step...');
            setSnackbarMessage("Some steps are unfilled! Navigating to first unfilled step...");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            setActiveStep(firstUnfilledIndex);
        }
    };

    return (
        <Grid>
            <SnackbarAlert open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
            <Box sx={{ overflowX: isMobile ? 'auto' : 'visible', padding: '10px' }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={index} completed={!!completedSteps[index]}>
                            <StepLabel onClick={() => handleStepClick(index)} sx={{
                                cursor: 'pointer',
                            }}>
                                <Typography sx={{ fontSize: '14px', textAlign: 'center', color:activeStep === index ? "#83214F" : '#333', fontWeight:activeStep === index ? 'bold' : '400'   }}>{label}</Typography>
                            </StepLabel>
                        </Step>

                    ))}
                </Stepper>
            </Box>

            {/* Form Content */}
            <Grid container spacing={2} sx={{ padding: isMobile ? '10px' : '20px' }}>
                {activeStep === 0 && <ShipFrom onNext={() => handleNext(0)} />}
                {activeStep === 1 && <ShipTo onNext={() => handleNext(1)} onBack={handleBack} />}
                {activeStep === 2 && <PackageDetails onNext={() => handleNext(2)} onBack={handleBack} />}
                {activeStep === 3 && <BillTo onNext={() => handleNext(3)} onBack={handleBack} />}
                {activeStep === 4 && <AdditionalInformation onNext={() => handleNext(4)} onBack={handleBack} />}
                {activeStep === 5 && <PickupDropoff onNext={() => handleNext(5)} onBack={handleBack} />}
                {activeStep === 6 && <TaxInfo onSubmit={handleSubmit} onBack={handleBack} />}
            </Grid>
        </Grid>
    );
};

export default CreatePackage;
