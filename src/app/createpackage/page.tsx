
// 'use client'
// import React, { useEffect, useState } from 'react';
// import { Stepper, Step, StepLabel, Grid, useMediaQuery, useTheme, Box, Typography } from '@mui/material';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '@/store';
// import { setCompletedState } from '../../store/authSlice';
// import ShipFrom from '@/Components/CreatePackageTabs/CreatePackageShipFrom';
// import ShipTo from '@/Components/CreatePackageTabs/CreatePackageShipTo';
// import AdditionalInformation from '@/Components/CreatePackageTabs/AddtionalInformation';
// import TaxInfo from '@/Components/CreatePackageTabs/CreatePackageTax';
// import PickupDropoff from '@/Components/CreatePackageTabs/PickUpAndDropOffDetails';
// import PackageDetails from '@/Components/CreatePackageTabs/PackageDetailsTab';
// import BillTo from '@/Components/CreatePackageTabs/CreatePackageBillTo';
// import SnackbarAlert from '@/Components/ReusableComponents/SnackbarAlerts';

// const steps: string[] = [
//   'Ship From',
//   'Ship To',
//   'Package Details',
//   'Bill To',
//   'Additional Info',
//   'Pickup/Drop off',
//   'Tax Info',
// ];

// const CreatePackage: React.FC = () => {
//   const dispatch = useDispatch();
//   const completedSteps = useSelector((state: RootState) => state.auth.completedState);

//   const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
//   const [snackbarMessage, setSnackbarMessage] = useState<string>('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
//   const [activeStep, setActiveStep] = useState<number>(0);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

// useEffect(() => {
//     const firstUnfilledIndex = completedSteps.findIndex((step) => !step);
//     if (firstUnfilledIndex !== -1) {
//       setActiveStep(firstUnfilledIndex);
//     }
//   }, [completedSteps]);
//   const handleNext = () => {
//     dispatch(setCompletedState(activeStep));
//     setActiveStep((prevStep) => prevStep + 1);
//   };

//   const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

//   const handleSubmit = () => {
//     const firstUnfilledIndex = completedSteps.findIndex((step) => !step);
//     if (firstUnfilledIndex !== -1) {
//       setActiveStep(firstUnfilledIndex);
//       setSnackbarMessage('Some steps are unfilled! Navigating to first unfilled step...');
//       setSnackbarSeverity('warning');
//       setSnackbarOpen(true);
//     } else {
//       console.log('✅ All steps are filled. Submitting package details...');
//     }
//   };

//   return (
//     <Grid>
//       <SnackbarAlert
//         open={snackbarOpen}
//         message={snackbarMessage}
//         severity={snackbarSeverity}
//         onClose={() => setSnackbarOpen(false)}
//       />
//       <Box sx={{ overflowX: isMobile ? 'auto' : 'visible', padding: '10px' }}>
//         <Stepper
//           activeStep={activeStep}
//           alternativeLabel
//           sx={{
//             display: 'flex',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             minWidth: isMobile ? '650px' : '100%',
//           }}
//         >
//           {steps.map((label, index) => (
//             <Step key={index} sx={{ flex: 1 }} completed={completedSteps[index]}>
//               <StepLabel
//                 onClick={() => setActiveStep(index)}
//                 style={{
//                   cursor: 'pointer',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   color: 'white',
//                   borderRadius: '10px',
//                   padding: '5px 10px',
//                 }}
//               >
//                 <Typography sx={{ fontSize: '14px', textAlign: 'center' }}>{label}</Typography>
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </Box>

//       {/* Form Content */}
//       <Grid container spacing={2} sx={{ padding: isMobile ? '10px' : '20px' }}>
//         {activeStep === 0 && <ShipFrom onNext={handleNext} />}
//         {activeStep === 1 && <ShipTo onNext={handleNext} onBack={handleBack} />}
//         {activeStep === 2 && <PackageDetails onNext={handleNext} onBack={handleBack} />}
//         {activeStep === 3 && <BillTo onNext={handleNext} onBack={handleBack} />}
//         {activeStep === 4 && <AdditionalInformation onNext={handleNext} onBack={handleBack} />}
//         {activeStep === 5 && <PickupDropoff onNext={handleNext} onBack={handleBack} />}
//         {activeStep === 6 && <TaxInfo onSubmit={handleSubmit} onBack={handleBack} />}
//       </Grid>
//     </Grid>
//   );
// };

// export default CreatePackage;





'use client'
import React, { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Grid, useMediaQuery, useTheme, Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCompletedState } from '../../store/authSlice';
import ShipFrom from '@/Components/CreatePackageTabs/CreatePackageShipFrom';
import ShipTo from '@/Components/CreatePackageTabs/CreatePackageShipTo';
import AdditionalInformation from '@/Components/CreatePackageTabs/AddtionalInformation';
import TaxInfo from '@/Components/CreatePackageTabs/CreatePackageTax';
import PickupDropoff from '@/Components/CreatePackageTabs/PickUpAndDropOffDetails';
import PackageDetails from '@/Components/CreatePackageTabs/PackageDetailsTab';
import BillTo from '@/Components/CreatePackageTabs/CreatePackageBillTo';
import SnackbarAlert from '@/Components/ReusableComponents/SnackbarAlerts';

const steps: string[] = [
  'Ship From',
  'Ship To',
  'Package Details',
  'Bill To',
  'Additional Info',
  'Pickup/Drop off',
  'Tax Info',
];

const CreatePackage: React.FC = () => {
  const dispatch = useDispatch();
  const completedSteps = useSelector((state: RootState) => state.auth.completedState);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [activeStep, setActiveStep] = useState<number>(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

 console.log('active step :', activeStep)
  useEffect(() => {
    const firstUnfilledIndex = completedSteps.findIndex((step) => !step);
    setActiveStep(firstUnfilledIndex !== -1 ? firstUnfilledIndex : steps.length - 1);
  }, [completedSteps]);

  const handleNext = () => {
    dispatch(setCompletedState(activeStep));
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const handleSubmit = () => {
    const firstUnfilledIndex = completedSteps.findIndex((step) => !step);
    if (firstUnfilledIndex !== -1) {
      setActiveStep(firstUnfilledIndex);
      setSnackbarMessage('Some steps are unfilled! Navigating to first unfilled step...');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    } else {
      console.log('✅ All steps are filled. Submitting package details...');
    }
  };

  return (
    <Grid>
      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
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
            <Step key={index} sx={{ flex: 1 }} completed={completedSteps[index]}>
              <StepLabel
                onClick={() => handleStepClick(index)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: '10px',
                  padding: '5px 10px',
                  backgroundColor: activeStep === index ? '#ff69b4' : 'transparent', // Highlight active step in pink
                  color: activeStep === index ? 'white' : 'inherit',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    textAlign: 'center',
                    fontWeight: activeStep === index ? 'bold' : 'normal',
                  }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Form Content */}
      <Grid container spacing={2} sx={{ padding: isMobile ? '10px' : '20px' }}>
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
