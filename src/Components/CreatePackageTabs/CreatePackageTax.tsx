'use client';
import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Grid, TextField, Typography, } from '@mui/material';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPackageTax } from '@/store/authSlice';
import { CustomButtonFilled, CustomButtonOutlined } from '../ReusableComponents/ButtonsComponent';
import styles from './CreatePackage.module.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Select, MenuItem, FormHelperText, FormControl, InputLabel } from '@mui/material';
interface TaxInfoValues {
    taxInfo: {
        senderGSTN: string;
        receiverGSTN: string;
        carrierGSTN: string;
        isSelfTransport: string;
        taxRate: string;
    };
}

interface TaxInfoProps {
    onSubmit: (values: TaxInfoValues) => void;
    onBack: () => void;
}


// Validation Schema
const validationSchema = Yup.object().shape({
    // taxInfo: Yup.object().shape({
    //     senderGSTN: Yup.string().required('GSTN of the Sender is required'),
    //     receiverGSTN: Yup.string().required('GSTN of the Receiver is required'),
    //     carrierGSTN: Yup.string().required('GSTN of the Carrier is required'),
    //     taxRate: Yup.string().required('Tax rate is required'),
    //     isSelfTransport: Yup.string()
    //         .oneOf(['Yes', 'No'], 'Must be Yes or No')
    //         .required('Self Transport is required'),
    // }),
});

const TaxInfo: React.FC<TaxInfoProps> = ({ onSubmit, onBack }) => {
    const dispatch = useAppDispatch()
    const packageTaxFromRedux = useAppSelector((state) => state.auth.packageTax)
    const [openConfirm, setOpenConfirm] = useState(false);
    const [formValues, setFormValues] = useState<TaxInfoValues | null>(null);

    const initialValues: TaxInfoValues = {
        taxInfo: packageTaxFromRedux || {
            senderGSTN: '',
            receiverGSTN: '',
            carrierGSTN: '',
            isSelfTransport: '',
            taxRate: '',
        },
    };



    const handleCreatePackageClick = (values: TaxInfoValues) => {
        dispatch(setPackageTax(values.taxInfo));
        setFormValues(values);
        setOpenConfirm(true);
    };

    const handleFinalSubmit = () => {
        if (formValues) {
            onSubmit(formValues);
            setOpenConfirm(false);
        }
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => handleCreatePackageClick(values)}
            >
                {({ touched, errors }) => (
                    <Form style={{ width: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: 3 }}>Tax info</Typography>
                        <Grid container className={styles.formsBgContainer} spacing={2}>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="taxInfo.senderGSTN"
                                    label="GSTN of the Sender"
                                    fullWidth size='small'
                                    error={touched.taxInfo?.senderGSTN && Boolean(errors.taxInfo?.senderGSTN)}
                                    helperText={touched.taxInfo?.senderGSTN && errors.taxInfo?.senderGSTN}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="taxInfo.receiverGSTN"
                                    label="GSTN of the Receiver"
                                    fullWidth size='small'
                                    error={touched.taxInfo?.receiverGSTN && Boolean(errors.taxInfo?.receiverGSTN)}
                                    helperText={touched.taxInfo?.receiverGSTN && errors.taxInfo?.receiverGSTN}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="taxInfo.carrierGSTN"
                                    label="GSTN of the Carrier"
                                    fullWidth size='small'
                                    error={touched.taxInfo?.carrierGSTN && Boolean(errors.taxInfo?.carrierGSTN)}
                                    helperText={touched.taxInfo?.carrierGSTN && errors.taxInfo?.carrierGSTN}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <FormControl fullWidth size="small" error={touched.taxInfo?.isSelfTransport && Boolean(errors.taxInfo?.isSelfTransport)}>
                                    <InputLabel>Self Transport</InputLabel>
                                    <Field as={Select} name="taxInfo.isSelfTransport" label="Self Transport">
                                        <MenuItem value="Yes">Yes</MenuItem>
                                        <MenuItem value="No">No</MenuItem>
                                    </Field>
                                    {touched.taxInfo?.isSelfTransport && errors.taxInfo?.isSelfTransport && (
                                        <FormHelperText>{errors.taxInfo.isSelfTransport}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="taxInfo.taxRate"
                                    label="Tax rate" type='number'
                                    fullWidth size='small'
                                />
                            </Grid>

                            {/* Navigation Buttons */}
                            <Grid container spacing={2} justifyContent="center" marginTop={2}>
                                <Grid item>
                                    <CustomButtonOutlined onClick={onBack}>Back</CustomButtonOutlined>
                                </Grid>
                                <Grid item>
                                    <CustomButtonFilled type="submit">Create Package</CustomButtonFilled>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>

            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogContent>
                    Are you sure you want to create the package ?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleFinalSubmit} color="primary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>


        </>
    );
};

export default TaxInfo;
