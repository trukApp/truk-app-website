// 'use client';
// import React, { useState } from 'react';
// import { Stepper, Step, StepLabel, Grid } from '@mui/material';
// import styles from './createpage.module.css';
// import ShipFrom from '@/Components/CreatePackageTabs/CreatePackageShipFrom';
// import ShipTo from '@/Components/CreatePackageTabs/CreatePackageShipTo';
// import AdditionalInformation from '@/Components/CreatePackageTabs/AddtionalInformation';
// import TaxInfo from '@/Components/CreatePackageTabs/CreatePackageTax';
// import PickupDropoff from '@/Components/CreatePackageTabs/PickUpAndDropOffDetails';
// import PackageDetails from '@/Components/CreatePackageTabs/PackageDetailsTab';
// import BillTo from '@/Components/CreatePackageTabs/CreatePackageBillTo';

// const steps = ['Ship From', 'Ship To', 'Package Details', 'Bill To', 'Additional Info', 'Pickup/Drop off', 'Tax Info'];

// const CreatePackage = () => {
//     const [activeStep, setActiveStep] = useState(0);

//     const handleNext = () => {
//         setActiveStep((prevStep) => prevStep + 1);
//     };

//     const handleBack = () => {
//         setActiveStep((prevStep) => prevStep - 1);
//     };

//     const handleSubmit = () => {
//         console.log('Submitting package details');
//     };

//     return (
//         <div>
//             <Stepper activeStep={activeStep} alternativeLabel>
//                 {steps.map((label, index) => (
//                     <Step key={index}>
//                         <StepLabel
//                             onClick={() => setActiveStep(index)}
//                             style={{ cursor: 'pointer' }}
//                         >
//                             {label}
//                         </StepLabel>
//                     </Step>
//                 ))}
//             </Stepper>

//             <Grid container spacing={2} className={styles.formContainer}>
//                 {activeStep === 0 && <ShipFrom onNext={handleNext} />}
//                 {activeStep === 1 && <ShipTo onNext={handleNext} onBack={handleBack} />}
//                 {activeStep === 2 && <PackageDetails onNext={handleNext} onBack={handleBack} />}
//                 {activeStep === 3 && <BillTo onNext={handleNext} onBack={handleBack} />}
//                 {activeStep === 4 && <AdditionalInformation onNext={handleNext} onBack={handleBack} />}
//                 {activeStep === 5 && <PickupDropoff onNext={handleNext} onBack={handleBack} />}
//                 {activeStep === 6 && <TaxInfo onSubmit={handleSubmit} onBack={handleBack} />}
//             </Grid>
//         </div>
//     );
// };

// export default CreatePackage;



'use client';
import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Grid, useMediaQuery, useTheme, Box, Typography } from '@mui/material';
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
    const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
    const handleSubmit = () => console.log('Submitting package details');

    return (
        <Grid>
            <Box sx={{ overflowX: isMobile ? 'auto' : 'visible', padding: '10px' }}>
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        minWidth: isMobile ? '650px' : '100%',
                    }}
                >
                    {steps.map((label, index) => (
                        <Step key={index} sx={{ flex: 1 }}>
                            <StepLabel
                                onClick={() => setActiveStep(index)}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography sx={{ fontSize: '14px', textAlign: 'center'  }}>
                                    {label}
                                </Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            {/* Form Content */}
            <Grid container spacing={2}  sx={{ padding: isMobile ? '10px' : '20px' }}>
                {activeStep === 0 && <ShipFrom onNext={handleNext} />}
                {activeStep === 1 && <ShipTo onNext={handleNext} onBack={handleBack} />}
                {activeStep === 2 && <PackageDetails onNext={handleNext} onBack={handleBack} />}
                {activeStep === 3 && <BillTo onNext={handleNext} onBack={handleBack} />}
                {activeStep === 4 && <AdditionalInformation onNext={handleNext} onBack={handleBack} />}
                {activeStep === 5 && <PickupDropoff onNext={handleNext} onBack={handleBack} />}
                {activeStep === 6 && <TaxInfo onSubmit={handleSubmit} onBack={handleBack} />}
            </Grid>
        </Grid>
    );
};

export default CreatePackage;
