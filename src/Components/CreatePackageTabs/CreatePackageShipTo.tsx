import React, { useState } from 'react';
import { Formik, Form, Field, FormikProps } from 'formik';
import { Grid, TextField, Checkbox, FormControlLabel, Backdrop, CircularProgress, Typography, Paper, List, ListItem } from '@mui/material'
import * as Yup from 'yup';
import styles from './CreatePackage.module.css';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPackageShipTo } from '@/store/authSlice';
import { useGetFilteredLocationsQuery, useGetLocationMasterQuery, usePostLocationMasterMutation, useUpdateShipToDefaultLocationIdMutation } from '@/api/apiSlice';
import { Location } from '../MasterDataComponents/Locations';
import { IShipFrom } from './CreatePackageShipFrom';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { CustomButtonFilled, CustomButtonOutlined } from '../ReusableComponents/ButtonsComponent';
interface ShipToProps {
    onNext: (values: IShipFrom) => void;
    onBack: () => void;
}

const validationSchema = Yup.object({
    locationId: Yup.string().when("saveAsNewLocationId", {
        is: (value: boolean) => value === false,
        then: (schema) => schema.required("Location ID is required"),
    }),
    // locationDescription: Yup.string().required('Location Description is required'),
    // addressLine1: Yup.string().required('Address Line 1 is required'),
    // contactPerson: Yup.string().required('Contact person is required'),
    // phoneNumber: Yup.string()
    //     .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    //     .required('Phone number is required'),
    // email: Yup.string()
    //     .email('Enter a valid email address')
    //     .required('Email is required'),
    // city: Yup.string().required('City is required'),
    // state: Yup.string().required('State is required'),
    // country: Yup.string().required('Country is required'),
    // pincode: Yup.string().matches(/^\d{6}$/, 'Invalid pincode').required('Pincode is required'),
    // latitude: Yup.string().required('Latitude is required'),
    // longitude: Yup.string().required('Longitude is required'),
    // timeZone: Yup.string().required('Time zone is required'),
    // locationType: Yup.string().required('Location type is required'),

});

const ShipFrom: React.FC<ShipToProps> = ({ onNext, onBack }) => {
    const dispatch = useAppDispatch()
    const { data: locationsData, isLoading: isLocationLoading } = useGetLocationMasterQuery([])
    const [updateDefulatFromLocation, { isLoading: defaultLocationLoading }] = useUpdateShipToDefaultLocationIdMutation();
    const allLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    const defaultLocationData = allLocations?.find((eachLocation: Location) =>
        eachLocation?.def_bill_to === 1)
    const defaultLocationDataInputText = defaultLocationData
        ? `${defaultLocationData.loc_ID},${defaultLocationData.loc_desc}, ${defaultLocationData.city}, ${defaultLocationData.state}, ${defaultLocationData.pincode}`
        : '';
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const [postLocation, { isLoading: postLocationLoading }] = usePostLocationMasterMutation({})
    const shipToReduxValues = useAppSelector((state) => state.auth.packageShipTo)
    const shipFromReduxValues = useAppSelector((state) => state.auth.packageShipFrom)
    const [searchKey, setSearchKey] = useState(shipToReduxValues?.locationId || defaultLocationDataInputText || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { data: filteredLocations, isLoading: filteredLocationLoading } = useGetFilteredLocationsQuery(searchKey.length >= 3 ? searchKey : null, { skip: searchKey.length < 3 });
    const displayLocations = searchKey ? filteredLocations?.results || [] : allLocations;
    const shipFromLocationIdData = shipFromReduxValues?.locationId
    const shipFromLocationId = shipFromLocationIdData?.split(',')[0] ?? '';
    const getAllLocations = displayLocations.filter(
        (location: Location) => location.loc_ID !== shipFromLocationId
    );
    const shipFromInitialValues = {
        locationId: shipToReduxValues?.locationId || defaultLocationDataInputText || '',
        locationDescription: shipToReduxValues?.locationDescription || defaultLocationData?.loc_desc || '',
        contactPerson: shipToReduxValues?.contactPerson || defaultLocationData?.contact_name || '',
        phoneNumber: shipToReduxValues?.phoneNumber || defaultLocationData?.contact_phone_number || '',
        email: shipToReduxValues?.email || defaultLocationData?.contact_email || '',
        addressLine1: shipToReduxValues?.addressLine1 || defaultLocationData?.address_1 || '',
        addressLine2: shipToReduxValues?.addressLine2 || defaultLocationData?.address_2 || '',
        city: shipToReduxValues?.city || defaultLocationData?.city || '',
        state: shipToReduxValues?.state || defaultLocationData?.state || '',
        country: shipToReduxValues?.country || defaultLocationData?.country || '',
        pincode: shipToReduxValues?.pincode || defaultLocationData?.pincode || '',
        saveAsNewLocationId: false,
        saveAsDefaultShipFromLocation: defaultLocationData?.def_ship_to || false,
        latitude: shipToReduxValues?.latitude || defaultLocationData?.latitude || '',
        longitude: shipToReduxValues?.longitude || defaultLocationData?.longitude || '',
        timeZone: shipToReduxValues?.timeZone || defaultLocationData?.time_zone || '',
        glnCode: shipToReduxValues?.glnCode || defaultLocationData?.gln_code || '',
        iataCode: shipToReduxValues?.iataCode || defaultLocationData?.iata_code || '',
        locationType: shipToReduxValues?.locationType || defaultLocationData?.loc_type || ''
    }

    // console.log("getLocationsError: ", getLocationsError)

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

            {isLocationLoading ? (
                <Backdrop
                    sx={{
                        color: "#ffffff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={postLocationLoading || defaultLocationLoading || isLocationLoading}
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
                        dispatch(setPackageShipTo(shipFromData))
                        // dispatch(setCompletedState(1));

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
                                    onNext(values)
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
                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: 3 }}>Ship to Details</Typography>
                            <Grid item xs={12} sx={{ display: 'flex', flexDirection: { md: "row", xs: "column" }, gap: { md: '20px', xs: '2px' }, marginLeft: "15px" }}>
                                <FormControlLabel
                                    control={<Field name="saveAsDefaultShipFromLocation" type="checkbox" as={Checkbox} />}
                                    label="Save as default Ship To Location"
                                    onChange={() => {
                                        setFieldValue('saveAsDefaultShipFromLocation', !values.saveAsDefaultShipFromLocation);
                                        setFieldValue('saveAsNewLocationId', false);
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
                                                value={searchKey}
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
                                            {showSuggestions && getAllLocations?.length > 0 && (
                                                <Paper
                                                    style={{
                                                        maxHeight: 200,
                                                        overflowY: "auto",
                                                        position: "absolute",
                                                        zIndex: 10,
                                                        width: "18%",
                                                    }}
                                                >
                                                    <List>
                                                        {getAllLocations.map((location: Location) => (
                                                            <ListItem
                                                                key={location.loc_ID}
                                                                component="li"
                                                                onClick={() => {
                                                                    setShowSuggestions(false)
                                                                    const selectedDisplay = `${location.loc_ID},${location?.loc_desc}, ${location.city}, ${location.state}, ${location.pincode}`;
                                                                    setSearchKey(selectedDisplay);
                                                                    // setSearchKey(location.loc_ID);
                                                                    handleLocationChange(location.loc_ID, setFieldValue);
                                                                    setFieldValue("locationId", selectedDisplay);
                                                                }}
                                                                sx={{ cursor: "pointer" }}
                                                            >
                                                                {/* <Tooltip
                                                                    title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                                                                    placement="right"
                                                                >
                                                                </Tooltip> */}
                                                                <span style={{ fontSize: '14px' }}>{location.loc_ID},{location?.loc_desc}, {location.city}, {location.state}, {location.country}, {location.pincode}</span>
                                                            </ListItem>
                                                        ))}
                                                    </List>
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
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2.4}>
                                        <Field
                                            name="latitude"
                                            as={TextField} disabled
                                            label="Latitude*"
                                            InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2.4}>
                                        <Field
                                            name="longitude"
                                            as={TextField}
                                            label="Longitude*" disabled
                                            InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2.4}>
                                        <Field
                                            name="timeZone" disabled
                                            as={TextField}
                                            label="Time zone*"
                                            InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2.4}>
                                        <Field
                                            name="locationType" disabled
                                            as={TextField}
                                            label="Location type*"
                                            InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2.4}>
                                        <Field
                                            name="glnCode"
                                            as={TextField} disabled
                                            label="GLN Code"
                                            InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={2.4}>
                                        <Field
                                            name="iataCode" disabled
                                            as={TextField}
                                            label="IATA Code"
                                            InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        />
                                    </Grid>
                                </Grid>

                                <h3 className={styles.mainHeading}>Address Information</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={2.4}>
                                        <Field
                                            name="addressLine1" disabled
                                            as={TextField}
                                            label="Address Line 1*"
                                            InputLabelProps={{ shrink: true }} size='small' fullWidth
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
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2.4}>
                                        <Field
                                            name="country"
                                            as={TextField} disabled
                                            label="Country*"
                                            InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2.4}>
                                        <Field
                                            name="pincode"
                                            as={TextField}
                                            label="Pincode*" disabled
                                            InputLabelProps={{ shrink: true }} size='small' fullWidth
                                            required
                                        />
                                    </Grid>
                                </Grid>
                                <h3 className={styles.mainHeading}>Contact Information</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={2.4}>
                                        <Field
                                            name="contactPerson"
                                            as={TextField} disabled
                                            label="Contact Person*"
                                            InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2.4}>
                                        <Field
                                            name="phoneNumber" disabled
                                            as={TextField}
                                            inputProps={{
                                                maxLength: 10,
                                                pattern: "[0-9]*",
                                            }}
                                            label="Phone Number*"
                                            InputLabelProps={{ shrink: true }} size='small' fullWidth
                                            type='number'
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2.4}>
                                        <Field
                                            name="email" disabled
                                            as={TextField}
                                            label="Email Address*"
                                            InputLabelProps={{ shrink: true }} size='small' fullWidth
                                        />
                                    </Grid>
                                </Grid>
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
            )}


        </Grid>

    );
};

export default ShipFrom;
