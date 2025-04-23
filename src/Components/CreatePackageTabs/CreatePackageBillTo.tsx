'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Checkbox, FormControlLabel, Grid, TextField, Backdrop, CircularProgress, Typography, Paper, List, ListItem, MenuItem } from '@mui/material';
import styles from './CreatePackage.module.css';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPackageBillTo } from '@/store/authSlice';
import { useGetFilteredLocationsQuery, useGetLocationMasterQuery, usePostLocationMasterMutation, useUpdateBillToDefaultLocationIdMutation } from '@/api/apiSlice';
import { Location } from '../MasterDataComponents/Locations';
import { IShipFrom } from './CreatePackageShipFrom';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { CustomButtonFilled, CustomButtonOutlined } from '../ReusableComponents/ButtonsComponent';

interface ShipFromProps {
    onNext: (values: IShipFrom) => void;
    onBack: () => void;
}

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

const BillTo: React.FC<ShipFromProps> = ({ onNext, onBack }) => {
    const dispatch = useAppDispatch()
    const { data: locationsData, isLoading: isLocationLoading } = useGetLocationMasterQuery([])
    const [updateDefulatFromLocation, { isLoading: defaultLocationLoading }] = useUpdateBillToDefaultLocationIdMutation();
    const allLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    const billToReduxValues = useAppSelector((state) => state.auth.packageBillTo)
    const defaultLocationData = allLocations?.find((eachLocation: Location) => eachLocation?.def_bill_to === 1)
    const defaultLocationDataInputText = defaultLocationData
        ? `${defaultLocationData.loc_ID},${defaultLocationData.loc_desc}, ${defaultLocationData.city}, ${defaultLocationData.state}, ${defaultLocationData.pincode}`
        : '';

    const [searchKey, setSearchKey] = useState(billToReduxValues?.locationId || defaultLocationDataInputText || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { data: filteredLocations, isLoading: filteredLocationLoading } = useGetFilteredLocationsQuery(searchKey.length >= 3 ? searchKey : null, { skip: searchKey.length < 3 });

    const displayLocations = searchKey ? filteredLocations?.results || [] : allLocations;

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const [postLocation, { isLoading: postLocationLoading }] = usePostLocationMasterMutation({})

    const shipFromReduxValues = useAppSelector((state) => state.auth.packageShipFrom)
    const shipFromLocationIdData = shipFromReduxValues?.locationId
    const shipFromLocationId = shipFromLocationIdData?.split(',')[0] ?? '';
    const getAllLocations = displayLocations.filter(
        (location: Location) => location.loc_ID !== shipFromLocationId
    );

    const locationTypeOptions = [
        'Production plant',
        'Distribution center',
        'Shipping point',
        'Customer',
        'Vendor',
        'Terminal',
        'Port',
        'Airport',
        'Railway station',
        'Container freight station',
        'Hub',
        'Gateway',
        'Container yard',
        'Warehouse',
        'Carrier warehouse',
        'Rail junction',
        'Border crossing point',
    ];

    const shipBillToInitialValues = {
        locationId: billToReduxValues?.locationId || defaultLocationDataInputText || '',
        locationDescription: billToReduxValues?.locationDescription || defaultLocationData?.loc_desc || '',
        contactPerson: billToReduxValues?.contactPerson || defaultLocationData?.contact_name || '',
        phoneNumber: billToReduxValues?.phoneNumber || defaultLocationData?.contact_phone_number || '',
        email: billToReduxValues?.email || defaultLocationData?.contact_email || '',
        addressLine1: billToReduxValues?.addressLine1 || defaultLocationData?.address_1 || '',
        addressLine2: billToReduxValues?.addressLine2 || defaultLocationData?.address_2 || '',
        city: billToReduxValues?.city || defaultLocationData?.city || '',
        state: billToReduxValues?.state || defaultLocationData?.state || '',
        country: billToReduxValues?.country || defaultLocationData?.country || '',
        pincode: billToReduxValues?.pincode || defaultLocationData?.pincode || '',
        saveAsNewLocationId: false,
        saveAsDefaultShipFromLocation: defaultLocationData?.def_bill_to || false,
        latitude: billToReduxValues?.latitude || defaultLocationData?.latitude || '',
        longitude: billToReduxValues?.longitude || defaultLocationData?.longitude || '',
        timeZone: billToReduxValues?.timeZone || defaultLocationData?.time_zone || '',
        glnCode: billToReduxValues?.glnCode || defaultLocationData?.gln_code || '',
        iataCode: billToReduxValues?.iataCode || defaultLocationData?.iata_code || '',
        locationType: billToReduxValues?.locationType || defaultLocationData?.loc_type || ''
    }

    const handleLocationChange = (
        selectedLocationId: string,
        setFieldValue: FormikProps<IShipFrom>['setFieldValue']
    ) => {
        setFieldValue("locationId", selectedLocationId);

        const selectedLocation = getAllLocations.find(
            (loc: Location) => loc?.loc_ID === selectedLocationId
        );

        if (selectedLocation) {
            setFieldValue("locationDescription", selectedLocation.loc_desc || "");
            setFieldValue("addressLine1", selectedLocation.address_1 || "");
            setFieldValue("addressLine2", selectedLocation.address_2 || "");
            setFieldValue("city", selectedLocation.city || "");
            setFieldValue("state", selectedLocation.state || "");
            setFieldValue("country", selectedLocation.country || "");
            setFieldValue("pincode", selectedLocation.pincode || "");
            setFieldValue("latitude", selectedLocation.latitude || "");
            setFieldValue("longitude", selectedLocation.longitude || "");
            setFieldValue("timeZone", selectedLocation.time_zone || "");
            setFieldValue("locationType", selectedLocation.loc_type || "");
            setFieldValue("glnCode", selectedLocation.gln_code || "");
            setFieldValue("iataCode", selectedLocation.iata_code || "");
            setFieldValue("contactPerson", selectedLocation.contact_name || "");
            setFieldValue("phoneNumber", selectedLocation.contact_phone_number || "");
            setFieldValue("email", selectedLocation.contact_email || "");
            setFieldValue("saveAsDefaultShipFromLocation", selectedLocation.def_ship_from || false);
        } else {
            // Reset values if location is not found
            setFieldValue("locationId", "");
            setFieldValue("locationDescription", "");
            setFieldValue("addressLine1", "");
            setFieldValue("addressLine2", "");
            setFieldValue("city", "");
            setFieldValue("state", "");
            setFieldValue("country", "");
            setFieldValue("pincode", "");
            setFieldValue("latitude", "");
            setFieldValue("longitude", "");
            setFieldValue("timeZone", "");
            setFieldValue("locationType", "");
            setFieldValue("glnCode", "");
            setFieldValue("iataCode", "");
            setFieldValue("contactPerson", "");
            setFieldValue("phoneNumber", "");
            setFieldValue("email", "");
        }
    };

    const handleDefaultLocationChange = async (locId: string, defaultValue: number | boolean) => {
        try {
            const updatedLocationId = locId?.split(',')[0] ?? '';
            const response = await updateDefulatFromLocation({ locId: updatedLocationId, defShipFrom: defaultValue ? 1 : 0 }).unwrap();
            console.log("response: ", response)
        } catch (error) {
            console.log("Getting error while changing default value: ", error)
        }
    }

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
                open={postLocationLoading || isLocationLoading || defaultLocationLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Formik
                initialValues={shipBillToInitialValues}
                validationSchema={validationSchema}
                onSubmit={async (values: IShipFrom, { setFieldValue }) => {
                    const { saveAsNewLocationId, saveAsDefaultShipFromLocation, ...shipFromData } = values;
                    console.log(saveAsNewLocationId, saveAsDefaultShipFromLocation)
                    dispatch(setPackageBillTo(shipFromData))
                    // dispatch(setCompletedState(3));

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
                            console.log('response in post location:', response);
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
                {({ values, touched, errors, handleSubmit, setFieldValue, handleBlur, handleChange }) => (
                    <Form  >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: 3 }}>Bill to Details</Typography>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: { md: "row", xs: "column" }, gap: { md: '20px', xs: '2px' }, marginLeft: "15px" }}>
                            {values?.saveAsNewLocationId ? null : (
                                <FormControlLabel
                                    control={<Field name="saveAsDefaultShipFromLocation" type="checkbox" as={Checkbox} />}
                                    label="Save as default bill to location"
                                    onChange={() => {
                                        setFieldValue('saveAsDefaultShipFromLocation', !values.saveAsDefaultShipFromLocation);
                                        setFieldValue('saveAsNewLocationId', false);
                                        if (values.locationId) {
                                            handleDefaultLocationChange(values?.locationId, !values.saveAsDefaultShipFromLocation)
                                        }
                                    }}
                                />
                            )}
                            <FormControlLabel
                                control={<Field name="saveAsNewLocationId" type="checkbox" as={Checkbox} />}
                                label="Save as new Location ID"
                                onChange={() => {
                                    setFieldValue('saveAsNewLocationId', !values.saveAsNewLocationId);
                                    setFieldValue('saveAsDefaultShipFromLocation', false);
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
                                        <TextField
                                            fullWidth
                                            name="locationId"
                                            size="small"
                                            label="Search Location"
                                            onFocus={() => {
                                                if (!searchKey) {
                                                    setSearchKey(values?.locationId || "");
                                                    setShowSuggestions(true);
                                                }
                                            }}
                                            onChange={(e) => {
                                                setSearchKey(e.target.value)
                                                setShowSuggestions(true)
                                                setFieldValue("locationDescription", "");
                                                setFieldValue("addressLine1", "");
                                                setFieldValue("addressLine2", "");
                                                setFieldValue("city", "");
                                                setFieldValue("state", "");
                                                setFieldValue("country", "");
                                                setFieldValue("pincode", "");
                                                setFieldValue("latitude", "");
                                                setFieldValue("longitude", "");
                                                setFieldValue("timeZone", "");
                                                setFieldValue("locationType", "");
                                                setFieldValue("glnCode", "");
                                                setFieldValue("iataCode", "");
                                                setFieldValue("contactPerson", "");
                                                setFieldValue("phoneNumber", "");
                                                setFieldValue("email", "");
                                            }
                                            }
                                            onBlur={handleBlur}
                                            value={searchKey} // Display the selected location ID
                                            error={touched?.locationId && Boolean(errors?.locationId)}
                                            helperText={
                                                touched?.locationId && typeof errors?.locationId === "string"
                                                    ? errors.locationId
                                                    : ""
                                            }
                                            InputProps={{
                                                endAdornment: filteredLocationLoading ? <CircularProgress size={20} /> : null,
                                            }}
                                        />
                                        {showSuggestions && (
                                            <Paper
                                                style={{
                                                    maxHeight: 200,
                                                    overflowY: "auto",
                                                    position: "absolute",
                                                    zIndex: 10,
                                                    width: "18%",
                                                    padding: "8px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {getAllLocations.length > 0 ? (
                                                    <List>
                                                        {getAllLocations.map((location: Location) => (
                                                            <ListItem
                                                                key={location.loc_ID}
                                                                component="li"
                                                                onClick={() => {
                                                                    setShowSuggestions(false);
                                                                    const selectedDisplay = `${location.loc_ID},${location?.loc_desc}, ${location.city}, ${location.state}, ${location.pincode}`;
                                                                    setSearchKey(selectedDisplay);
                                                                    // setSearchKey(location.loc_ID);
                                                                    handleLocationChange(location.loc_ID, setFieldValue);
                                                                    setFieldValue("locationId", selectedDisplay);
                                                                }}
                                                                sx={{ cursor: "pointer" }}
                                                            >
                                                                <span style={{ fontSize: "14px" }}>
                                                                    {location.loc_ID}, {location?.loc_desc}, {location.city}, {location.state}, {location.country}, {location.pincode}
                                                                </span>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary">
                                                        No results found
                                                    </Typography>
                                                )}
                                            </Paper>
                                        )}

                                    </Grid>
                                )}

                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="locationDescription"
                                        as={TextField}
                                        disabled={!values.saveAsNewLocationId}
                                        label="Location Description*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth

                                        error={touched?.locationDescription && Boolean(errors?.locationDescription)}
                                        helperText={touched?.locationDescription && errors?.locationDescription}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="latitude"
                                        as={TextField}
                                        disabled={!values.saveAsNewLocationId}
                                        label="Latitude*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        error={touched?.latitude && Boolean(errors?.latitude)}
                                        helperText={touched?.latitude && errors?.latitude}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="longitude"
                                        as={TextField}
                                        disabled={!values.saveAsNewLocationId}
                                        label="Longitude*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        error={touched?.longitude && Boolean(errors?.longitude)}
                                        helperText={touched?.longitude && errors?.longitude}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="timeZone"
                                        disabled={!values.saveAsNewLocationId}
                                        as={TextField}
                                        label="Time zone*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        error={touched?.timeZone && Boolean(errors?.timeZone)}
                                        helperText={touched?.timeZone && errors?.timeZone}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        select
                                        label="Location type"
                                        name="locationType"
                                        value={values.locationType}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched?.locationType && Boolean(errors?.locationType)}
                                        // helperText={touched?.locationType && errors?.locationType}
                                        helperText={
                                            touched?.locationType && typeof errors?.locationType === 'string'
                                                ? errors.locationType
                                                : ''
                                        }
                                    >
                                        {locationTypeOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="glnCode"
                                        as={TextField}
                                        label="GLN Code"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        error={touched?.glnCode && Boolean(errors?.glnCode)}
                                        helperText={touched?.glnCode && errors?.glnCode}
                                        disabled={!values.saveAsNewLocationId}
                                    />
                                </Grid>

                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="iataCode"
                                        as={TextField}
                                        label="IATA Code"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        error={touched?.iataCode && Boolean(errors?.iataCode)}
                                        helperText={touched?.iataCode && errors?.iataCode}
                                        disabled={!values.saveAsNewLocationId}
                                    />
                                </Grid>
                            </Grid>

                            <h3 className={styles.mainHeading}>Address Information</h3>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="addressLine1"
                                        as={TextField}
                                        disabled={!values.saveAsNewLocationId}
                                        label="Address Line 1*"
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
                                        disabled={!values.saveAsNewLocationId}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="city"
                                        as={TextField}
                                        label="City*"
                                        disabled={!values.saveAsNewLocationId}
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth

                                        error={touched?.city && Boolean(errors?.city)}
                                        helperText={touched?.city && errors?.city}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="state"
                                        as={TextField}
                                        disabled={!values.saveAsNewLocationId}
                                        label="State*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth

                                        error={touched?.state && Boolean(errors?.state)}
                                        helperText={touched?.state && errors?.state}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="country"
                                        disabled={!values.saveAsNewLocationId}
                                        as={TextField}
                                        label="Country*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        error={touched?.country && Boolean(errors?.country)}
                                        helperText={touched?.country && errors?.country}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="pincode"
                                        disabled={!values.saveAsNewLocationId}
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
                                        disabled={!values.saveAsNewLocationId}
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
                                        disabled={!values.saveAsNewLocationId}
                                        as={TextField}
                                        label="Phone Number*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        type='number'
                                        error={touched?.phoneNumber && Boolean(errors?.phoneNumber)}
                                        helperText={touched?.phoneNumber && errors?.phoneNumber}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2.4}>
                                    <Field
                                        name="email"
                                        disabled={!values.saveAsNewLocationId}
                                        as={TextField}
                                        label="Email Address*"
                                        InputLabelProps={{ shrink: true }} size='small' fullWidth

                                        error={touched?.email && Boolean(errors?.email)}
                                        helperText={touched?.email && errors?.email}
                                    />
                                </Grid>
                            </Grid>

                            {/* Back & Next Buttons */}
                            <Grid container spacing={2} justifyContent="center" marginTop={2}>
                                <Grid item>
                                    <CustomButtonOutlined onClick={onBack}>Back</CustomButtonOutlined>
                                </Grid>
                                <Grid item>
                                    <CustomButtonFilled onSubmit={() => handleSubmit()}>Next</CustomButtonFilled>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Grid>

    );
};

export default BillTo;
