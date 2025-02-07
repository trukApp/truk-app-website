import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Grid, TextField, Checkbox, FormControlLabel, Button } from '@mui/material';
import * as Yup from 'yup';
import styles from './CreatePackage.module.css';
import { useAppDispatch, useAppSelector } from '@/store';
import { IShipTo, setPackageShipTo } from '@/store/authSlice';

interface ShipToProps {
    onNext: (values: IShipTo) => void;
    onBack: () => void;
}

const validationSchema = Yup.object({
    shipFrom: Yup.object({
        locationId: Yup.string().required('Location ID is required'),
        locationDescription: Yup.string().required('Location Description is required'),
        contactPerson: Yup.string().required('Contact Person is required'),
        phoneNumber: Yup.string().required('Phone Number is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        addressLine1: Yup.string().required('Address Line 1 is required'),
        addressLine2: Yup.string(),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        country: Yup.string().required('Country is required'),
        pincode: Yup.string().required('Pincode is required'),
    })
});

const ShipFrom: React.FC<ShipToProps> = ({ onNext, onBack }) => {
    const dispatch = useAppDispatch()
    const shipToReduxValues = useAppSelector((state) => state.auth.packageShipTo)
    console.log("shipFromReduxValues: ", shipToReduxValues)
    return (
        <Formik
            initialValues={{
                shipFrom: shipToReduxValues ? shipToReduxValues :
                    {
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
                        saveAsNewLocationId: false,
                        saveAsDefaultShipFromLocation: false,
                    }
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                dispatch(setPackageShipTo(values?.shipFrom))
                onNext(values.shipFrom);
            }}
        >
            {({ errors, touched, handleSubmit }) => (
                <Form>
                    <Grid container spacing={2} className={styles.formsBgContainer}>
                        <h3 className={styles.mainHeading}>Location Details</h3>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.locationId"
                                    as={TextField}
                                    label="Location ID"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.locationId && Boolean(errors.shipFrom?.locationId)}
                                    helperText={touched.shipFrom?.locationId && errors.shipFrom?.locationId}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.locationDescription"
                                    as={TextField}
                                    label="Location Description"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.locationDescription && Boolean(errors.shipFrom?.locationDescription)}
                                    helperText={touched.shipFrom?.locationDescription && errors.shipFrom?.locationDescription}
                                />
                            </Grid>
                        </Grid>

                        <h3 className={styles.mainHeading}>Contact Information</h3>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.contactPerson"
                                    as={TextField}
                                    label="Contact Person"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.contactPerson && Boolean(errors.shipFrom?.contactPerson)}
                                    helperText={touched.shipFrom?.contactPerson && errors.shipFrom?.contactPerson}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.phoneNumber"
                                    as={TextField}
                                    label="Phone Number"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.phoneNumber && Boolean(errors.shipFrom?.phoneNumber)}
                                    helperText={touched.shipFrom?.phoneNumber && errors.shipFrom?.phoneNumber}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.email"
                                    as={TextField}
                                    label="Email Address"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.email && Boolean(errors.shipFrom?.email)}
                                    helperText={touched.shipFrom?.email && errors.shipFrom?.email}
                                />
                            </Grid>
                        </Grid>

                        <h3 className={styles.mainHeading}>Address Information</h3>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.addressLine1"
                                    as={TextField}
                                    label="Address Line 1"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.addressLine1 && Boolean(errors.shipFrom?.addressLine1)}
                                    helperText={touched.shipFrom?.addressLine1 && errors.shipFrom?.addressLine1}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.addressLine2"
                                    as={TextField}
                                    label="Address Line 2"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.city"
                                    as={TextField}
                                    label="City"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.city && Boolean(errors.shipFrom?.city)}
                                    helperText={touched.shipFrom?.city && errors.shipFrom?.city}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.state"
                                    as={TextField}
                                    label="State"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.state && Boolean(errors.shipFrom?.state)}
                                    helperText={touched.shipFrom?.state && errors.shipFrom?.state}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.country"
                                    as={TextField}
                                    label="Country"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.country && Boolean(errors.shipFrom?.country)}
                                    helperText={touched.shipFrom?.country && errors.shipFrom?.country}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.pincode"
                                    as={TextField}
                                    label="Pincode"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.pincode && Boolean(errors.shipFrom?.pincode)}
                                    helperText={touched.shipFrom?.pincode && errors.shipFrom?.pincode}
                                />
                            </Grid>
                        </Grid>

                        <h3 className={styles.mainHeading}>Save Options</h3>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={2.4}>
                                <FormControlLabel
                                    control={<Field name="shipFrom.saveAsNewLocationId" type="checkbox" as={Checkbox} />}
                                    label="Save as new Location ID"
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <FormControlLabel
                                    control={<Field name="shipFrom.saveAsDefaultShipFromLocation" type="checkbox" as={Checkbox} />}
                                    label="Save as default Ship From Location"
                                />
                            </Grid>
                        </Grid>

                        {/* Back & Next Buttons */}
                        <Grid container spacing={2} justifyContent="space-between" marginTop={2}>
                            <Grid item>
                                <Button variant="outlined" onClick={onBack}>
                                    Back
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    // disabled={!isValid || !dirty}
                                    onClick={() => handleSubmit()}
                                >
                                    Next
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default ShipFrom;
