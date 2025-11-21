'use client';
import React, { useEffect, useState } from 'react';
import { Field, FormikProps, useFormikContext } from 'formik';
import { Checkbox, FormControlLabel, Grid, TextField, Backdrop, CircularProgress, Typography, Paper, List, ListItem, Collapse } from '@mui/material';
import styles from './CreatePackage.module.css';
import { useGetFilteredLocationsQuery, useGetLocationMasterQuery, useUpdateBillToDefaultLocationIdMutation } from '@/api/apiSlice';
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
}

interface CreatePackageFormValues {
    billTo: IShipFrom;
}

const BillTo: React.FC = () => {
    const { values, setFieldValue, touched, errors, handleBlur } = useFormikContext<CreatePackageFormValues>();
    // console.log("Bill to values: ", values)
    const { data: locationsData, isLoading: isLocationLoading } = useGetLocationMasterQuery([])
    const [updateDefulatFromLocation, { isLoading: defaultLocationLoading }] = useUpdateBillToDefaultLocationIdMutation();
    const allLocations = locationsData?.locations.length > 0 ? locationsData?.locations : []
    // const billToReduxValues = useAppSelector((state) => state.auth.packageBillTo)
    const defaultLocationData = allLocations?.find((eachLocation: Location) => eachLocation?.def_bill_to === 1)
    const defaultLocationDataInputText = defaultLocationData
        ? `${defaultLocationData.loc_ID},${defaultLocationData.loc_desc}, ${defaultLocationData.city}, ${defaultLocationData.state}, ${defaultLocationData.pincode}`
        : '';

    const [searchKey, setSearchKey] = useState(values.billTo?.locationId || defaultLocationDataInputText || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { data: filteredLocations, isLoading: filteredLocationLoading } = useGetFilteredLocationsQuery(searchKey.length >= 3 ? searchKey : null, { skip: searchKey.length < 3 });

    const displayLocations = searchKey ? filteredLocations?.results || [] : allLocations;

    const [showMore, setShowMore] = useState(false);
    const shipFromLocationIdData = values?.billTo.locationId
    const shipFromLocationId = shipFromLocationIdData?.split(',')[0] ?? '';
    const getAllLocations = displayLocations.filter(
        (location: Location) => location.loc_ID !== shipFromLocationId
    );

    useEffect(() => {
        if (defaultLocationData) {
            setFieldValue("billTo.locationId", defaultLocationData.loc_ID || "");
            setFieldValue("billTo.locationDescription", defaultLocationData.loc_desc || "");
            setFieldValue("billTo.addressLine1", defaultLocationData.address_1 || "");
            setFieldValue("billTo.addressLine2", defaultLocationData.address_2 || "");
            setFieldValue("billTo.city", defaultLocationData.city || "");
            setFieldValue("billTo.state", defaultLocationData.state || "");
            setFieldValue("billTo.country", defaultLocationData.country || "");
            setFieldValue("billTo.pincode", defaultLocationData.pincode || "");
            setFieldValue("billTo.latitude", defaultLocationData.latitude || "");
            setFieldValue("billTo.longitude", defaultLocationData.longitude || "");
            setFieldValue("billTo.timeZone", defaultLocationData.time_zone || "");
            setFieldValue("billTo.locationType", defaultLocationData.loc_type || "");
            setFieldValue("billTo.glnCode", defaultLocationData.gln_code || "");
            setFieldValue("billTo.iataCode", defaultLocationData.iata_code || "");
            setFieldValue("billTo.contactPerson", defaultLocationData.contact_name || "");
            setFieldValue("billTo.phoneNumber", defaultLocationData.contact_phone_number || "");
            setFieldValue("billTo.email", defaultLocationData.contact_email || "");
            setFieldValue("billTo.saveAsDefaultShipFromLocation", defaultLocationData.def_bill_to || false);
        }
    }, [defaultLocationData, setFieldValue])

    const handleLocationChange = (
        selectedLocationId: string,
        setFieldValue: FormikProps<CreatePackageFormValues>['setFieldValue']
    ) => {
        setFieldValue("billTo.locationId", selectedLocationId);

        const selectedLocation = getAllLocations.find(
            (loc: Location) => loc?.loc_ID === selectedLocationId
        );

        if (selectedLocation) {
            setFieldValue("billTo.locationDescription", selectedLocation.loc_desc || "");
            setFieldValue("billTo.addressLine1", selectedLocation.address_1 || "");
            setFieldValue("billTo.addressLine2", selectedLocation.address_2 || "");
            setFieldValue("billTo.city", selectedLocation.city || "");
            setFieldValue("billTo.state", selectedLocation.state || "");
            setFieldValue("billTo.country", selectedLocation.country || "");
            setFieldValue("billTo.pincode", selectedLocation.pincode || "");
            setFieldValue("billTo.latitude", selectedLocation.latitude || "");
            setFieldValue("billTo.longitude", selectedLocation.longitude || "");
            setFieldValue("billTo.timeZone", selectedLocation.time_zone || "");
            setFieldValue("billTo.locationType", selectedLocation.loc_type || "");
            setFieldValue("billTo.glnCode", selectedLocation.gln_code || "");
            setFieldValue("billTo.iataCode", selectedLocation.iata_code || "");
            setFieldValue("billTo.contactPerson", selectedLocation.contact_name || "");
            setFieldValue("billTo.phoneNumber", selectedLocation.contact_phone_number || "");
            setFieldValue("billTo.email", selectedLocation.contact_email || "");
            setFieldValue("billTo.saveAsDefaultShipFromLocation", selectedLocation.def_bill_to || false);
        } else {
            // Reset values if location is not found
            setFieldValue("billTo.locationId", "");
            setFieldValue("billTo.locationDescription", "");
            setFieldValue("billTo.addressLine1", "");
            setFieldValue("billTo.addressLine2", "");
            setFieldValue("billTo.city", "");
            setFieldValue("billTo.state", "");
            setFieldValue("billTo.country", "");
            setFieldValue("billTo.pincode", "");
            setFieldValue("billTo.latitude", "");
            setFieldValue("billTo.longitude", "");
            setFieldValue("billTo.timeZone", "");
            setFieldValue("billTo.locationType", "");
            setFieldValue("billTo.glnCode", "");
            setFieldValue("billTo.iataCode", "");
            setFieldValue("billTo.contactPerson", "");
            setFieldValue("billTo.phoneNumber", "");
            setFieldValue("billTo.email", "");
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
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 3, marginLeft: "15px" }}>Bill to Details</Typography>
                <Grid item xs={12} sx={{ display: 'flex', flexDirection: { md: "row", xs: "column" }, gap: { md: '20px', xs: '2px' } }}>
                    {values?.billTo?.saveAsNewLocationId ? null : (
                        <FormControlLabel
                            control={<Field name="billTo.saveAsDefaultShipFromLocation" type="checkbox" as={Checkbox} />}
                            label="Save as Default Bill to Location"
                            onChange={() => {
                                setFieldValue('billTo.saveAsDefaultShipFromLocation', !values.billTo?.saveAsDefaultShipFromLocation);
                                setFieldValue('billTo.saveAsNewLocationId', false);
                                if (values.billTo?.locationId) {
                                    handleDefaultLocationChange(values?.billTo.locationId, !values.billTo.saveAsDefaultShipFromLocation)
                                }
                            }}
                        />
                    )}
                </Grid>
                <Grid container spacing={2} className={styles.formsBgContainer}>
                    <h3 className={styles.mainHeading}>Location Details</h3>
                    <Grid container spacing={2}>
                        {!values.billTo?.saveAsNewLocationId && (
                            <Grid item xs={12} sm={6} md={2.4}>
                                <TextField
                                    fullWidth
                                    name="billTo.locationId"
                                    size="small"
                                    label="Search Location"
                                    onFocus={() => {
                                        if (!searchKey) {
                                            setSearchKey(values?.billTo.locationId || "");
                                            setShowSuggestions(true);
                                        }
                                    }}
                                    onChange={(e) => {
                                        setSearchKey(e.target.value)
                                        setShowSuggestions(true)
                                        setFieldValue("billTo.locationDescription", "");
                                        setFieldValue("billTo.addressLine1", "");
                                        setFieldValue("billTo.addressLine2", "");
                                        setFieldValue("billTo.city", "");
                                        setFieldValue("billTo.state", "");
                                        setFieldValue("billTo.country", "");
                                        setFieldValue("billTo.pincode", "");
                                        setFieldValue("billTo.latitude", "");
                                        setFieldValue("billTo.longitude", "");
                                        setFieldValue("billTo.timeZone", "");
                                        setFieldValue("billTo.locationType", "");
                                        setFieldValue("billTo.glnCode", "");
                                        setFieldValue("billTo.iataCode", "");
                                        setFieldValue("billTo.contactPerson", "");
                                        setFieldValue("billTo.phoneNumber", "");
                                        setFieldValue("billTo.email", "");
                                    }
                                    }
                                    onBlur={handleBlur}
                                    value={searchKey} // Display the selected location ID
                                    error={touched?.billTo?.locationId && Boolean(errors?.billTo?.locationId)}
                                    helperText={
                                        touched?.billTo?.locationId && typeof errors?.billTo?.locationId === "string"
                                            ? errors.billTo?.locationId
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
                                name="billTo.locationDescription"
                                as={TextField}
                                disabled={!values.billTo?.saveAsNewLocationId}
                                label="Location Description*"
                                InputLabelProps={{ shrink: true }} size='small' fullWidth
                                error={touched?.billTo?.locationDescription && Boolean(errors?.billTo?.locationDescription)}
                                helperText={touched?.billTo?.locationDescription && errors?.billTo?.locationDescription}
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
                                    name="billTo.latitude"
                                    as={TextField}
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                    label="Latitude*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.billTo?.latitude && Boolean(errors?.billTo?.latitude)}
                                    helperText={touched?.billTo?.latitude && errors?.billTo?.latitude}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="billTo.longitude"
                                    as={TextField}
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                    label="Longitude*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.billTo?.longitude && Boolean(errors?.billTo?.longitude)}
                                    helperText={touched?.billTo?.longitude && errors?.billTo?.longitude}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="billTo.timeZone"
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Time Zone"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="billTo.locationType"
                                    as={TextField}
                                    label="Location Type"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.billTo?.locationType && Boolean(errors?.billTo?.locationType)}
                                    helperText={touched?.billTo?.locationType && errors?.billTo?.locationType}
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="billTo.glnCode"
                                    as={TextField}
                                    label="GLN Code"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.billTo?.glnCode && Boolean(errors?.billTo?.glnCode)}
                                    helperText={touched?.billTo?.glnCode && errors?.billTo?.glnCode}
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="billTo.iataCode"
                                    as={TextField}
                                    label="IATA Code"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.billTo?.iataCode && Boolean(errors?.billTo?.iataCode)}
                                    helperText={touched?.billTo?.iataCode && errors?.billTo?.iataCode}
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                />
                            </Grid>

                        </Grid>
                        <h3 className={styles.mainHeading}>Address Information</h3>
                        <Grid container spacing={2} marginTop={1}>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="billTo.addressLine1"
                                    as={TextField}
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                    label="Address Line 1*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth

                                    error={touched?.billTo?.addressLine1 && Boolean(errors?.billTo?.addressLine1)}
                                    helperText={touched?.billTo?.addressLine1 && errors?.billTo?.addressLine1}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="billTo.addressLine2"
                                    as={TextField}
                                    label="Address Line 2"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="billTo.city"
                                    as={TextField}
                                    label="City*"
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth

                                    error={touched?.billTo?.city && Boolean(errors?.billTo?.city)}
                                    helperText={touched?.billTo?.city && errors?.billTo?.city}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="billTo.state"
                                    as={TextField}
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                    label="State*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth

                                    error={touched?.billTo?.state && Boolean(errors?.billTo?.state)}
                                    helperText={touched?.billTo?.state && errors?.billTo?.state}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="billTo.country"
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Country*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.billTo?.country && Boolean(errors?.billTo?.country)}
                                    helperText={touched?.billTo?.country && errors?.billTo?.country}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="billTo.pincode"
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Pincode*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.billTo?.pincode && Boolean(errors?.billTo?.pincode)}
                                    helperText={touched?.billTo?.pincode && errors?.billTo?.pincode}
                                />
                            </Grid>
                        </Grid>
                        <h3 className={styles.mainHeading}>Contact Information</h3>
                        <Grid container spacing={2} marginTop={1}>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="billTo.contactPerson"
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Contact Person*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    error={touched?.billTo?.contactPerson && Boolean(errors?.billTo?.contactPerson)}
                                    helperText={touched?.billTo?.contactPerson && errors?.billTo?.contactPerson}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="billTo.phoneNumber"
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Phone Number*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth
                                    type='number'
                                    error={touched?.billTo?.phoneNumber && Boolean(errors?.billTo?.phoneNumber)}
                                    helperText={touched?.billTo?.phoneNumber && errors?.billTo?.phoneNumber}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    name="billTo.email"
                                    disabled={!values.billTo?.saveAsNewLocationId}
                                    as={TextField}
                                    label="Email Address*"
                                    InputLabelProps={{ shrink: true }} size='small' fullWidth

                                    error={touched?.billTo?.email && Boolean(errors?.billTo?.email)}
                                    helperText={touched?.billTo?.email && errors?.billTo?.email}
                                />
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
            </Grid>
        </Grid>

    );
};

export default BillTo;
