'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Checkbox, FormControlLabel, Grid, TextField, Tooltip,  Backdrop, CircularProgress, Typography, Paper, List, ListItem } from '@mui/material';
import styles from './CreatePackage.module.css';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    clearPackageShipFrom,
    // setCompletedState,
    setPackageShipFrom
} from '@/store/authSlice';
import { useGetFilteredLocationsQuery, useGetLocationMasterQuery, usePostLocationMasterMutation, useUpdateShipFromDefaultLocationIdMutation } from '@/api/apiSlice';
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
    const { data: locationsData, isLoading: isLocationLoading } = useGetLocationMasterQuery([])
    const allLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    const shipFromReduxValues = useAppSelector((state) => state.auth.packageShipFrom)
    const defaultLocationData = allLocations?.find((eachLocation: Location) =>
        eachLocation?.def_ship_from === 1)
    const [searchKey, setSearchKey] = useState(shipFromReduxValues?.locationId || defaultLocationData?.loc_ID || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { data: filteredLocations, isLoading: filteredLocationLoading } = useGetFilteredLocationsQuery(searchKey);
    
    const displayLocations = searchKey ? filteredLocations?.results || [] : allLocations;
    console.log("display:", displayLocations)


    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const [postLocation, { isLoading: postLocationLoading }] = usePostLocationMasterMutation({})
    const [updateDefulatFromLocation, { isLoading: defaultLocationLoading }] = useUpdateShipFromDefaultLocationIdMutation();
    const dispatch = useAppDispatch()
   

    const shipToReduxValues = useAppSelector((state) => state.auth.packageShipTo)
    const billToReduxValues = useAppSelector((state) => state.auth.packageBillTo)

    const shipFromInitialValues = {
        locationId: shipFromReduxValues?.locationId || defaultLocationData?.loc_ID || '',
        locationDescription: shipFromReduxValues?.locationDescription || defaultLocationData?.loc_desc || '',
        contactPerson: shipFromReduxValues?.contactPerson || defaultLocationData?.contact_name || '',
        phoneNumber: shipFromReduxValues?.phoneNumber || defaultLocationData?.contact_phone_number || '',
        email: shipFromReduxValues?.email || defaultLocationData?.contact_email || '',
        addressLine1: shipFromReduxValues?.addressLine1 || defaultLocationData?.address_1 || '',
        addressLine2: shipFromReduxValues?.addressLine2 || defaultLocationData?.address_2 || '',
        city: shipFromReduxValues?.city || defaultLocationData?.city || '',
        state: shipFromReduxValues?.state || defaultLocationData?.state || '',
        country: shipFromReduxValues?.country || defaultLocationData?.country || '',
        pincode: shipFromReduxValues?.pincode || defaultLocationData?.pincode || '',
        saveAsNewLocationId: false,
        saveAsDefaultShipFromLocation: defaultLocationData?.def_ship_from || false,
        latitude: shipFromReduxValues?.latitude || defaultLocationData?.latitude || '',
        longitude: shipFromReduxValues?.longitude || defaultLocationData?.longitude || '',
        timeZone: shipFromReduxValues?.timeZone || defaultLocationData?.time_zone || '',
        glnCode: shipFromReduxValues?.glnCode || defaultLocationData?.gln_code || '',
        iataCode: shipFromReduxValues?.iataCode || defaultLocationData?.iata_code || '',
        locationType: shipFromReduxValues?.locationType || defaultLocationData?.loc_type || ''
    }

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
            const response = await updateDefulatFromLocation({ locId: locId, defShipFrom: defaultValue ? 1 : 0 }).unwrap();
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
            {isLocationLoading ? (
                <Backdrop
                    sx={{
                        color: "#ffffff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={postLocationLoading || isLocationLoading || defaultLocationLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
                <Formik
                    initialValues={shipFromInitialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values: IShipFrom, { setFieldValue }) => {
                        const { saveAsNewLocationId, saveAsDefaultShipFromLocation, ...shipFromData } = values;
                        console.log(saveAsNewLocationId, saveAsDefaultShipFromLocation)
                        dispatch(setPackageShipFrom(shipFromData))
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
                        <Form >
                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: 3 }}>Ship from Details</Typography>
                            <Grid item xs={12} sx={{ display: 'flex', flexDirection: { md: "row", xs: "column" }, gap: { md: '20px', xs: '2px' }, marginLeft: "15px" }}>
                                <FormControlLabel
                                    control={<Field name="saveAsDefaultShipFromLocation" type="checkbox" as={Checkbox} />}
                                    label="Save as default Ship From Location"
                                    onChange={() => {
                                        console.log("saveAsDefaultShipFromLocation1: ", !values.saveAsDefaultShipFromLocation)
                                        setFieldValue('saveAsDefaultShipFromLocation', !values.saveAsDefaultShipFromLocation);
                                        setFieldValue('saveAsNewLocationId', false);
                                        // console.log(values?.locationId)
                                        if (values.locationId) {
                                            handleDefaultLocationChange(values?.locationId, !values.saveAsDefaultShipFromLocation)
                                        }
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
        {displayLocations.length > 0 ? (
            <List>
                {displayLocations.map((location: Location) => (
                    <ListItem
                        key={location.loc_ID}
                        component="li"
                        onClick={() => {
                            setShowSuggestions(false);
                            setSearchKey(location.loc_ID);
                            handleLocationChange(location.loc_ID, setFieldValue);
                            setFieldValue("locationId", location.loc_ID);
                        }}
                        sx={{ cursor: "pointer" }}
                    >
                        <Tooltip
                            title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                            placement="right"
                        >
                            <span style={{ fontSize: "14px" }}>
                                {location.loc_ID}, {location.loc_desc}
                            </span>
                        </Tooltip>
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
                                            as={TextField} disabled
                                            label="Address Line 1 *"
                                            InputLabelProps={{ shrink: true }} size='small' fullWidth

                                            error={touched?.addressLine1 && Boolean(errors?.addressLine1)}
                                            helperText={touched?.addressLine1 && errors?.addressLine1}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2.4}>
                                        <Field
                                            name="addressLine2" disabled
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
                                            name="contactPerson" disabled
                                            as={TextField}
                                            label="Contact Person*"
                                            InputLabelProps={{ shrink: true }} size='small' fullWidth

                                            error={touched?.contactPerson && Boolean(errors?.contactPerson)}
                                            helperText={touched?.contactPerson && errors?.contactPerson}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2.4}>
                                        <Field
                                            name="phoneNumber" disabled
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
                                            name="email" disabled
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
                                        <CustomButtonFilled onSubmit={() => handleSubmit()}>Next</CustomButtonFilled>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            )}


        </Grid>

    );
};

export default ShipFrom;


