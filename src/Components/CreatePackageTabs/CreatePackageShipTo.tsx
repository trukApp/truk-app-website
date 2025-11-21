'use client';
import React, { useEffect, useState } from 'react';
import { Field, FormikProps, useFormikContext } from 'formik';
import { Checkbox, FormControlLabel, Grid, TextField, Backdrop, CircularProgress, Typography, Paper, List, ListItem, MenuItem, Collapse } from '@mui/material';
import styles from './CreatePackage.module.css';
import { useGetFilteredLocationsQuery, useGetLocationMasterQuery, useUpdateShipToDefaultLocationIdMutation } from '@/api/apiSlice';
import { Location } from '../MasterDataComponents/Locations';

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
    destination_radius?: number | string;
    destination_radius_unit?: string;
    shipTolocationId?: string;
}

interface CreatePackageFormValues {
    shipTo: IShipFrom;
}

const ShipTo: React.FC = () => {
    const { values, setFieldValue, touched, errors, handleBlur } = useFormikContext<CreatePackageFormValues>();
    const { data: locationsData, isLoading: isLocationLoading } = useGetLocationMasterQuery([])
    const [updateDefulatFromLocation, { isLoading: defaultLocationLoading }] = useUpdateShipToDefaultLocationIdMutation();
    const allLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    // const billToReduxValues = useAppSelector((state) => state.auth.packageBillTo)
    const defaultLocationData = allLocations?.find((eachLocation: Location) => eachLocation?.def_ship_to === 1)
    const defaultLocationDataInputText = defaultLocationData
        ? `${defaultLocationData.loc_ID},${defaultLocationData.loc_desc}, ${defaultLocationData.city}, ${defaultLocationData.state}, ${defaultLocationData.pincode}`
        : '';

    const [searchKey, setSearchKey] = useState(values.shipTo?.locationId || defaultLocationDataInputText || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { data: filteredLocations, isLoading: filteredLocationLoading } = useGetFilteredLocationsQuery(searchKey.length >= 3 ? searchKey : null, { skip: searchKey.length < 3 });
    const displayLocations = searchKey ? filteredLocations?.results || [] : allLocations;

    const [showMore, setShowMore] = useState(false);
    const shipFromLocationIdData = values?.shipTo?.shipTolocationId
    const shipFromLocationId = shipFromLocationIdData?.split(',')[0] ?? '';
    const getAllLocations = displayLocations.filter(
        (location: Location) => location.loc_ID !== shipFromLocationId
    );


    useEffect(() => {
        if (defaultLocationData) {
            setFieldValue("shipTo.locationId", defaultLocationData.loc_ID || "");
            setFieldValue("shipTo.locationDescription", defaultLocationData.loc_desc || "");
            setFieldValue("shipTo.addressLine1", defaultLocationData.address_1 || "");
            setFieldValue("shipTo.addressLine2", defaultLocationData.address_2 || "");
            setFieldValue("shipTo.city", defaultLocationData.city || "");
            setFieldValue("shipTo.state", defaultLocationData.state || "");
            setFieldValue("shipTo.country", defaultLocationData.country || "");
            setFieldValue("shipTo.pincode", defaultLocationData.pincode || "");
            setFieldValue("shipTo.latitude", defaultLocationData.latitude || "");
            setFieldValue("shipTo.longitude", defaultLocationData.longitude || "");
            setFieldValue("shipTo.timeZone", defaultLocationData.time_zone || "");
            setFieldValue("shipTo.locationType", defaultLocationData.loc_type || "");
            setFieldValue("shipTo.glnCode", defaultLocationData.gln_code || "");
            setFieldValue("shipTo.iataCode", defaultLocationData.iata_code || "");
            setFieldValue("shipTo.contactPerson", defaultLocationData.contact_name || "");
            setFieldValue("shipTo.phoneNumber", defaultLocationData.contact_phone_number || "");
            setFieldValue("shipTo.email", defaultLocationData.contact_email || "");
            setFieldValue("shipTo.saveAsDefaultShipFromLocation", defaultLocationData.def_ship_to || false);
        }
    }, [defaultLocationData, setFieldValue])

    const handleLocationChange = (
        selectedLocationId: string,
        setFieldValue: FormikProps<CreatePackageFormValues>['setFieldValue']
    ) => {
        setFieldValue("shipTo.shipTolocationId", selectedLocationId);

        const selectedLocation = getAllLocations.find(
            (loc: Location) => loc?.loc_ID === selectedLocationId
        );

        if (selectedLocation) {
            setFieldValue("shipTo.shipTolocationDescription", selectedLocation.loc_desc || "");
            setFieldValue("shipTo.shipToaddressLine1", selectedLocation.address_1 || "");
            setFieldValue("shipTo.shipToaddressLine2", selectedLocation.address_2 || "");
            setFieldValue("shipTo.shipTocity", selectedLocation.city || "");
            setFieldValue("shipTo.state", selectedLocation.state || "");
            setFieldValue("shipTo.country", selectedLocation.country || "");
            setFieldValue("shipTo.pincode", selectedLocation.pincode || "");
            setFieldValue("shipTo.latitude", selectedLocation.latitude || "");
            setFieldValue("shipTo.longitude", selectedLocation.longitude || "");
            setFieldValue("shipTo.timeZone", selectedLocation.time_zone || "");
            setFieldValue("shipTo.locationType", selectedLocation.loc_type || "");
            setFieldValue("shipTo.glnCode", selectedLocation.gln_code || "");
            setFieldValue("shipTo.iataCode", selectedLocation.iata_code || "");
            setFieldValue("shipTo.contactPerson", selectedLocation.contact_name || "");
            setFieldValue("shipTo.phoneNumber", selectedLocation.contact_phone_number || "");
            setFieldValue("shipTo.email", selectedLocation.contact_email || "");
            setFieldValue("shipTo.saveAsDefaultShipFromLocation", selectedLocation.def_ship_to || false);
        } else {
            // Reset values if location is not found
            setFieldValue("shipTo.locationId", "");
            setFieldValue("shipTo.locationDescription", "");
            setFieldValue("shipTo.addressLine1", "");
            setFieldValue("shipTo.addressLine2", "");
            setFieldValue("shipTo.city", "");
            setFieldValue("shipTo.state", "");
            setFieldValue("shipTo.country", "");
            setFieldValue("shipTo.pincode", "");
            setFieldValue("shipTo.latitude", "");
            setFieldValue("shipTo.longitude", "");
            setFieldValue("shipTo.timeZone", "");
            setFieldValue("shipTo.locationType", "");
            setFieldValue("shipTo.glnCode", "");
            setFieldValue("shipTo.iataCode", "");
            setFieldValue("shipTo.contactPerson", "");
            setFieldValue("shipTo.phoneNumber", "");
            setFieldValue("shipTo.email", "");
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
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 3, marginLeft: "15px" }}>Ship to Details</Typography>
                <Grid item xs={12} sx={{ display: 'flex', flexDirection: { md: "row", xs: "column" }, gap: { md: '20px', xs: '2px' } }}>
                    {values?.shipTo?.saveAsNewLocationId ? null : (
                        <FormControlLabel
                            control={<Field name="shipTo.saveAsDefaultShipFromLocation" type="checkbox" as={Checkbox} />}
                            label="Save as Default Ship To Location"
                            onChange={() => {
                                setFieldValue('shipTo.saveAsDefaultShipFromLocation', !values.shipTo?.saveAsDefaultShipFromLocation);
                                setFieldValue('shipTo.saveAsNewLocationId', false);
                                if (values.shipTo?.locationId) {
                                    console.log("values.locationId change: ")
                                    handleDefaultLocationChange(values?.shipTo.locationId, !values.shipTo.saveAsDefaultShipFromLocation)
                                }
                            }}
                        />
                    )}
                </Grid>
                <Grid container spacing={2} className={styles.formsBgContainer}>
                    <h3 className={styles.mainHeading}>Location Details</h3>
                    <Grid container spacing={2}>
                        {!values.shipTo?.saveAsNewLocationId && (
                            <Grid item xs={12} sm={6} md={2.4}>
                                <TextField
                                    fullWidth
                                    name="shipTo.locationId"
                                    size="small"
                                    label="Search Location"
                                    onFocus={() => {
                                        if (!searchKey) {
                                            setSearchKey(values?.shipTo.locationId || "");
                                            setShowSuggestions(true);
                                        }
                                    }}
                                    onChange={(e) => {
                                        setSearchKey(e.target.value)
                                        setShowSuggestions(true)
                                        setFieldValue("shipTo.locationDescription", "");
                                        setFieldValue("shipTo.addressLine1", "");
                                        setFieldValue("shipTo.addressLine2", "");
                                        setFieldValue("shipTo.city", "");
                                        setFieldValue("shipTo.state", "");
                                        setFieldValue("shipTo.country", "");
                                        setFieldValue("shipTo.pincode", "");
                                        setFieldValue("shipTo.latitude", "");
                                        setFieldValue("shipTo.longitude", "");
                                        setFieldValue("shipTo.timeZone", "");
                                        setFieldValue("shipTo.locationType", "");
                                        setFieldValue("shipTo.glnCode", "");
                                        setFieldValue("shipTo.iataCode", "");
                                        setFieldValue("shipTo.contactPerson", "");
                                        setFieldValue("shipTo.phoneNumber", "");
                                        setFieldValue("shipTo.email", "");
                                    }
                                    }
                                    onBlur={handleBlur}
                                    value={searchKey} // Display the selected location ID
                                    error={touched?.shipTo?.locationId && Boolean(errors?.shipTo?.locationId)}
                                    helperText={
                                        touched?.shipTo?.locationId && typeof errors?.shipTo?.locationId === "string"
                                            ? errors.shipTo?.locationId
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
                                                No Results Found
                                            </Typography>
                                        )}
                                    </Paper>
                                )}

                            </Grid>
                        )}

                        <Grid item xs={12} md={2.4}>
                            <Field
                                name="shipTo.locationDescription"
                                as={TextField}
                                disabled={!values.shipTo?.saveAsNewLocationId}
                                label="Location Description*"
                                InputLabelProps={{ shrink: true }} size='small' fullWidth
                                error={touched?.shipTo?.locationDescription && Boolean(errors?.shipTo?.locationDescription)}
                                helperText={touched?.shipTo?.locationDescription && errors?.shipTo?.locationDescription}
                            />
                        </Grid>

                        <Grid item xs={12} md={2.4}>
                            <Grid container spacing={1}>
                                <Grid item xs={7}>
                                    <Field
                                        name="shipTo.destination_radius"
                                        as={TextField}
                                        label="Destination Radius*"
                                        InputLabelProps={{ shrink: true }}
                                        size="small"
                                        fullWidth
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        error={touched?.shipTo?.destination_radius && Boolean(errors?.shipTo?.destination_radius)}
                                        helperText={touched?.shipTo?.destination_radius && errors?.shipTo?.destination_radius}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <Field
                                        name="shipTo.destination_radius_unit"
                                        as={TextField}
                                        select
                                        label="Unit"
                                        // InputLabelProps={{ shrink: true }}
                                        size="small"
                                        fullWidth
                                        error={touched?.shipTo?.destination_radius_unit && Boolean(errors?.shipTo?.destination_radius_unit)}
                                        helperText={touched?.shipTo?.destination_radius_unit && errors?.shipTo?.destination_radius_unit}
                                    >
                                        <MenuItem value="m">Meter</MenuItem>
                                        <MenuItem value="km">Kilometer</MenuItem>
                                    </Field>
                                </Grid>
                            </Grid>
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
                                    name="shipTo.latitude"
                                    as={TextField}
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                    label="Latitude*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipTo?.latitude && Boolean(errors?.shipTo?.latitude)}
                                    helperText={touched?.shipTo?.latitude && errors?.shipTo?.latitude}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipTo.longitude"
                                    as={TextField}
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                    label="Longitude*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipTo?.longitude && Boolean(errors?.shipTo?.longitude)}
                                    helperText={touched?.shipTo?.longitude && errors?.shipTo?.longitude}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipTo.timeZone"
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Time Zone"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipTo.locationType"
                                    as={TextField}
                                    label="Location Type"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipTo?.locationType && Boolean(errors?.shipTo?.locationType)}
                                    helperText={touched?.shipTo?.locationType && errors?.shipTo?.locationType}
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipTo.glnCode"
                                    as={TextField}
                                    label="GLN Code"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipTo?.glnCode && Boolean(errors?.shipTo?.glnCode)}
                                    helperText={touched?.shipTo?.glnCode && errors?.shipTo?.glnCode}
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipTo.iataCode"
                                    as={TextField}
                                    label="IATA Code"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipTo?.iataCode && Boolean(errors?.shipTo?.iataCode)}
                                    helperText={touched?.shipTo?.iataCode && errors?.shipTo?.iataCode}
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                />
                            </Grid>

                        </Grid>
                        <h3 className={styles.mainHeading}>Address Information</h3>
                        <Grid container spacing={2} marginTop={1}>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipTo.addressLine1"
                                    as={TextField}
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                    label="Address Line 1*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth

                                    error={touched?.shipTo?.addressLine1 && Boolean(errors?.shipTo?.addressLine1)}
                                    helperText={touched?.shipTo?.addressLine1 && errors?.shipTo?.addressLine1}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipTo.addressLine2"
                                    as={TextField}
                                    label="Address Line 2"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipTo.city"
                                    as={TextField}
                                    label="City*"
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth

                                    error={touched?.shipTo?.city && Boolean(errors?.shipTo?.city)}
                                    helperText={touched?.shipTo?.city && errors?.shipTo?.city}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipTo.state"
                                    as={TextField}
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                    label="State*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth

                                    error={touched?.shipTo?.state && Boolean(errors?.shipTo?.state)}
                                    helperText={touched?.shipTo?.state && errors?.shipTo?.state}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipTo.country"
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Country*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipTo?.country && Boolean(errors?.shipTo?.country)}
                                    helperText={touched?.shipTo?.country && errors?.shipTo?.country}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipTo.pincode"
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Pincode*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipTo?.pincode && Boolean(errors?.shipTo?.pincode)}
                                    helperText={touched?.shipTo?.pincode && errors?.shipTo?.pincode}
                                />
                            </Grid>
                        </Grid>
                        <h3 className={styles.mainHeading}>Contact Information</h3>
                        <Grid container spacing={2} marginTop={1}>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipTo.contactPerson"
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Contact Person*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.shipTo?.contactPerson && Boolean(errors?.shipTo?.contactPerson)}
                                    helperText={touched?.shipTo?.contactPerson && errors?.shipTo?.contactPerson}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipTo.phoneNumber"
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Phone Number*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    type='number'
                                    error={touched?.shipTo?.phoneNumber && Boolean(errors?.shipTo?.phoneNumber)}
                                    helperText={touched?.shipTo?.phoneNumber && errors?.shipTo?.phoneNumber}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="shipTo.email"
                                    disabled={!values.shipTo?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Email Address*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth

                                    error={touched?.shipTo?.email && Boolean(errors?.shipTo?.email)}
                                    helperText={touched?.shipTo?.email && errors?.shipTo?.email}
                                />
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
            </Grid>
        </Grid>

    );
};

export default ShipTo;
