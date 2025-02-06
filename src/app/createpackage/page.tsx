'use client';
import React, { useState } from 'react';
import { Formik, Form, FormikErrors, FormikHelpers } from 'formik';
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

interface FormValues {
    shipFrom: {
        locationId: string;
        locationDescription: string;
        contactPerson: string;
        phoneNumber: string;
        email: string;
        addressLine1: string;
        addressLine2: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
    shipTo: { [key: string]: string };
    packageDetails: { [key: string]: string };
    billTo: { [key: string]: string };
    additionalInfo: { [key: string]: string | boolean };
    pickupDropoff: { [key: string]: string };
    taxInfo: { [key: string]: string };
}


const validationSchemas = [
    Yup.object({
        shipFrom: Yup.object({
            locationId: Yup.string().required('Location ID is required'),
            locationDescription: Yup.string().required('Location Description is required'),
            contactPerson: Yup.string().required('Contact Person is required'),
            phoneNumber: Yup.string().required('Phone Number is required'),
            email: Yup.string().email('Invalid email').required('Email Address is required'),
            addressLine1: Yup.string().required('Address Line 1 is required'),
            addressLine2: Yup.string().required('Address Line 2 is required'),
            city: Yup.string().required('City is required'),
            state: Yup.string().required('State is required'),
            country: Yup.string().required('Country is required'),
            pincode: Yup.string().required('Pincode is required'),
        })
    }),
    Yup.object({
        shipTo: Yup.object({
            locationId: Yup.string().required('Required'),
            locationDescription: Yup.string().required('Required'),
            contactPerson: Yup.string().required('Required'),
            phoneNumber: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
            addressLine1: Yup.string().required('Required'),
            addressLine2: Yup.string().required('Required'),
            city: Yup.string().required('Required'),
            state: Yup.string().required('Required'),
            country: Yup.string().required('Required'),
            pincode: Yup.string().required('Required'),
        })
    }),
    Yup.object({
        packageDetails: Yup.object({
            weight: Yup.string().required('Required'),
            dimensions: Yup.string().required('Required'),
            description: Yup.string().required('Required'),
        })
    }),
    Yup.object({
        billTo: Yup.object({
            accountNumber: Yup.string().required('Required'),
            name: Yup.string().required('Required'),
            address: Yup.string().required('Required'),
        })
    }),
    Yup.object({
        additionalInfo: Yup.object({
            notes: Yup.string().required('Required'),
            insurance: Yup.boolean().required('Required'),
        })
    }),
    Yup.object({
        pickupDropoff: Yup.object({
            pickupLocation: Yup.string().required('Required'),
            dropoffLocation: Yup.string().required('Required'),
        })
    }),
    Yup.object({
        taxInfo: Yup.object({
            taxId: Yup.string().required('Required'),
            taxRate: Yup.string().required('Required'),
        })
    })
];

const CreatePackage = () => {
    const [activeStep, setActiveStep] = useState(0);

    const initialValues: FormValues = {
        shipFrom: {
            locationId: '',
            locationDescription: '',
            contactPerson: '',
            phoneNumber: '',
            email: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
        },
        shipTo: {},
        packageDetails: {},
        billTo: {},
        additionalInfo: {},
        pickupDropoff: {},
        taxInfo: {},
    };




    // const handleNext = async (
    //     validateForm: (values: FormValues) => Promise<FormikErrors<FormValues>>,
    //     values: FormValues
    // ) => {
    //     const errors = await validateForm(values);

    //     if (Object.keys(errors).length === 0) {
    //         setActiveStep((prevStep) => prevStep + 1);
    //     }
    // };


    const handleNext = async (
        validateForm: (values: FormValues) => Promise<FormikErrors<FormValues>>,
        values: FormValues,
        setTouched: FormikHelpers<FormValues>['setTouched']
    ) => {
        // Mark all fields as touched to trigger validation errors
        setTouched({
            shipFrom: {
                locationId: true,
                locationDescription: true,
                contactPerson: true,
                phoneNumber: true,
                email: true,
                addressLine1: true,
                addressLine2: true,
                city: true,
                state: true,
                country: true,
                pincode: true
            }
        });

        const errors = await validateForm(values);

        if (Object.keys(errors).length === 0) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };



    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = (values: FormValues) => {
        console.log('Final Form Data:', values);
    };

    return (
        // <Formik
        //     initialValues={initialValues}
        //     validationSchema={validationSchemas[activeStep]}
        //     onSubmit={handleSubmit}
        // >
        //     {({ isValid, validateForm, errors, setTouched }) => (
        //         <Form>
        //             <Stepper activeStep={activeStep} alternativeLabel>
        //                 {steps.map((label, index) => (
        //                     <Step key={index}>
        //                         <StepLabel>{label}</StepLabel>
        //                     </Step>
        //                 ))}
        //             </Stepper>

        //             <Grid container spacing={2} className={styles.formContainer}>
        //                 {activeStep === 0 && <ShipFrom />}
        //                 {activeStep === 1 && <ShipTo />}
        //                 {activeStep === 2 && <PackageDetails />}
        //                 {activeStep === 3 && <BillTo />}
        //                 {activeStep === 4 && <AdditionalInformation />}
        //                 {activeStep === 5 && <PickupDropoff />}
        //                 {activeStep === 6 && <TaxInfo />}
        //             </Grid>

        //             <div className={styles.buttonsContainer}>
        //                 <Button
        //                     variant="outlined"
        //                     color="primary"
        //                     disabled={activeStep === 0}
        //                     onClick={handleBack}
        //                     style={{ marginRight: '20px' }}
        //                 >
        //                     Back
        //                 </Button>
        //                 {activeStep === steps.length - 1 ? (
        //                     <Button type="submit">Create Package</Button>
        //                 ) : (
        //                     <Button
        //                         onClick={() => handleNext(validateForm, errors, setTouched)}
        //                         variant="contained"
        //                         color="primary"
        //                     >
        //                         Next
        //                     </Button>
        //                 )}
        //             </div>
        //         </Form>
        //     )}
        // </Formik>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[activeStep]}
            onSubmit={handleSubmit}
        >
            {({ validateForm, values, setTouched }) => (
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

                    <div className={styles.buttonsContainer}>
                        <Button
                            variant='outlined'
                            color='primary'
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            style={{ marginRight: '20px' }}
                        >
                            Back
                        </Button>
                        {activeStep === steps.length - 1 ? (
                            <Button type='submit'>Create Package</Button>
                        ) : (
                            <Button
                                // onClick={() => handleNext(validateForm, values)}
                                onClick={() => handleNext(validateForm, values, setTouched)}
                                variant='contained'
                                color='primary'
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </Form>
            )}
        </Formik>

    );
};

export default CreatePackage;
