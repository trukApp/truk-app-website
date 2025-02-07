'use client';
import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Grid } from '@mui/material';
import styles from './createpage.module.css';
import ShipFrom from '@/Components/CreatePackageTabs/CreatePackageShipFrom';
import ShipTo from '@/Components/CreatePackageTabs/CreatePackageShipTo';
import AdditionalInformation from '@/Components/CreatePackageTabs/AddtionalInformation';
import TaxInfo from '@/Components/CreatePackageTabs/CreatePackageTax';
import PickupDropoff from '@/Components/CreatePackageTabs/PickUpAndDropOffDetails';
import PackageDetails from '@/Components/CreatePackageTabs/PackageDetailsTab';
import BillTo from '@/Components/CreatePackageTabs/CreatePackageBillTo';

const steps = ['Ship From', 'Ship To', 'Package Details', 'Bill To', 'Additional Info', 'Pickup/Drop off', 'Tax Info'];

const CreatePackage = () => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = () => {
        console.log('Submitting package details');
    };

    return (
        <div>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel
                            onClick={() => setActiveStep(index)}
                            style={{ cursor: 'pointer' }}
                        >
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Grid container spacing={2} className={styles.formContainer}>
                {activeStep === 0 && <ShipFrom onNext={handleNext} />}
                {activeStep === 1 && <ShipTo onNext={handleNext} onBack={handleBack} />}
                {activeStep === 2 && <PackageDetails onNext={handleNext} onBack={handleBack} />}
                {activeStep === 3 && <BillTo onNext={handleNext} onBack={handleBack} />}
                {activeStep === 4 && <AdditionalInformation onNext={handleNext} onBack={handleBack} />}
                {activeStep === 5 && <PickupDropoff onNext={handleNext} onBack={handleBack} />}
                {activeStep === 6 && <TaxInfo onSubmit={handleSubmit} onBack={handleBack} />}
            </Grid>
        </div>
    );
};

export default CreatePackage;
