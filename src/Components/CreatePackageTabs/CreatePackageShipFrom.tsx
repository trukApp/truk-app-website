'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Checkbox, FormControlLabel, Grid, TextField,FormControl, InputLabel, Select, MenuItem, Tooltip, FormHelperText, SelectChangeEvent, Backdrop, CircularProgress, Typography } from '@mui/material';
import styles from './CreatePackage.module.css';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    clearPackageShipFrom,
    // setCompletedState,
    setPackageShipFrom
} from '@/store/authSlice';
import { useGetLocationMasterQuery, usePostLocationMasterMutation} from '@/api/apiSlice';
import { Location } from '../MasterDataComponents/Locations';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { CustomButtonFilled } from '../ReusableComponents/ButtonsComponent';

interface ShipFromProps {
    onNext: (values: IShipFrom) => void;
    // onBack: () => void;
}
export interface IShipFrom {
    addressLine1: string;
    addressLine2: string;
    city: string;
    contactPerson: string;
    country: string;
    email: string;
    locationDescription: string;
    locationId: string;
    phoneNumber: string;
    pincode: string;
    state: string;
    latitude: string;
    longitude: string;
    timeZone: string;
    locationType: string;
    glnCode: string;
    iataCode: string;
    saveAsNewLocationId: boolean,
    saveAsDefaultShipFromLocation: boolean,

}


const ShipFrom: React.FC<ShipFromProps> = ({ onNext }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const [postLocation, { isLoading: postLocationLoading }] = usePostLocationMasterMutation({})
    const dispatch = useAppDispatch()
    const shipFromReduxValues = useAppSelector((state) => state.auth.packageShipFrom)
    const shipToReduxValues = useAppSelector((state) => state.auth.packageShipTo)
    const billToReduxValues = useAppSelector((state) => state.auth.packageBillTo)
    const { data: locationsData, isLoading: isLocationLoading } = useGetLocationMasterQuery([])
    const allLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    const getAllLocations = allLocations.filter((location: Location) => {
        if (shipToReduxValues?.locationId && billToReduxValues?.locationId) {
            return (
                location.loc_ID !== shipToReduxValues.locationId &&
                location.loc_ID !== billToReduxValues.locationId
            );
        } else if (shipToReduxValues?.locationId) { 
            return location.loc_ID !== shipToReduxValues.locationId;
        } else if (billToReduxValues?.locationId) { 
            return location.loc_ID !== billToReduxValues.locationId;
        }
        return true; 
    });


    const validationSchema = Yup.object({
        locationId: Yup.string().when("saveAsNewLocationId", {
            is: (value: boolean) => value === false,
            then: (schema) => schema.required("Location ID is required"),
        }),


        locationDescription: Yup.string().required('Location Description is required'),
        addressLine1: Yup.string().required('Address Line 1 is required'),
        contactPerson: Yup.string().required('Contact person is required'),
        phoneNumber: Yup.string()
            .matches(/^\d{10}$/, 'Phone number must be 10 digits')
            .required('Phone number is required'),
        email: Yup.string()
            .email('Enter a valid email address')
            .required('Email is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        country: Yup.string().required('Country is required'),
        pincode: Yup.string().matches(/^\d{6}$/, 'Invalid pincode').required('Pincode is required'),
        latitude: Yup.string().required('Latitude is required'),
        longitude: Yup.string().required('Longitude is required'),
        timeZone: Yup.string().required('Time zone is required'),
        locationType: Yup.string().required('Location type is required'),

    });


    const handleLocationChange = (
        event: SelectChangeEvent<string>,
        setFieldValue: FormikProps<IShipFrom>['setFieldValue']
    ) => {
        const selectedLocationId = event.target.value;
        setFieldValue('locationId', selectedLocationId);

        const selectedLocation = getAllLocations.find((loc: Location) => loc?.loc_ID === selectedLocationId);

        if (selectedLocation) {
            setFieldValue('locationDescription', selectedLocation.loc_desc || '');
            setFieldValue('addressLine1', selectedLocation.address_1 || '');
            setFieldValue('addressLine2', selectedLocation.address_2 || '');
            setFieldValue('city', selectedLocation.city || '');
            setFieldValue('state', selectedLocation.state || '');
            setFieldValue('country', selectedLocation.country || '');
            setFieldValue('pincode', selectedLocation.pincode || '');
            setFieldValue('latitude', selectedLocation.latitude || '');
            setFieldValue('longitude', selectedLocation.longitude || '');
            setFieldValue('timeZone', selectedLocation.time_zone || '');
            setFieldValue('locationType', selectedLocation.loc_type || '');
            setFieldValue('glnCode', selectedLocation.gln_code || '');
            setFieldValue('iataCode', selectedLocation.iata_code || '');
            setFieldValue('contactPerson', selectedLocation.contact_name || '');
            setFieldValue('phoneNumber', selectedLocation.contact_phone_number|| '');
            setFieldValue('email', selectedLocation.contact_email || '');

        } else {
            setFieldValue('locationDescription', '');
            setFieldValue('addressLine1', '');
            setFieldValue('addressLine2', '');
            setFieldValue('locationId', '');
            setFieldValue('city', '');
            setFieldValue('state', '');
            setFieldValue('country', '');
            setFieldValue('pincode', '');
            setFieldValue('latitude', '');
            setFieldValue('longitude', '');
            setFieldValue('timeZone', '');
            setFieldValue('locationType', '');
            setFieldValue('glnCode', '');
            setFieldValue('iataCode', '');
            setFieldValue('contactPerson',   '');
            setFieldValue('phoneNumber',   '');
            setFieldValue('email',  '');
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
            <Backdrop
                sx={{
                    color: "#ffffff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={postLocationLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Formik
                initialValues={{
                    locationId: shipFromReduxValues?.locationId || '',
                    locationDescription: shipFromReduxValues?.locationDescription || '',
                    contactPerson: shipFromReduxValues?.contactPerson || '',
                    phoneNumber: shipFromReduxValues?.phoneNumber || '',
                    email: shipFromReduxValues?.email || '',
                    addressLine1: shipFromReduxValues?.addressLine1 || '',
                    addressLine2: shipFromReduxValues?.addressLine2 || '',
                    city: shipFromReduxValues?.city || '',
                    state: shipFromReduxValues?.state || '',
                    country: shipFromReduxValues?.country || '',
                    pincode: shipFromReduxValues?.pincode || '',
                    saveAsNewLocationId: false,
                    saveAsDefaultShipFromLocation: true,
                    latitude: shipFromReduxValues?.latitude || '',
                    longitude: shipFromReduxValues?.longitude || '',
                    timeZone: shipFromReduxValues?.timeZone || '',
                    glnCode: shipFromReduxValues?.glnCode || '',
                    iataCode: shipFromReduxValues?.iataCode || '',
                    locationType: shipFromReduxValues?.locationType || ''
                }}

                validationSchema={validationSchema}
                onSubmit={async (values: IShipFrom, { setFieldValue }) => {
                    const { saveAsNewLocationId, saveAsDefaultShipFromLocation, ...shipFromData } = values;
                    console.log(saveAsNewLocationId, saveAsDefaultShipFromLocation)
                    dispatch(setPackageShipFrom(shipFromData))
                    // dispatch(setCompletedState(0));

                    if (values.saveAsNewLocationId) {
                        try {

                            const body = {
                                locations: [
                                    {
                                        loc_desc: values.locationDescription,
                                        longitude: values.longitude,
                                        latitude: values.latitude,
                                        time_zone: values.timeZone,
                                        address_1: values.addressLine1,
                                        address_2: values.addressLine2,
                                        city: values.city,
                                        state: values.state,
                                        country: values.country,
                                        pincode: values.pincode,
                                        loc_type: values.locationType,
                                        gln_code: values.glnCode,
                                        iata_code: values.iataCode,
                                        contact_name: values.contactPerson,
                                        contact_phone_number: values.phoneNumber,
                                        contact_email: values.email,

                                    }
                                ]
                            }
                            const response = await postLocation(body).unwrap();
                            if (response) {
                                setFieldValue("locationId", response.created_records[0]);
                            }
                            setSnackbarMessage("Locations created successfully!");
                            setSnackbarSeverity("success");
                            setSnackbarOpen(true);
                        } catch (error) {
                            console.error('API Error:', error);
                            setSnackbarMessage("Something went wrong! please try again");
                            setSnackbarSeverity("error");
                            setSnackbarOpen(true);
                        }

                    }
                    onNext(values);

                }}
            >
                {({ values, touched, errors, handleSubmit, setFieldValue, handleBlur }) => (
                    <Form  >
                        <Typography variant="h6" sx={{fontWeight:'bold', textAlign:'center' , marginTop:3}}>Ship from Details</Typography>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: "row", gap: '20px' }}>
                            <FormControlLabel
                                control={<Field name="saveAsDefaultShipFromLocation" type="checkbox" as={Checkbox} />}
                                label="Save as default Ship From Location"
                                onChange={() => {
                                    setFieldValue('saveAsDefaultShipFromLocation', !values.saveAsDefaultShipFromLocation);
                                    setFieldValue('saveAsNewLocationId', false);
                                }}
                            />
                            <FormControlLabel
                                control={<Field name="saveAsNewLocationId" type="checkbox" as={Checkbox} />}
                                label="Save as new Location ID"
                                onChange={() => {
                                    setFieldValue('saveAsNewLocationId', !values.saveAsNewLocationId);
                                    setFieldValue('saveAsDefaultShipFromLocation', false);
                                    dispatch(clearPackageShipFrom())
                                    setFieldValue('locationDescription', '')
                                    setFieldValue('addressLine1', '');
                                    setFieldValue('addressLine2', '');
                                    setFieldValue('locationId', '');
                                    setFieldValue('city', '');
                                    setFieldValue('state', '');
                                    setFieldValue('country', '');
                                    setFieldValue('pincode', '');
                                    setFieldValue('latitude', '');
                                    setFieldValue('longitude', '');
                                    setFieldValue('timeZone', '');
                                    setFieldValue('locationType', '');
                                    setFieldValue('glnCode', '');
                                    setFieldValue('iataCode', '');
                                    setFieldValue('contactPerson', '');
                                    setFieldValue('phoneNumber', '');
                                    setFieldValue('email', '');

                                }}
                            />
                        </Grid>
                        <Grid container spacing={2} className={styles.formsBgContainer}>
                            <h3 className={styles.mainHeading}>Location Details</h3>
                            <Grid container spacing={2}>
                                {!values.saveAsNewLocationId && (
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <FormControl size='small' fullWidth error={touched?.locationId && Boolean(errors?.locationId)}>
                                            <InputLabel shrink >Location ID</InputLabel>
                                            <Select label="Location ID*"
                                                displayEmpty
                                                name="locationId"
                                                value={values?.locationId}
                                                onChange={(event) => handleLocationChange(event, setFieldValue)}
                                                onBlur={handleBlur}
                                            >
                                                {isLocationLoading ? (
                                                    <MenuItem disabled>
                                                        <CircularProgress size={20} color="inherit" />
                                                        <span style={{ marginLeft: "10px" }}>Loading...</span>
                                                    </MenuItem>
                                                ) : (
                                                    getAllLocations?.map((location: Location) => (
                                                        <MenuItem key={location.loc_ID} value={String(location.loc_ID)}>
                                                            <Tooltip
                                                                title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                                                                placement="right"
                                                            >
                                                                <span style={{ flex: 1 }}>{location.loc_ID}</span>
                                                            </Tooltip>
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                            {touched?.locationId && errors?.locationId && (
                                                <FormHelperText>{errors?.locationId}</FormHelperText>
                                            )}
                                        </FormControl> </Grid>
                                )}

                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="locationDescription"
                                        as={TextField} disabled
                                        label="Location Description*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth

                                        error={touched?.locationDescription && Boolean(errors?.locationDescription)}
                                        helperText={touched?.locationDescription && errors?.locationDescription}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="latitude"
                                        as={TextField} disabled
                                        label="Latitude*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        error={touched?.latitude && Boolean(errors?.latitude)}
                                        helperText={touched?.latitude && errors?.latitude}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="longitude"
                                        as={TextField} disabled
                                        label="Longitude*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        error={touched?.longitude && Boolean(errors?.longitude)}
                                        helperText={touched?.longitude && errors?.longitude}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="timeZone"
                                        as={TextField} disabled
                                        label="Time zone*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        error={touched?.timeZone && Boolean(errors?.timeZone)}
                                        helperText={touched?.timeZone && errors?.timeZone}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="locationType"
                                        as={TextField} disabled
                                        label="Location type*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        error={touched?.locationType && Boolean(errors?.locationType)}
                                        helperText={touched?.locationType && errors?.locationType}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="glnCode"
                                        as={TextField}
                                        label="GLN Code" disabled
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        error={touched?.glnCode && Boolean(errors?.glnCode)}
                                        helperText={touched?.glnCode && errors?.glnCode}
                                    />
                                </Grid>

                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="iataCode"
                                        as={TextField} disabled
                                        label="IATA Code"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        error={touched?.iataCode && Boolean(errors?.iataCode)}
                                        helperText={touched?.iataCode && errors?.iataCode}
                                    />
                                </Grid>
                            </Grid>

                            <h3 className={styles.mainHeading}>Address Information</h3>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="addressLine1"
                                        as={TextField}  
                                        label="Address Line 1 *"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth

                                        error={touched?.addressLine1 && Boolean(errors?.addressLine1)}
                                        helperText={touched?.addressLine1 && errors?.addressLine1}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="addressLine2"
                                        as={TextField}
                                        label="Address Line 2"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="city"
                                        as={TextField} disabled
                                        label="City*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth

                                        error={touched?.city && Boolean(errors?.city)}
                                        helperText={touched?.city && errors?.city}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="state" disabled
                                        as={TextField}
                                        label="State*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth

                                        error={touched?.state && Boolean(errors?.state)}
                                        helperText={touched?.state && errors?.state}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="country" disabled
                                        as={TextField}
                                        label="Country*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth

                                        error={touched?.country && Boolean(errors?.country)}
                                        helperText={touched?.country && errors?.country}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="pincode" disabled
                                        as={TextField}
                                        label="Pincode*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        required
                                        error={touched?.pincode && Boolean(errors?.pincode)}
                                        helperText={touched?.pincode && errors?.pincode}
                                    />
                                </Grid>
                            </Grid>
                            <h3 className={styles.mainHeading}>Contact Information</h3>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="contactPerson"
                                        as={TextField}
                                        label="Contact Person*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth

                                        error={touched?.contactPerson && Boolean(errors?.contactPerson)}
                                        helperText={touched?.contactPerson && errors?.contactPerson}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="phoneNumber"
                                        as={TextField}
                                        label="Phone Number*"
                                        inputProps={{
                                            maxLength: 10,
                                            pattern: "[0-9]*",
                                        }}
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        type='number'
                                        error={touched?.phoneNumber && Boolean(errors?.phoneNumber)}
                                        helperText={touched?.phoneNumber && errors?.phoneNumber}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="email"
                                        as={TextField}
                                        label="Email Address*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth

                                        error={touched?.email && Boolean(errors?.email)}
                                        helperText={touched?.email && errors?.email}
                                    />
                                </Grid>
                            </Grid>


                            {/* <h3 className={styles.mainHeading}>Save Options</h3>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={2.4}>
                                <FormControlLabel
                                    control={<Field name="saveAsNewLocationId" type="checkbox" as={Checkbox} />}
                                    label="Save as new Location ID"
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <FormControlLabel
                                    control={<Field name="saveAsDefaultShipFromLocation" type="checkbox" as={Checkbox} />}
                                    label="Save as default Ship From Location"
                                />
                            </Grid>
                        </Grid> */}

                            {/* Back & Next Buttons */}
                            <Grid container spacing={2} justifyContent="center" marginTop={2}>
                                {/* <Grid item>
                                <Button variant="outlined">
                                    Back
                                </Button>
                            </Grid> */}
                                <Grid item>
                                    {/* <Button
                                        variant="contained"
                                        color="primary"
                                        // disabled={!isValid || !dirty}
                                        onClick={() => handleSubmit()}
                                    >
                                        Next
                                    </Button> */}
                                <CustomButtonFilled  onSubmit={()=>handleSubmit()}>Next</CustomButtonFilled>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Grid>

    );
};

export default ShipFrom;
