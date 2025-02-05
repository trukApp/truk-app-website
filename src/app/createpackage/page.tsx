// 'use client';
// import React from 'react';
// import { Formik } from 'formik';
// import {
//     TextField,
//     MenuItem,
//     Select,
//     InputLabel,
//     FormControl,
//     FormHelperText,
//     Grid,
//     CardContent,
//     Typography,
// } from '@mui/material';
// import styles from './createpage.module.css'

// interface CreatePackageFormValues {
//     packageName: string;
//     weight: string;
//     length: string;
//     width: string;
//     volume: string;
//     senderName: string;
//     senderAddress: string;
//     senderPincode: string;
//     senderState: string;
//     senderCountry: string;
//     senderPhone: string;
//     receiverName: string;
//     receiverAddress: string;
//     receiverPincode: string;
//     receiverState: string;
//     receiverCountry: string;
//     receiverPhone: string;
//     weightUnit: string,

// }

// const CreatePackage = () => {
//     const initialValues: CreatePackageFormValues = {
//         packageName: '',
//         weight: '',
//         weightUnit: '',
//         length: '',
//         width: '',
//         volume: '',
//         senderName: '',
//         senderAddress: '',
//         senderPincode: '',
//         senderState: '',
//         senderCountry: '',
//         senderPhone: '',
//         receiverName: '',
//         receiverAddress: '',
//         receiverPincode: '',
//         receiverState: '',
//         receiverCountry: '',
//         receiverPhone: '',
//     };

//     const validate = (values: CreatePackageFormValues) => {
//         const errors: Partial<CreatePackageFormValues> = {};
//         if (!values.packageName) errors.packageName = 'Package Name is required';
//         // if (!values.weight) errors.weight = 'Weight is required';
//         if (!values.length) errors.length = 'Length is required';
//         if (!values.width) errors.width = 'Width is required';
//         if (!values.volume) errors.volume = 'Volume is required';
//         if (!values.senderName) errors.senderName = 'Sender Name is required';
//         if (!values.senderAddress) errors.senderAddress = 'Sender Address is required';
//         if (!values.senderPincode) errors.senderPincode = 'Sender Pincode is required';
//         if (!values.senderState) errors.senderState = 'Sender State is required';
//         if (!values.senderCountry) errors.senderCountry = 'Sender Country is required';
//         if (!values.senderPhone) errors.senderPhone = 'Sender Phone is required';
//         if (!values.receiverName) errors.receiverName = 'Receiver Name is required';
//         if (!values.receiverAddress) errors.receiverAddress = 'Receiver Address is required';
//         if (!values.receiverPincode) errors.receiverPincode = 'Receiver Pincode is required';
//         if (!values.receiverState) errors.receiverState = 'Receiver State is required';
//         if (!values.receiverCountry) errors.receiverCountry = 'Receiver Country is required';
//         if (!values.receiverPhone) errors.receiverPhone = 'Receiver Phone is required';
//         if (!values.weight) errors.weight = 'Weight is required';
//         if (!values.weightUnit) errors.weightUnit = 'Weight unit is required';
//         return errors;
//     };

//     const handleSubmit = (values: CreatePackageFormValues) => {
//         console.log('Form Data:', values);
//         alert('Form submitted successfully!');
//     };

//     return (
//         <div>
//             <CardContent>
//                 <Typography variant="h5" gutterBottom>
//                     Create Package
//                 </Typography>
//                 <Formik
//                     initialValues={initialValues}
//                     validate={validate}
//                     onSubmit={handleSubmit}
//                 >
//                     {({ values, handleChange, handleSubmit, errors, touched }) => (
//                         <form onSubmit={handleSubmit}>
//                             <Grid container spacing={2}>
//                                 {/* Package Details Section */}
//                                 <Grid item xs={12}>
//                                     <Typography variant="h6" className={styles.sectionHeading}>Package Details</Typography>
//                                 </Grid>
//                                 <Grid item xs={12} md={6}>
//                                     <TextField
//                                         label="Package Name"
//                                         name="packageName"
//                                         value={values.packageName}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.packageName && errors.packageName)}
//                                         helperText={touched.packageName && errors.packageName}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="Weight"
//                                         name="weight"
//                                         value={values.weight}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.weight && errors.weight)}
//                                         helperText={touched.weight && errors.weight}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <FormControl fullWidth error={Boolean(touched.weightUnit && errors.weightUnit)}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     >
//                                         <InputLabel>Unit</InputLabel>
//                                         <Select
//                                             name="weightUnit"
//                                             value={values.weightUnit}
//                                             onChange={handleChange}
//                                             label="Unit"
//                                         >
//                                             <MenuItem value="">Select</MenuItem>
//                                             <MenuItem value="gram">Gram</MenuItem>
//                                             <MenuItem value="kilo">Kilo</MenuItem>
//                                             <MenuItem value="ton">Ton</MenuItem>
//                                         </Select>
//                                         <FormHelperText>
//                                             {touched.weightUnit && errors.weightUnit}
//                                         </FormHelperText>
//                                     </FormControl>
//                                 </Grid>

//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="Length"
//                                         name="length"
//                                         value={values.length}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.length && errors.length)}
//                                         helperText={touched.length && errors.length}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="Width"
//                                         name="width"
//                                         value={values.width}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.width && errors.width)}
//                                         helperText={touched.width && errors.width}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="Volume"
//                                         name="volume"
//                                         value={values.volume}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.volume && errors.volume)}
//                                         helperText={touched.volume && errors.volume}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>

//                                 {/* Sender Details */}
//                                 <Grid item xs={12}>
//                                     <Typography variant="h6" className={styles.sectionHeading}>Sender Details</Typography>
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="Name"
//                                         name="senderName"
//                                         value={values.senderName}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.senderName && errors.senderName)}
//                                         helperText={touched.senderName && errors.senderName}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="Address"
//                                         name="senderAddress"
//                                         value={values.senderAddress}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.senderAddress && errors.senderAddress)}
//                                         helperText={touched.senderAddress && errors.senderAddress}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="Pincode"
//                                         name="senderPincode"
//                                         value={values.senderPincode}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.senderPincode && errors.senderPincode)}
//                                         helperText={touched.senderPincode && errors.senderPincode}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="State"
//                                         name="senderState"
//                                         value={values.senderState}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.senderState && errors.senderState)}
//                                         helperText={touched.senderState && errors.senderState}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="Country"
//                                         name="senderCountry"
//                                         value={values.senderCountry}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.senderCountry && errors.senderCountry)}
//                                         helperText={touched.senderCountry && errors.senderCountry}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="Phone"
//                                         name="senderPhone"
//                                         value={values.senderPhone}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.senderPhone && errors.senderPhone)}
//                                         helperText={touched.senderPhone && errors.senderPhone}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>

//                                 {/* Receiver Details */}
//                                 <Grid item xs={12}>
//                                     <Typography variant="h6" className={styles.sectionHeading}>Receiver Details</Typography>
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="Name"
//                                         name="receiverName"
//                                         value={values.receiverName}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.receiverName && errors.receiverName)}
//                                         helperText={touched.receiverName && errors.receiverName}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="Address"
//                                         name="receiverAddress"
//                                         value={values.receiverAddress}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.receiverAddress && errors.receiverAddress)}
//                                         helperText={touched.receiverAddress && errors.receiverAddress}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="Pincode"
//                                         name="receiverPincode"
//                                         value={values.receiverPincode}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.receiverPincode && errors.receiverPincode)}
//                                         helperText={touched.receiverPincode && errors.receiverPincode}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="State"
//                                         name="receiverState"
//                                         value={values.receiverState}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.receiverState && errors.receiverState)}
//                                         helperText={touched.receiverState && errors.receiverState}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="Country"
//                                         name="receiverCountry"
//                                         value={values.receiverCountry}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.receiverCountry && errors.receiverCountry)}
//                                         helperText={touched.receiverCountry && errors.receiverCountry}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={6} md={3}>
//                                     <TextField
//                                         label="Phone"
//                                         name="receiverPhone"
//                                         value={values.receiverPhone}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         error={Boolean(touched.receiverPhone && errors.receiverPhone)}
//                                         helperText={touched.receiverPhone && errors.receiverPhone}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 height: '50px',
//                                                 borderRadius: '8px',
//                                                 width: '100%'
//                                             },
//                                         }}
//                                     />
//                                 </Grid>

//                                 {/* Submit Button */}
//                                 <Grid item xs={12}>
//                                     <div className={styles.buttonContainer}>
//                                         <button className={styles.submitButton}>Submit</button>
//                                     </div>
//                                 </Grid>
//                             </Grid>
//                         </form>
//                     )}
//                 </Formik>
//             </CardContent>
//         </div>
//     );
// };

// export default CreatePackage;

'use client';
import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Stepper, Step, StepLabel, Button, Grid } from '@mui/material';
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

    const initialValues = {
        shipFrom: {},
        shipTo: {},
        packageDetails: {},
        billTo: {},
        additionalInfo: {},
        pickupDropoff: {},
        taxInfo: {},
    };

    const validationSchema = Yup.object().shape({});

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = (values: any) => {
        console.log('Final Form Data:', values);
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values }) => (
                <Form>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Grid container spacing={2} className={styles.formContainer}>
                        {activeStep === 0 && <ShipFrom />}
                        {activeStep === 1 && <ShipTo />}
                        {activeStep === 2 && <PackageDetails />}
                        {activeStep === 3 && <BillTo />}
                        {activeStep === 4 && <AdditionalInformation />}
                        {activeStep === 5 && <PickupDropoff />}
                        {activeStep === 6 && <TaxInfo />}
                    </Grid>

                    <Grid container justifyContent="space-between" className={styles.buttonContainer}>
                        <Button disabled={activeStep === 0} onClick={handleBack}>
                            Back
                        </Button>
                        {activeStep === steps.length - 1 ? (
                            <Button type="submit">Create Package</Button>
                        ) : (
                            <Button onClick={handleNext}>Next</Button>
                        )}
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default CreatePackage;
