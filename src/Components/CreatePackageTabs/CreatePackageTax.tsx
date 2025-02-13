'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Grid, TextField, Button, Backdrop, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Typography, } from '@mui/material';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCompletedState, resetCompletedSteps, setPackageAddtionalInfo, setPackageBillTo, setPackagePickAndDropTimings, setPackageShipFrom, setPackageShipTo, setPackageTax, setProductsList } from '@/store/authSlice';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { useCreatePackageForOrderMutation } from '@/api/apiSlice';
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const [modalOpen, setModalOpen] = useState(false);
    const dispatch = useAppDispatch()
    const packageTaxFromRedux = useAppSelector((state) => state.auth.packageTax)
    const packageAddtionalInfoFromRedux = useAppSelector((state) => state.auth.packageAdditionalInfo);
    const billToReduxValues = useAppSelector((state) => state.auth.packageBillTo);
    const shipFromReduxValues = useAppSelector((state) => state.auth.packageShipFrom);
    const shipToReduxValues = useAppSelector((state) => state.auth.packageShipTo);
    const productListFromRedux = useAppSelector((state) => state.auth.packagesDetails);
    const packagePickUpAndDropTimingsFromRedux = useAppSelector((state) => state.auth.packagePickAndDropTimings);
    const [createPackageOrder, { isLoading: isPackageCreating }] = useCreatePackageForOrderMutation()
    const initialValues: TaxInfoValues = {
        taxInfo: packageTaxFromRedux ? packageTaxFromRedux : {
            senderGSTN: '',
            receiverGSTN: '',
            carrierGSTN: '',
            isSelfTransport: '',
        },
    };

    const handleSubmit = async (values: TaxInfoValues, actions: FormikHelpers<TaxInfoValues>, onSubmit: (values: TaxInfoValues) => void) => {
        dispatch(setPackageTax(values.taxInfo))
        dispatch(setCompletedState(6));
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
                        package_info: productListFromRedux[0]?.packagingType,
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
            const response = await createPackageOrder(createPackageBody).unwrap();
            if (response?.created_records) {
                setModalOpen(true)
                setSnackbarMessage(`Package ID ${response.created_records[0]} created successfully!`);
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                dispatch(setPackageShipFrom(null));
                dispatch(setPackageShipTo(null));
                dispatch(setPackageBillTo(null));
                dispatch(setPackageTax(null))
                dispatch(setPackageAddtionalInfo(null));
                dispatch(setProductsList([]));
                dispatch(setPackagePickAndDropTimings(null))
                dispatch(setCompletedState(0))
                dispatch(resetCompletedSteps())
            }
        }
        catch (error) {
            console.log("err :", error)
            setSnackbarMessage("Something went wrong! please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };
    const handleCreateAnother = () => {
        setModalOpen(false);
        dispatch(setPackageShipFrom(null));
        dispatch(setPackageShipTo(null));
        dispatch(setPackageBillTo(null));
        dispatch(setPackageTax(null))
        dispatch(setPackageAddtionalInfo(null));
        dispatch(setProductsList([]));
        dispatch(setPackagePickAndDropTimings(null))
        dispatch(setCompletedState(0))
        dispatch(resetCompletedSteps())
    };

    const handleGoToOrder = () => {
        setModalOpen(false);
        router.push("/createorder");
    };


    return (
        <>
            <Backdrop
                sx={{
                    color: "#ffffff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isPackageCreating}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
            {modalOpen && (
                <Dialog open={modalOpen} onClose={() => setModalOpen(false)} >
                    <DialogTitle>Package Created Successfully</DialogTitle>
                    <DialogContent>
                        <Typography>Your package has been created successfully. What would you like to do next?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={handleCreateAnother} color="primary">
                            Create Another Package
                        </Button>
                        <Button variant="outlined" onClick={handleGoToOrder} color="secondary">
                            Go to Create Order
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleSubmit(values, actions, onSubmit)}
        >
            {({ touched, errors }) => (
                    <Form style={{ width: '100%' }}>
                        <Typography variant="h6" sx={{fontWeight:'bold', textAlign:'center' , marginTop:3}}>Tax info</Typography>
                    <Grid container spacing={2} sx={{marginTop:3}}>
                        <Grid item xs={12} md={3}>
                            <Field
                                as={TextField}
                                name="taxInfo.senderGSTN"
                                label="GSTN of the Sender"
                                fullWidth size='small'
                                error={touched.taxInfo?.senderGSTN && Boolean(errors.taxInfo?.senderGSTN)}
                                helperText={touched.taxInfo?.senderGSTN && errors.taxInfo?.senderGSTN}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Field
                                as={TextField}
                                name="taxInfo.receiverGSTN"
                                label="GSTN of the Receiver"
                                fullWidth size='small' 
                                error={touched.taxInfo?.receiverGSTN && Boolean(errors.taxInfo?.receiverGSTN)}
                                helperText={touched.taxInfo?.receiverGSTN && errors.taxInfo?.receiverGSTN}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Field
                                as={TextField}
                                name="taxInfo.carrierGSTN"
                                label="GSTN of the Carrier"
                                fullWidth size='small'
                                error={touched.taxInfo?.carrierGSTN && Boolean(errors.taxInfo?.carrierGSTN)}
                                helperText={touched.taxInfo?.carrierGSTN && errors.taxInfo?.carrierGSTN}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Field
                                as={TextField}
                                name="taxInfo.isSelfTransport"
                                label="Self Transport (Yes/No)"
                                fullWidth size='small'
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
