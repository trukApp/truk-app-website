'use client';
import React, { useEffect, useState } from 'react';
import { Field, FormikProps, useFormikContext } from 'formik';
import { Checkbox, FormControlLabel, Grid, TextField, Backdrop, CircularProgress, Typography, Paper, List, ListItem, Collapse } from '@mui/material';
import styles from './CreatePackage.module.css';
import { useGetFilteredLocationsQuery, useGetLocationMasterQuery, useUpdateShipFromDefaultLocationIdMutation } from '@/api/apiSlice';
import { Location } from '../MasterDataComponents/Locations';

// interface ShipFromProps {
//     onNext: (values: IShipFrom) => void;
//     onBack: () => void;
// }
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

interface CreatePackageFormValues {
    shipFrom: IShipFrom;
}



const ShipFrom: React.FC = () => {
    const { values, setFieldValue, touched, errors, handleBlur, setFieldTouched, } = useFormikContext<CreatePackageFormValues>();
    const { data: locationsData, isLoading: isLocationLoading } = useGetLocationMasterQuery([])
    const [updateDefulatFromLocation, { isLoading: defaultLocationLoading }] = useUpdateShipFromDefaultLocationIdMutation();
    const allLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    // const billToReduxValues = useAppSelector((state) => state.auth.packageBillTo)
    const defaultLocationData = allLocations?.find((eachLocation: Location) => eachLocation?.def_ship_from === 1)
    const defaultLocationDataInputText = defaultLocationData
        ? `${defaultLocationData.loc_ID},${defaultLocationData.loc_desc}, ${defaultLocationData.city}, ${defaultLocationData.state}, ${defaultLocationData.pincode}`
        : '';

    const [searchKey, setSearchKey] = useState(values.shipFrom?.locationId || defaultLocationDataInputText || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { data: filteredLocations, isLoading: filteredLocationLoading } = useGetFilteredLocationsQuery(searchKey.length >= 3 ? searchKey : null, { skip: searchKey.length < 3 });

    const displayLocations = searchKey ? filteredLocations?.results || [] : allLocations;

    const [showMore, setShowMore] = useState(false);
    const shipFromLocationIdData = values?.shipFrom.locationId
    const shipFromLocationId = shipFromLocationIdData?.split(',')[0] ?? '';
    const getAllLocations = displayLocations.filter(
        (location: Location) => location.loc_ID !== shipFromLocationId
    );


    useEffect(() => {
        if (defaultLocationData) {
            setFieldValue("shipFrom.locationId", defaultLocationData.loc_ID || "");
            setFieldValue("shipFrom.locationDescription", defaultLocationData.loc_desc || "");
            setFieldValue("shipFrom.addressLine1", defaultLocationData.address_1 || "");
            setFieldValue("shipFrom.addressLine2", defaultLocationData.address_2 || "");
            setFieldValue("shipFrom.city", defaultLocationData.city || "");
            setFieldValue("shipFrom.state", defaultLocationData.state || "");
            setFieldValue("shipFrom.country", defaultLocationData.country || "");
            setFieldValue("shipFrom.pincode", defaultLocationData.pincode || "");
            setFieldValue("shipFrom.latitude", defaultLocationData.latitude || "");
            setFieldValue("shipFrom.longitude", defaultLocationData.longitude || "");
            setFieldValue("shipFrom.timeZone", defaultLocationData.time_zone || "");
            setFieldValue("shipFrom.locationType", defaultLocationData.loc_type || "");
            setFieldValue("shipFrom.glnCode", defaultLocationData.gln_code || "");
            setFieldValue("shipFrom.iataCode", defaultLocationData.iata_code || "");
            setFieldValue("shipFrom.contactPerson", defaultLocationData.contact_name || "");
            setFieldValue("shipFrom.phoneNumber", defaultLocationData.contact_phone_number || "");
            setFieldValue("shipFrom.email", defaultLocationData.contact_email || "");
            setFieldValue("shipFrom.saveAsDefaultShipFromLocation", defaultLocationData.def_ship_from || false);
        }
    }, [defaultLocationData, setFieldValue])

    const handleLocationChange = (
        selectedLocationId: string,
        setFieldValue: FormikProps<CreatePackageFormValues>['setFieldValue']
    ) => {
        setFieldValue("shipFrom.locationId", selectedLocationId);

        const selectedLocation = getAllLocations.find(
            (loc: Location) => loc?.loc_ID === selectedLocationId
        );

        if (selectedLocation) {
            setFieldValue("shipFrom.locationId", selectedLocationId);
            setFieldValue("shipFrom.locationDescription", selectedLocation.loc_desc || "");
            setFieldValue("shipFrom.addressLine1", selectedLocation.address_1 || "");
            setFieldValue("shipFrom.addressLine2", selectedLocation.address_2 || "");
            setFieldValue("shipFrom.city", selectedLocation.city || "");
            setFieldValue("shipFrom.state", selectedLocation.state || "");
            setFieldValue("shipFrom.country", selectedLocation.country || "");
            setFieldValue("shipFrom.pincode", selectedLocation.pincode || "");
            setFieldValue("shipFrom.latitude", selectedLocation.latitude || "");
            setFieldValue("shipFrom.longitude", selectedLocation.longitude || "");
            setFieldValue("shipFrom.timeZone", selectedLocation.time_zone || "");
            setFieldValue("shipFrom.locationType", selectedLocation.loc_type || "");
            setFieldValue("shipFrom.glnCode", selectedLocation.gln_code || "");
            setFieldValue("shipFrom.iataCode", selectedLocation.iata_code || "");
            setFieldValue("shipFrom.contactPerson", selectedLocation.contact_name || "");
            setFieldValue("shipFrom.phoneNumber", selectedLocation.contact_phone_number || "");
            setFieldValue("shipFrom.email", selectedLocation.contact_email || "");
            setFieldValue("shipFrom.saveAsDefaultShipFromLocation", selectedLocation.def_ship_from || false);
        } else {
            // Reset values if location is not found
            setFieldValue("shipFrom.locationId", "");
            setFieldValue("shipFrom.locationDescription", "");
            setFieldValue("shipFrom.addressLine1", "");
            setFieldValue("shipFrom.addressLine2", "");
            setFieldValue("shipFrom.city", "");
            setFieldValue("shipFrom.state", "");
            setFieldValue("shipFrom.country", "");
            setFieldValue("shipFrom.pincode", "");
            setFieldValue("shipFrom.latitude", "");
            setFieldValue("shipFrom.longitude", "");
            setFieldValue("shipFrom.timeZone", "");
            setFieldValue("shipFrom.locationType", "");
            setFieldValue("shipFrom.glnCode", "");
            setFieldValue("shipFrom.iataCode", "");
            setFieldValue("shipFrom.contactPerson", "");
            setFieldValue("shipFrom.phoneNumber", "");
            setFieldValue("shipFrom.email", "");
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
            <Backdrop
                sx={{
                    color: "#ffffff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isLocationLoading || defaultLocationLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container spacing={2} className={styles.formsBgContainer}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 3, marginLeft: "15px" }}>Ship From Details</Typography>
                <Grid item xs={12} sx={{ display: 'flex', flexDirection: { md: "row", xs: "column" }, gap: { md: '20px', xs: '2px' } }}>
                    {values?.shipFrom?.saveAsNewLocationId ? null : (
                        <FormControlLabel
                            control={<Field name="shipFrom.saveAsDefaultShipFromLocation" type="checkbox" as={Checkbox} />}
                            label="Save as Default Ship From Location"
                            onChange={() => {
                                setFieldValue('shipFrom.saveAsDefaultShipFromLocation', !values.shipFrom?.saveAsDefaultShipFromLocation);
                                setFieldValue('shipFrom.saveAsNewLocationId', false);
                                if (values.shipFrom?.locationId) {
                                    console.log("values.locationId change: ")
                                    handleDefaultLocationChange(values?.shipFrom.locationId, !values.shipFrom.saveAsDefaultShipFromLocation)
                                }
                            }}
                        />
                    )}
                </Grid>
                <Grid container spacing={2} className={styles.formsBgContainer}>
                    <h3 className={styles.mainHeading}>Location Details</h3>
                    <Grid container spacing={2}>
                        {!values.shipFrom?.saveAsNewLocationId && (
                            <Grid item xs={12} sm={6} md={2.4}>
                                <TextField
                                    fullWidth
                                    name="shipFrom.locationId"
                                    size="small"
                                    label="Search Location"
                                    onFocus={() => {
                                        if (!searchKey) {
                                            setSearchKey(values?.shipFrom.locationId || "");
                                            setShowSuggestions(true);
                                        }
                                    }}
                                    onChange={(e) => {
                                        setSearchKey(e.target.value)
                                        setShowSuggestions(true)
                                        setFieldValue("shipFrom.locationDescription", "");
                                        setFieldValue("shipFrom.addressLine1", "");
                                        setFieldValue("shipFrom.addressLine2", "");
                                        setFieldValue("shipFrom.city", "");
                                        setFieldValue("shipFrom.state", "");
                                        setFieldValue("shipFrom.country", "");
                                        setFieldValue("shipFrom.pincode", "");
                                        setFieldValue("shipFrom.latitude", "");
                                        setFieldValue("shipFrom.longitude", "");
                                        setFieldValue("shipFrom.timeZone", "");
                                        setFieldValue("shipFrom.locationType", "");
                                        setFieldValue("shipFrom.glnCode", "");
                                        setFieldValue("shipFrom.iataCode", "");
                                        setFieldValue("shipFrom.contactPerson", "");
                                        setFieldValue("shipFrom.phoneNumber", "");
                                        setFieldValue("shipFrom.email", "");
                                    }
                                    }
                                    onBlur={handleBlur}
                                    value={searchKey} // Display the selected location ID
                                    error={touched?.shipFrom?.locationId && Boolean(errors?.shipFrom?.locationId)}
                                    helperText={
                                        touched?.shipFrom?.locationId && typeof errors?.shipFrom?.locationId === "string"
                                            ? errors.shipFrom?.locationId
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
                                                        // onClick={() => {
                                                        //     setShowSuggestions(false);
                                                        //     const selectedDisplay = `${location.loc_ID},${location?.loc_desc}, ${location.city}, ${location.state}, ${location.pincode}`;
                                                        //     setSearchKey(selectedDisplay);
                                                        //     // setSearchKey(location.loc_ID);
                                                        //     handleLocationChange(location.loc_ID, setFieldValue);
                                                        //     setFieldValue("locationId", selectedDisplay);
                                                        // }}
                                                        onClick={() => {
                                                            setShowSuggestions(false);

                                                            const selectedDisplay = `${location.loc_ID},${location?.loc_desc}, ${location.city}, ${location.state}, ${location.pincode}`;

                                                            // UI value
                                                            setSearchKey(selectedDisplay);

                                                            // Update Formik values
                                                            handleLocationChange(location.loc_ID, setFieldValue);

                                                            // ✅ CRITICAL FIX — clear validation state
                                                            setFieldTouched("shipFrom.locationId", false, false);
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
                                                No Results Found
                                            </Typography>
                                        )}
                                    </Paper>
                                )}

                            </Grid>
                        )}

                        <Grid item xs={12} md={2.4}>
                            <Field
                                name="shipFrom.locationDescription"
                                as={TextField}
                                disabled={!values.shipFrom?.saveAsNewLocationId}
                                label="Location Description*"
                                InputLabelProps={{ shrink: true }} size='small' fullWidth
                                error={touched?.shipFrom?.locationDescription && Boolean(errors?.shipFrom?.locationDescription)}
                                helperText={touched?.shipFrom?.locationDescription && errors?.shipFrom?.locationDescription}
                            />
                        </Grid>
                        <Grid item xs={12} md={2.4} sx={{ textAlign: "center", marginTop: "10px", marginLeft: "-50px" }}>
                            <Typography
                                sx={{
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                                onClick={() => setShowMore(!showMore)}
                            >
                                {showMore ? "Hide Details ↑" : "More Details ↓"}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Collapse in={showMore}>
                        <Grid spacing={2} container marginTop={5}>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.latitude"
                                    as={TextField}
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                    label="Latitude*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipFrom?.latitude && Boolean(errors?.shipFrom?.latitude)}
                                    helperText={touched?.shipFrom?.latitude && errors?.shipFrom?.latitude}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.longitude"
                                    as={TextField}
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                    label="Longitude*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipFrom?.longitude && Boolean(errors?.shipFrom?.longitude)}
                                    helperText={touched?.shipFrom?.longitude && errors?.shipFrom?.longitude}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.timeZone"
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Time Zone"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.locationType"
                                    as={TextField}
                                    label="Location Type"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipFrom?.locationType && Boolean(errors?.shipFrom?.locationType)}
                                    helperText={touched?.shipFrom?.locationType && errors?.shipFrom?.locationType}
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.glnCode"
                                    as={TextField}
                                    label="GLN Code"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipFrom?.glnCode && Boolean(errors?.shipFrom?.glnCode)}
                                    helperText={touched?.shipFrom?.glnCode && errors?.shipFrom?.glnCode}
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.iataCode"
                                    as={TextField}
                                    label="IATA Code"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipFrom?.iataCode && Boolean(errors?.shipFrom?.iataCode)}
                                    helperText={touched?.shipFrom?.iataCode && errors?.shipFrom?.iataCode}
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                />
                            </Grid>

                        </Grid>
                        <h3 className={styles.mainHeading}>Address Information</h3>
                        <Grid container spacing={2} marginTop={1}>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.addressLine1"
                                    as={TextField}
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                    label="Address Line 1*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth

                                    error={touched?.shipFrom?.addressLine1 && Boolean(errors?.shipFrom?.addressLine1)}
                                    helperText={touched?.shipFrom?.addressLine1 && errors?.shipFrom?.addressLine1}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.addressLine2"
                                    as={TextField}
                                    label="Address Line 2"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.city"
                                    as={TextField}
                                    label="City*"
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth

                                    error={touched?.shipFrom?.city && Boolean(errors?.shipFrom?.city)}
                                    helperText={touched?.shipFrom?.city && errors?.shipFrom?.city}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.state"
                                    as={TextField}
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                    label="State*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth

                                    error={touched?.shipFrom?.state && Boolean(errors?.shipFrom?.state)}
                                    helperText={touched?.shipFrom?.state && errors?.shipFrom?.state}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.country"
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Country*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipFrom?.country && Boolean(errors?.shipFrom?.country)}
                                    helperText={touched?.shipFrom?.country && errors?.shipFrom?.country}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.pincode"
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Pincode*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipFrom?.pincode && Boolean(errors?.shipFrom?.pincode)}
                                    helperText={touched?.shipFrom?.pincode && errors?.shipFrom?.pincode}
                                />
                            </Grid>
                        </Grid>
                        <h3 className={styles.mainHeading}>Contact Information</h3>
                        <Grid container spacing={2} marginTop={1}>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.contactPerson"
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Contact Person*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipFrom?.contactPerson && Boolean(errors?.shipFrom?.contactPerson)}
                                    helperText={touched?.shipFrom?.contactPerson && errors?.shipFrom?.contactPerson}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.phoneNumber"
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Phone Number*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    type='number'
                                    error={touched?.shipFrom?.phoneNumber && Boolean(errors?.shipFrom?.phoneNumber)}
                                    helperText={touched?.shipFrom?.phoneNumber && errors?.shipFrom?.phoneNumber}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipFrom.email"
                                    disabled={!values.shipFrom?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Email Address*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth

                                    error={touched?.shipFrom?.email && Boolean(errors?.shipFrom?.email)}
                                    helperText={touched?.shipFrom?.email && errors?.shipFrom?.email}
                                />
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
            </Grid>
        </Grid>

    );
};

export default ShipFrom;
