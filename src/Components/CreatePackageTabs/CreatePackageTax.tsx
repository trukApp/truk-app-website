'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Grid, TextField, Button, Backdrop, CircularProgress } from '@mui/material';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPackageAddtionalInfo, setPackageBillTo, setPackagePickAndDropTimings, setPackageShipFrom, setPackageShipTo, setPackageTax, setSelectedPackages } from '@/store/authSlice';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { useCreatePackageForOrderMutation } from '@/api/apiSlice';

interface TaxInfoValues {
    taxInfo: {
        senderGSTN: string;
        receiverGSTN: string;
        carrierGSTN: string;
        isSelfTransport: string;
    };
}

interface TaxInfoProps {
    onSubmit: (values: TaxInfoValues) => void;
    onBack: () => void;
}


// Validation Schema
const validationSchema = Yup.object().shape({
    taxInfo: Yup.object().shape({
        senderGSTN: Yup.string().required('GSTN of the Sender is required'),
        receiverGSTN: Yup.string().required('GSTN of the Receiver is required'),
        carrierGSTN: Yup.string().required('GSTN of the Carrier is required'),
        isSelfTransport: Yup.string()
            .oneOf(['Yes', 'No'], 'Must be Yes or No')
            .required('Self Transport is required'),
    }),
});

const TaxInfo: React.FC<TaxInfoProps> = ({ onSubmit, onBack }) => {
        const [snackbarOpen, setSnackbarOpen] = useState(false);
        const [snackbarMessage, setSnackbarMessage] = useState("");
        const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const dispatch = useAppDispatch()
    const packageTaxFromRedux = useAppSelector((state) => state.auth.packageTax)
    console.log("packageTaxFromRedux: ", packageTaxFromRedux)
    const packageAddtionalInfoFromRedux = useAppSelector((state) => state.auth.packageAdditionalInfo);
    const billToReduxValues = useAppSelector((state) => state.auth.packageBillTo);
    const shipFromReduxValues = useAppSelector((state) => state.auth.packageShipFrom);
    const shipToReduxValues = useAppSelector((state) => state.auth.packageShipTo);
    const productListFromRedux = useAppSelector((state) => state.auth.packagesDetails);
    const packagePickUpAndDropTimingsFromRedux = useAppSelector((state) => state.auth.packagePickAndDropTimings);
    const [createPackageOrder , {isLoading:isPackageCreating}] = useCreatePackageForOrderMutation()
    
    console.log('hello all :',shipFromReduxValues,shipToReduxValues,productListFromRedux,billToReduxValues,packageAddtionalInfoFromRedux,packagePickUpAndDropTimingsFromRedux)
    const initialValues: TaxInfoValues = {
        taxInfo: packageTaxFromRedux ? packageTaxFromRedux : {
            senderGSTN: '',
            receiverGSTN: '',
            carrierGSTN: '',
            isSelfTransport: '',
        },
    };

    const handleSubmit = async (values: TaxInfoValues, actions: FormikHelpers<TaxInfoValues>, onSubmit: (values: TaxInfoValues) => void) => {
        console.log('Tax Info Submitted:', values);
        dispatch(setPackageTax(values.taxInfo))
        actions.setSubmitting(false);
        onSubmit(values);
            try {
                const createPackageBody = {
                        packages: [
                                {
                                ship_from: shipFromReduxValues?.locationId,
                                ship_to: shipToReduxValues?.locationId,
                                product_ID: productListFromRedux.map((product) => ({
                                    prod_ID: product.productId,
                                    quantity: product.quantity,
                                })),
                                package_info: productListFromRedux[0]?.packagingType ,
                                bill_to: billToReduxValues?.locationId,
                                return_label: 1,
                                additional_info: {
                                    reference_id: packageAddtionalInfoFromRedux?.referenceId,
                                    invoice: packageAddtionalInfoFromRedux?.invoiceNumber,
                                },
                                pickup_date_time: packagePickUpAndDropTimingsFromRedux?.pickupDateTime,
                                dropoff_date_time: packagePickUpAndDropTimingsFromRedux?.dropoffDateTime,
                                tax_info: {
                                    tax_rate: values.taxInfo.receiverGSTN,
                                },
                                },
],

                }
            console.log("I am going to create a record")
            console.log("createPackageBody: ", createPackageBody)
            const response = await createPackageOrder(createPackageBody).unwrap();
            console.log('API Response:', response)
            dispatch(setPackageShipFrom(null));
            dispatch(setPackageShipTo(null));
                dispatch(setPackageBillTo(null));
                dispatch(setPackageTax(null))
                dispatch(setPackageAddtionalInfo(null));
                dispatch(setSelectedPackages([]))
                dispatch(setPackagePickAndDropTimings(null))
                if (response?.created_records) {
                    setSnackbarMessage(`Package ID ${response.created_records[0]} created successfully!`);
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                  }
        }
        catch (error) {
            console.log("err :", error)
            setSnackbarMessage("Something went wrong! please try again.");
            setSnackbarSeverity("error");
			setSnackbarOpen(true);
        }
    };
    return (
        <>
            <Backdrop
                sx={{
                    color: "#ffffff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isPackageCreating }
            >
                <CircularProgress color="inherit" />
            </Backdrop>
             <SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleSubmit(values, actions, onSubmit)}
        >
            {({ touched, errors }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Field
                                as={TextField}
                                name="taxInfo.senderGSTN"
                                label="GSTN of the Sender"
                                fullWidth
                                error={touched.taxInfo?.senderGSTN && Boolean(errors.taxInfo?.senderGSTN)}
                                helperText={touched.taxInfo?.senderGSTN && errors.taxInfo?.senderGSTN}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Field
                                as={TextField}
                                name="taxInfo.receiverGSTN"
                                label="GSTN of the Receiver"
                                fullWidth 
                                error={touched.taxInfo?.receiverGSTN && Boolean(errors.taxInfo?.receiverGSTN)}
                                helperText={touched.taxInfo?.receiverGSTN && errors.taxInfo?.receiverGSTN}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Field
                                as={TextField}
                                name="taxInfo.carrierGSTN"
                                label="GSTN of the Carrier"
                                fullWidth
                                error={touched.taxInfo?.carrierGSTN && Boolean(errors.taxInfo?.carrierGSTN)}
                                helperText={touched.taxInfo?.carrierGSTN && errors.taxInfo?.carrierGSTN}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Field
                                as={TextField}
                                name="taxInfo.isSelfTransport"
                                label="Self Transport (Yes/No)"
                                fullWidth
                                error={touched.taxInfo?.isSelfTransport && Boolean(errors.taxInfo?.isSelfTransport)}
                                helperText={touched.taxInfo?.isSelfTransport && errors.taxInfo?.isSelfTransport}
                            />
                        </Grid>

                        {/* Navigation Buttons */}
                        <Grid container spacing={2} justifyContent="center" marginTop={2}>
                            <Grid item>
                                <Button variant="outlined" onClick={onBack}>
                                    Back
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Form>
            )}
            </Formik>
            </>
    );
};

export default TaxInfo;
