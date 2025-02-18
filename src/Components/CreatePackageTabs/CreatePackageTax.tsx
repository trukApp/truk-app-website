'use client';
import React  from 'react';
import { Formik, Form, Field, FormikHelpers, } from 'formik';
import { Grid, TextField,  Typography, } from '@mui/material';
import * as Yup from 'yup';
import {useAppDispatch,   useAppSelector } from '@/store';
import { setPackageTax } from '@/store/authSlice';
import { CustomButtonFilled, CustomButtonOutlined } from '../ReusableComponents/ButtonsComponent';

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
    taxInfo: Yup.object().shape({
        senderGSTN: Yup.string().required('GSTN of the Sender is required'),
        receiverGSTN: Yup.string().required('GSTN of the Receiver is required'),
        carrierGSTN: Yup.string().required('GSTN of the Carrier is required'),
        taxRate: Yup.string().required('Tax rate is required'),
        isSelfTransport: Yup.string()
            .oneOf(['Yes', 'No'], 'Must be Yes or No')
            .required('Self Transport is required'),
    }),
    
    
});

const TaxInfo: React.FC<TaxInfoProps> = ({ onSubmit, onBack }) => {
    const dispatch = useAppDispatch()
    const packageTaxFromRedux = useAppSelector((state) => state.auth.packageTax)
    const initialValues: TaxInfoValues = {
        taxInfo: packageTaxFromRedux ? packageTaxFromRedux : {
            senderGSTN: '',
            receiverGSTN: '',
            carrierGSTN: '',
            isSelfTransport: '',
            taxRate:'',
        },
    };

      const handleSubmit = async (values: TaxInfoValues, actions: FormikHelpers<TaxInfoValues>, onSubmit: (values: TaxInfoValues) => void) => {
        dispatch(setPackageTax(values.taxInfo))
        // dispatch(setCompletedState(5));
        actions.setSubmitting(false);
        onSubmit(values);
     
    };

    return (
        <>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleSubmit(values, actions, onSubmit)}
        >
            {({ touched, errors }) => (
                    <Form style={{ width: '100%' }}>
                        <Typography variant="h6" sx={{fontWeight:'bold', textAlign:'center' , marginTop:3}}>Tax info</Typography>
                    <Grid container spacing={2} sx={{marginTop:3}}>
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
                            <Field
                                as={TextField}
                                name="taxInfo.isSelfTransport"
                                label="Self Transport (Yes/No)"
                                fullWidth size='small'
                                error={touched.taxInfo?.isSelfTransport && Boolean(errors.taxInfo?.isSelfTransport)}
                                helperText={touched.taxInfo?.isSelfTransport && errors.taxInfo?.isSelfTransport}
                            />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                            <Field
                                as={TextField}
                                name="taxInfo.taxRate"
                                label="Tax rate"
                                fullWidth size='small'
                                error={touched.taxInfo?.taxRate && Boolean(errors.taxInfo?.taxRate)}
                                helperText={touched.taxInfo?.taxRate && errors.taxInfo?.taxRate}
                            />
                        </Grid>

                            {/* Navigation Buttons */}
                            <Grid container spacing={2} justifyContent="center" marginTop={2}>
                                <Grid item>
                                    {/* <Button variant="outlined" onClick={onBack}>
                                        Back
                                    </Button> */}
                                    <CustomButtonOutlined onClick={onBack}>Back</CustomButtonOutlined>
                                </Grid>
                                <Grid item>
                                    {/* <Button type="submit" variant="contained" color="primary">
                                        Submit
                                    </Button> */}
                                <CustomButtonFilled >Submit</CustomButtonFilled>
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
