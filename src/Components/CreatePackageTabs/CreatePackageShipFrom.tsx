'use client';
import React from 'react';
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Checkbox, FormControlLabel, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Tooltip, FormHelperText, SelectChangeEvent } from '@mui/material';
import styles from './CreatePackage.module.css';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPackageShipFrom } from '@/store/authSlice';
import { IShipFrom } from '@/store/authSlice';
import { useGetLocationMasterQuery } from '@/api/apiSlice';
import { Location } from '../MasterDataComponents/Locations';

interface ShipFromProps {
    onNext: (values: IShipFrom) => void;
    // onBack: () => void;
}



const ShipFrom: React.FC<ShipFromProps> = ({ onNext }) => {
    const dispatch = useAppDispatch()
    const shipFromReduxValues = useAppSelector((state) => state.auth.packageShipFrom)
    console.log("shipFromReduxValues: ", shipFromReduxValues)

    const { data: locationsData, error: getLocationsError } = useGetLocationMasterQuery([])
    const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    console.log("all locations :", getAllLocations)

    console.log("getLocationsError: ", getLocationsError)

    const validationSchema = Yup.object({
        shipFrom: Yup.object({
            locationId: Yup.string().required('Location ID is required'),
            locationDescription: Yup.string().required('Location Description is required'),
            contactPerson: Yup.string().required('Contact Person is required'),
            phoneNumber: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required('Phone Number is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            // addressLine1: Yup.string().required('Address Line 1 is required'),
            city: Yup.string().required('City is required'),
            state: Yup.string().required('State is required'),
            country: Yup.string().required('Country is required'),
            pincode: Yup.string().matches(/^\d{6}$/, 'Invalid pincode').required('Pincode is required'),
            saveAsNewLocationId: Yup.boolean(),
            saveAsDefaultShipFromLocation: Yup.boolean(),
        })
    });


    const handleLocationChange = (
        event: SelectChangeEvent<string>,
        setFieldValue: FormikProps<{ shipFrom: IShipFrom }>['setFieldValue']
    ) => {
        const selectedLocationId = event.target.value;
        setFieldValue('shipFrom.locationId', selectedLocationId);

        const selectedLocation = getAllLocations.find((loc: Location) => loc.loc_ID === selectedLocationId);

        if (selectedLocation) {
            setFieldValue('shipFrom.locationDescription', selectedLocation.loc_desc || '');
            setFieldValue('shipFrom.addressLine1', selectedLocation.address_1 || '');
            setFieldValue('shipFrom.addressLine2', selectedLocation.address_2 || '');
            setFieldValue('shipFrom.city', selectedLocation.city || '');
            setFieldValue('shipFrom.state', selectedLocation.state || '');
            setFieldValue('shipFrom.country', selectedLocation.country || '');
            setFieldValue('shipFrom.pincode', selectedLocation.pincode || '');
        } else {
            setFieldValue('shipFrom.locationDescription', '');
            setFieldValue('shipFrom.addressLine1', '');
            setFieldValue('shipFrom.addressLine2', '');
            setFieldValue('shipFrom.locationId', '');
            setFieldValue('shipFrom.city', '');
            setFieldValue('shipFrom.state', '');
            setFieldValue('shipFrom.country', '');
            setFieldValue('shipFrom.pincode', '');
        }
    };


    return (
        <Formik
            initialValues={{
                shipFrom: shipFromReduxValues ? shipFromReduxValues :
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
                console.log("From values: ", values)
                dispatch(setPackageShipFrom(values?.shipFrom))
                onNext(values.shipFrom);
            }}
        >
            {({ values, touched, errors, handleSubmit, setFieldValue, handleBlur }) => (
                <Form className={styles.formsBgContainer}>
                    <Grid container spacing={2} className={styles.formsBgContainer}>
                        <h3 className={styles.mainHeading}>Location Details</h3>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={2.4}>
                                <FormControl fullWidth size="small" error={touched.shipFrom?.locationId && Boolean(errors.shipFrom?.locationId)}>
                                    <InputLabel>Location ID</InputLabel>
                                    <Select
                                        label="Location ID"
                                        name="shipFrom.locationId"
                                        value={values.shipFrom?.locationId}
                                        onChange={(event) => handleLocationChange(event, setFieldValue)}
                                        onBlur={handleBlur}
                                    >
                                        {getAllLocations?.map((location: Location) => (
                                            <MenuItem key={location.loc_ID} value={String(location.loc_ID)}>
                                                <Tooltip
                                                    title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                                                    placement="right">
                                                    <span style={{ flex: 1 }}>{location.loc_ID}</span>
                                                </Tooltip>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.shipFrom?.locationId && errors.shipFrom?.locationId && (
                                        <FormHelperText>{errors.shipFrom?.locationId}</FormHelperText>
                                    )}
                                </FormControl>
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
                        <Grid container spacing={2} justifyContent="center" marginTop={2}>
                            {/* <Grid item>
                                <Button variant="outlined">
                                    Back
                                </Button>
                            </Grid> */}
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
