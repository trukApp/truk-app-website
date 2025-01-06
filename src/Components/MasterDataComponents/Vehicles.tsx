"use client";

import React, { useState } from 'react';
import { Formik, Form, } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Grid,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Button,
  Collapse,
} from "@mui/material";
import { DataGridComponent } from "../GridComponent";
import { GridColDef } from "@mui/x-data-grid";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './MasterData.module.css'
import { useGetVehicleMasterQuery } from '@/api/apiSlice';

const units = ["g", "kg", "ton", "cm", "m", "inch"];
interface FormValues {
  locationId: string;
  timeZone: string;
  unlimitedUsage: boolean;
  individualResources: string | null;
  validityFrom: string;
  validityTo: string;
  vehicleType: string;
  vehicleGroup: string;
  ownership: string;
  payloadWeight: string;
  cubicCapacity: string;
  interiorLength: string;
  interiorWidth: string;
  interiorHeight: string;
  tareWeight: string;
  maxGrossWeight: string;
  tareVolume: string;
  maxLength: string;
  maxWidth: string;
  maxHeight: string;
  platformHeight: string;
  topDeckHeight: string;
  doorWidth: string;
  doorHeight: string;
  doorLength: string;
  avgCost: string;
  downtimeStart: string;
  downtimeEnd: string;
  downtimeLocation: string;
  downtimeDescription: string;
  downtimeReason: string;
}

interface AdditionalDetails {
  cost_per_ton: string;
}

interface Capacity {
  cubic_capacity: string;
  interior_height: string;
  interior_length: string;
  interior_width: string;
  payload_weight: string;
}

interface Downtimes {
  downtime_desc: string;
  downtime_starts_from: string;
  downtime_ends_from: string;
  downtime_location: string;
  reason: string;
}

interface PhysicalProperties {
  max_gross_weight: string;
  max_height: string;
  max_length: string;
  max_width: string;
  tare_volume: string;
  tare_weight: string;
}

interface TransportationDetails {
  ownership: string;
  validity_from: string;
  validity_to: string;
  vehicle_group: string;
  vehicle_type: string;
}

interface VehicleDetails {
  additional_details: AdditionalDetails;
  capacity: Capacity;
  city: string;
  country: string;
  downtimes: Downtimes;
  gln_code: string;
  iata_code: string;
  individual_resource: string;
  latitude: string;
  loc_ID: string;
  loc_desc: string;
  loc_type: string;
  location_id: number;
  longitude: string;
  physical_properties: PhysicalProperties;
  pincode: string;
  state: string;
  time_zone: string;
  transportation_details: TransportationDetails;
  unlimited_usage: number;
  veh_id: number;
  vehicle_ID: string;
}


const downtimeReasons = ['Maintenance', 'Breakdown', 'Inspection', 'Other'];

const validationSchema = Yup.object({
  locationId: Yup.string().required("Location ID is required"),
  timeZone: Yup.string().required("Time Zone is required"),
  unlimitedUsage: Yup.boolean().required("This field is required"),
  validityFrom: Yup.date().required("Validity start date is required"),
  validityTo: Yup.date().required("Validity end date is required"),
  vehicleType: Yup.string().required("Vehicle Type is required"),
  vehicleGroup: Yup.string().required("Vehicle Group is required"),
  ownership: Yup.string().required("Ownership is required"),
  payloadWeight: Yup.number().required("Payload Weight is required"),
  cubicCapacity: Yup.number().required("Cubic Capacity is required"),
  interiorLength: Yup.number().required("Interior Length is required"),
  interiorWidth: Yup.number().required("Interior Width is required"),
  interiorHeight: Yup.number().required("Interior Height is required"),
  tareWeight: Yup.number().required("Tare Weight is required"),
  maxGrossWeight: Yup.number().required("Max Gross Weight is required"),
  tareVolume: Yup.number().required("Tare Volume is required"),
  maxLength: Yup.number().required("Max Length is required"),
  maxWidth: Yup.number().required("Max Width is required"),
  maxHeight: Yup.number().required("Max Height is required"),
  platformHeight: Yup.number(),
  topDeckHeight: Yup.number(),
  doorWidth: Yup.number(),
  doorHeight: Yup.number(),
  doorLength: Yup.number(),
  avgCost: Yup.number()
    .typeError("Average cost must be a number")
    .required("Average cost of transportation is required"),
  downtimeStart: Yup.date().required("Downtime Start is required"),
  downtimeEnd: Yup.date().required("Downtime End is required"),
  downtimeLocation: Yup.string().required("Downtime Location is required"),
  downtimeDescription: Yup.string().required("Description is required"),
  downtimeReason: Yup.string().required("Reason is required"),
});

// Generate dummy data
// const rows = Array.from({ length: 10 }, (_, id) => ({
//   id,
//   locationId: `LOC-${id + 1}`,
//   timeZone: "UTC+05:30",
//   unlimitedUsage: id % 2 === 0,
//   individualResources: `Resource-${id + 1}`,
//   validityFrom: "2024-01-01",
//   validityTo: "2024-12-31",
//   vehicleType: id % 2 === 0 ? "Truck" : "Van",
//   vehicleGroup: `Group-${id + 1}`,
//   ownership: id % 2 === 0 ? "Owned" : "Leased",
// }));


const VehicleForm: React.FC = () => {
  const { data, error } = useGetVehicleMasterQuery([])
  if (error) {
    console.log("err in loading vehicles data :", error)
  }

  const vehiclesMaster = data?.vehicles
  console.log("all vehicles :", vehiclesMaster)
  const [showForm, setShowForm] = useState(false);
  const initialValues = {
    locationId: "",
    timeZone: "",
    unlimitedUsage: false,
    individualResources: '',
    validityFrom: "",
    validityTo: "",
    vehicleType: "",
    vehicleGroup: "",
    ownership: "",
    payloadWeight: "",
    cubicCapacity: "",
    interiorLength: "",
    interiorWidth: "",
    interiorHeight: "",
    tareWeight: "",
    maxGrossWeight: "",
    tareVolume: "",
    maxLength: "",
    maxWidth: "",
    maxHeight: "",
    platformHeight: "",
    topDeckHeight: "",
    doorWidth: "",
    doorHeight: "",
    doorLength: "",
    avgCost: "",
    downtimeStart: "",
    downtimeEnd: "",
    downtimeLocation: "",
    downtimeDescription: "",
    downtimeReason: "",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = vehiclesMaster?.map((vehicle: VehicleDetails, index: number) => ({
    // id: index, // Unique id for each row
    // locationId: vehicle.location_id,
    // timeZone: vehicle.timeZone,
    // unlimitedUsage: vehicle.unlimited_usage,
    // individualResources: vehicle.individual_resource,
    // validityFrom: vehicle.transportation_details.validity_from,
    // validityTo: vehicle.transportation_details.validity_to,
    // vehicleType: vehicle.transportation_details.vehicle_type,
    // vehicleGroup: vehicle.transportation_details.vehcile_group,
    // ownership: vehicle.transportation_details.ownership,

    // payloadWeight: vehicle?.capacity?.payload_weight,
    // cubicCapacity: vehicle?.capacity?.cubic_capacity,
    // interiorLength: vehicle?.capacity?.interior_length,
    // interiorWidth: vehicle?.capacity?.interior_width,
    // interiorHeight: vehicle?.capacity?.interior_height,

    // tareWeight: vehicle?.physical_properties?.tare_weight,
    // maxGrossWeight: vehicle?.physical_properties?.max_gross_weight,
    // tareVolume: vehicle?.physical_properties?.tare_volumn,
    // maxLength: vehicle?.physical_properties?.max_length,
    // maxWidth: vehicle?.physical_properties?.max_width,
    // maxHeight: vehicle?.physical_properties?.max_height,

    // platformHeight: vehicle.platformHeight,
    // topDeckHeight: vehicle.topDeckHeight,
    // doorWidth: vehicle.doorWidth,
    // doorHeight: vehicle.doorHeight,
    // doorLength: vehicle.doorLength,
    // avgCost: vehicle.avgCost,

    // downtimeStart: vehicle?.downtimes?.downtime_starts_from,
    // downtimeEnd: vehicle?.downtimes?.downtime_ends_from,
    // downtimeLocation: vehicle?.downtimes?.downtime_location,
    // downtimeDescription: vehicle?.downtimes?.downtime_desc,
    // downtimeReason: vehicle?.downtimes?.reason,
    id: index,
    ...vehicle
  }));

  // const columns: GridColDef[] = [
  //   { field: "locationId", headerName: "Location ID", width: 150 },
  //   { field: "timeZone", headerName: "Time Zone", width: 150 },
  //   { field: "unlimitedUsage", headerName: "Unlimited Usage", width: 150, type: "boolean" },
  //   { field: "individualResources", headerName: "Individual Resources", width: 200 },
  //   { field: "validityFrom", headerName: "Validity From", width: 150 },
  //   { field: "validityTo", headerName: "Validity To", width: 150 },
  //   { field: "vehicleType", headerName: "Vehicle Type", width: 150 },
  //   { field: "vehicleGroup", headerName: "Vehicle Group", width: 150 },
  //   { field: "ownership", headerName: "Ownership", width: 150 },
  //   { field: "payloadWeight", headerName: "Payload Weight", width: 150 },
  //   { field: "cubicCapacity", headerName: "Cubic Capacity", width: 150 },
  //   { field: "interiorLength", headerName: "Interior Length", width: 150 },
  //   { field: "interiorWidth", headerName: "Interior Width", width: 150 },
  //   { field: "interiorHeight", headerName: "Interior Height", width: 150 },
  //   { field: "tareWeight", headerName: "Tare Weight", width: 150 },
  //   { field: "maxGrossWeight", headerName: "Max Gross Weight", width: 150 },
  //   { field: "tareVolume", headerName: "Tare Volume", width: 150 },
  //   { field: "maxLength", headerName: "Max Length", width: 150 },
  //   { field: "maxWidth", headerName: "Max Width", width: 150 },
  //   { field: "maxHeight", headerName: "Max Height", width: 150 },
  //   { field: "platformHeight", headerName: "Platform Height", width: 150 },
  //   { field: "topDeckHeight", headerName: "Top Deck Height", width: 150 },
  //   { field: "doorWidth", headerName: "Door Width", width: 150 },
  //   { field: "doorHeight", headerName: "Door Height", width: 150 },
  //   { field: "doorLength", headerName: "Door Length", width: 150 },
  //   { field: "avgCost", headerName: "Average Cost", width: 150 },
  //   { field: "downtimeStart", headerName: "Downtime Start", width: 150 },
  //   { field: "downtimeEnd", headerName: "Downtime End", width: 150 },
  //   { field: "downtimeLocation", headerName: "Downtime Location", width: 200 },
  //   { field: "downtimeDescription", headerName: "Downtime Description", width: 250 },
  //   { field: "downtimeReason", headerName: "Downtime Reason", width: 200 },
  // ];

  const columns: GridColDef[] = [
    { field: "loc_ID", headerName: "Location ID", width: 150 },
    { field: "time_zone", headerName: "Time Zone", width: 150 },
    { field: "unlimited_usage", headerName: "Unlimited Usage", width: 150, type: "boolean" },
    { field: "individual_resource", headerName: "Individual Resources", width: 200 },
    { field: "validity_from", headerName: "Validity From", width: 150 },
    { field: "validity_to", headerName: "Validity To", width: 150 },
    { field: "vehicle_type", headerName: "Vehicle Type", width: 150 },
    { field: "vehicle_group", headerName: "Vehicle Group", width: 150 },
    { field: "ownership", headerName: "Ownership", width: 150 },
    { field: "payload_weight", headerName: "Payload Weight", width: 150 },
    { field: "cubic_capacity", headerName: "Cubic Capacity", width: 150 },
    { field: "interior_length", headerName: "Interior Length", width: 150 },
    { field: "interior_width", headerName: "Interior Width", width: 150 },
    { field: "interior_height", headerName: "Interior Height", width: 150 },
    { field: "tare_weight", headerName: "Tare Weight", width: 150 },
    { field: "max_gross_weight", headerName: "Max Gross Weight", width: 150 },
    { field: "tare_volume", headerName: "Tare Volume", width: 150 },
    { field: "max_length", headerName: "Max Length", width: 150 },
    { field: "max_width", headerName: "Max Width", width: 150 },
    { field: "max_height", headerName: "Max Height", width: 150 },
    { field: "latitude", headerName: "Latitude", width: 150 },
    { field: "longitude", headerName: "Longitude", width: 150 },
    { field: "platform_height", headerName: "Platform Height", width: 150 },
    { field: "top_deck_height", headerName: "Top Deck Height", width: 150 },
    { field: "door_width", headerName: "Door Width", width: 150 },
    { field: "door_height", headerName: "Door Height", width: 150 },
    { field: "downtime_starts_from", headerName: "Downtime Start", width: 150 },
    { field: "downtime_ends_from", headerName: "Downtime End", width: 150 },
    { field: "downtime_location", headerName: "Downtime Location", width: 200 },
    { field: "downtime_desc", headerName: "Downtime Description", width: 250 },
    { field: "reason", headerName: "Downtime Reason", width: 200 },
    { field: "avg_cost", headerName: "Average Cost", width: 150 },
    { field: "state", headerName: "State", width: 150 },
    { field: "city", headerName: "City", width: 150 },
    { field: "country", headerName: "Country", width: 150 },
    { field: "pincode", headerName: "Pincode", width: 150 },
    { field: "loc_desc", headerName: "Location Description", width: 200 },
    { field: "loc_type", headerName: "Location Type", width: 150 },
    { field: "gln_code", headerName: "GLN Code", width: 150 },
    { field: "iata_code", headerName: "IATA Code", width: 150 },
  ];


  const handleSubmit = (values: FormValues) => {
    console.log("Form submitted with values:", values);
  };

  return (
    <>
      <Box >

        <Typography align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '20px', md: '24px' } }} gutterBottom>
          Vehicle master
        </Typography>
        <Box display="flex" justifyContent="flex-end" >
          <Button
            variant="contained"
            onClick={() => setShowForm((prev) => !prev)}
            className={styles.createButton}
          >
            Create Vehicle
            {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 4 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />}
          </Button>
        </Box>

        <Collapse in={showForm}>
          <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form>
                  <Grid>
                    {/* General Data */}
                    <Typography variant="h6" mt={1} mb={1}>1. General Data</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                          fullWidth
                          // label="Vehicle ID (Auto Generated)"
                          value="Vehicle ID (Auto-Generated)"
                          disabled
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                          fullWidth
                          label="Location ID"
                          name="locationId"
                          value={values.locationId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.locationId && Boolean(errors.locationId)}
                          helperText={touched.locationId && errors.locationId}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                          fullWidth
                          label="Time Zone"
                          name="timeZone"
                          value={values.timeZone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.timeZone && Boolean(errors.timeZone)}
                          helperText={touched.timeZone && errors.timeZone}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={values.unlimitedUsage}
                              onChange={(e) =>
                                handleChange({
                                  target: {
                                    name: "unlimitedUsage",
                                    value: e.target.checked,
                                  },
                                })
                              }
                            />
                          }
                          label="Unlimited Usage"
                        />
                      </Grid>
                      {!values.unlimitedUsage && (
                        <Grid item xs={12} sm={6} md={2.4}>
                          <TextField
                            fullWidth
                            label="Individual Resources"
                            name="individualResources"
                            type="number"
                            value={values.individualResources}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.individualResources &&
                              Boolean(errors.individualResources)
                            }
                            helperText={
                              touched.individualResources &&
                              errors.individualResources
                            }
                            size="small"
                          />
                        </Grid>
                      )}
                    </Grid>

                    {/* Transportation Details */}
                    <Typography variant="h6" mt={3} mb={1}>
                      2. Transportation Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                          fullWidth
                          label="Validity From"
                          name="validityFrom"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={values.validityFrom}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.validityFrom && Boolean(errors.validityFrom)}
                          helperText={touched.validityFrom && errors.validityFrom}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                          fullWidth
                          label="Validity To"
                          name="validityTo"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={values.validityTo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.validityTo && Boolean(errors.validityTo)}
                          helperText={touched.validityTo && errors.validityTo}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                          select
                          fullWidth
                          label="Vehicle Type"
                          name="vehicleType"
                          value={values.vehicleType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.vehicleType && Boolean(errors.vehicleType)}
                          helperText={touched.vehicleType && errors.vehicleType}
                          size="small"
                        >
                          <MenuItem value="Truck">Truck</MenuItem>
                          <MenuItem value="Trailer">Trailer</MenuItem>
                          <MenuItem value="Container">Container</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                          fullWidth
                          label="Vehicle Group"
                          name="vehicleGroup"
                          value={values.vehicleGroup}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.vehicleGroup && Boolean(errors.vehicleGroup)}
                          helperText={touched.vehicleGroup && errors.vehicleGroup}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                          select
                          fullWidth
                          label="Ownership"
                          name="ownership"
                          value={values.ownership}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.ownership && Boolean(errors.ownership)}
                          helperText={touched.ownership && errors.ownership}
                          size="small"
                        >
                          <MenuItem value="Self">Self</MenuItem>
                          <MenuItem value="Carrier">Carrier</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>

                    {/* Capacity */}
                    <Typography variant="h6" mt={3} mb={1}>
                      3. Capacity
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={1.6}>
                        <TextField
                          fullWidth
                          label="Payload Weight"
                          name="payloadWeight"
                          type="number"
                          value={values.payloadWeight}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.payloadWeight && Boolean(errors.payloadWeight)}
                          helperText={touched.payloadWeight && errors.payloadWeight}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={0.8}>
                        <TextField
                          fullWidth
                          select
                          defaultValue={units[0]}

                          size="small"
                        >
                          {units.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Cubic Capacity */}
                      <Grid item xs={12} sm={6} md={1.6}>
                        <TextField
                          fullWidth
                          label="Cubic Capacity"
                          name="cubicCapacity"
                          type="number"
                          value={values.cubicCapacity}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.cubicCapacity && Boolean(errors.cubicCapacity)
                          }
                          helperText={touched.cubicCapacity && errors.cubicCapacity}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={0.8}>
                        <TextField
                          fullWidth
                          select defaultValue={units[0]}

                          size="small"
                        >
                          {units.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Interior Length */}
                      <Grid item xs={12} sm={6} md={1.6}>
                        <TextField
                          fullWidth
                          label="Interior Length"
                          name="interiorLength"
                          type="number"
                          value={values.interiorLength}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.interiorLength && Boolean(errors.interiorLength)
                          }
                          helperText={touched.interiorLength && errors.interiorLength}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={0.8}>
                        <TextField
                          fullWidth
                          select

                          name="interiorLengthUoM" defaultValue={units[0]}
                          // value={values.interiorLengthUoM || ""}
                          onChange={handleChange}
                          size="small"
                        >
                          {units.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Interior Width */}
                      <Grid item xs={12} sm={6} md={1.6}>
                        <TextField
                          fullWidth
                          label="Interior Width"
                          name="interiorWidth"
                          type="number"
                          value={values.interiorWidth}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.interiorWidth && Boolean(errors.interiorWidth)
                          }
                          helperText={touched.interiorWidth && errors.interiorWidth}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={0.8}>
                        <TextField
                          fullWidth
                          select

                          name="interiorWidthUoM" defaultValue={units[0]}
                          // value={values.interiorWidthUoM || ""}
                          onChange={handleChange}
                          size="small"
                        >
                          {units.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Interior Height */}
                      <Grid item xs={12} sm={6} md={1.6}>
                        <TextField
                          fullWidth
                          label="Interior Height"
                          name="interiorHeight"
                          type="number"
                          value={values.interiorHeight}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.interiorHeight && Boolean(errors.interiorHeight)
                          }
                          helperText={touched.interiorHeight && errors.interiorHeight}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={0.8}>
                        <TextField
                          fullWidth
                          select

                          name="interiorHeightUoM" defaultValue={units[0]}
                          // value={values.interiorHeightUoM || ""}
                          onChange={handleChange}
                          size="small"
                        >
                          {units.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>

                    {/* Physical Properties */}
                    <Typography variant="h6" mt={3} mb={1}>
                      4. Physical Properties
                    </Typography>
                    <Grid container spacing={2}>
                      {/* Tare Weight */}
                      <Grid item xs={12} sm={6} md={1.6}>
                        <TextField
                          fullWidth
                          label="Tare Weight"
                          name="tareWeight"
                          type="number"
                          value={values.tareWeight}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.tareWeight && Boolean(errors.tareWeight)}
                          helperText={touched.tareWeight && errors.tareWeight}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={0.8}>
                        <TextField
                          fullWidth
                          select

                          name="tareWeightUoM" defaultValue={units[0]}
                          // value={values.tareWeightUoM || ""}
                          onChange={handleChange}
                          size="small"
                        >
                          {units.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Max. Gross Weight */}
                      <Grid item xs={12} sm={6} md={1.6}>
                        <TextField
                          fullWidth
                          label="Max. Gross Weight"
                          name="maxGrossWeight"
                          type="number"
                          value={values.maxGrossWeight}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.maxGrossWeight && Boolean(errors.maxGrossWeight)
                          }
                          helperText={
                            touched.maxGrossWeight && errors.maxGrossWeight
                          }
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={0.8}>
                        <TextField
                          fullWidth
                          select

                          name="maxGrossWeightUoM" defaultValue={units[0]}
                          // value={values.maxGrossWeightUoM || ""}
                          onChange={handleChange}
                          size="small"
                        >
                          {units.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Tare Volume */}
                      <Grid item xs={12} sm={6} md={1.6}>
                        <TextField
                          fullWidth
                          label="Tare Volume"
                          name="tareVolume"
                          type="number"
                          value={values.tareVolume}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.tareVolume && Boolean(errors.tareVolume)}
                          helperText={touched.tareVolume && errors.tareVolume}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={0.8}>
                        <TextField
                          fullWidth
                          select

                          name="tareVolumeUoM" defaultValue={units[0]}
                          // value={values.tareVolumeUoM || ""}
                          onChange={handleChange}
                          size="small"
                        >
                          {units.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Max. Length */}
                      <Grid item xs={12} sm={6} md={1.6}>
                        <TextField
                          fullWidth
                          label="Max. Length"
                          name="maxLength"
                          type="number"
                          value={values.maxLength}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.maxLength && Boolean(errors.maxLength)}
                          helperText={touched.maxLength && errors.maxLength}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={0.8}>
                        <TextField
                          fullWidth
                          select

                          name="maxLengthUoM" defaultValue={units[0]}
                          // value={values.maxLengthUoM || ""}
                          onChange={handleChange}
                          size="small"
                        >
                          {units.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Max. Width */}
                      <Grid item xs={12} sm={6} md={1.6}>
                        <TextField
                          fullWidth
                          label="Max. Width"
                          name="maxWidth"
                          type="number"
                          value={values.maxWidth}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.maxWidth && Boolean(errors.maxWidth)}
                          helperText={touched.maxWidth && errors.maxWidth}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={0.8}>
                        <TextField
                          fullWidth
                          select

                          name="maxWidthUoM" defaultValue={units[0]}
                          // value={values.maxWidthUoM || ""}
                          onChange={handleChange}
                          size="small"
                        >
                          {units.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Max. Height */}
                      <Grid item xs={12} sm={6} md={1.6}>
                        <TextField
                          fullWidth
                          label="Max. Height"
                          name="maxHeight"
                          type="number"
                          value={values.maxHeight}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.maxHeight && Boolean(errors.maxHeight)}
                          helperText={touched.maxHeight && errors.maxHeight}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={0.8}>
                        <TextField
                          fullWidth
                          select

                          name="maxHeightUoM" defaultValue={units[0]}
                          // value={values.maxHeightUoM || ""}
                          onChange={handleChange}
                          size="small"
                        >
                          {units.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6} md={1.6}>
                        <TextField
                          fullWidth
                          label="Tare Weight"
                          name="tareWeight"
                          type="number"
                          value={values.tareWeight}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.tareWeight && Boolean(errors.tareWeight)}
                          helperText={touched.tareWeight && errors.tareWeight}
                          size="small"
                        />
                      </Grid>

                      {/* UoM Dropdown */}
                      <Grid item xs={12} sm={6} md={0.8}>
                        <TextField
                          fullWidth
                          select

                          name="tareWeightUoM" defaultValue={units[0]}
                          // value={values.tareWeightUoM || ''}
                          onChange={handleChange}
                          size="small"
                        >
                          {units.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>

                    {/* Downtimes */}
                    <Typography variant="h6" mt={3} mb={1}>
                      5. Downtimes
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                          fullWidth
                          label="Start From"
                          name="downtimeStart"
                          type="datetime-local"
                          InputLabelProps={{ shrink: true }}
                          value={values.downtimeStart}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.downtimeStart && Boolean(errors.downtimeStart)
                          }
                          helperText={touched.downtimeStart && errors.downtimeStart}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                          fullWidth
                          label="Ends At"
                          name="downtimeEnd"
                          type="datetime-local"
                          InputLabelProps={{ shrink: true }}
                          value={values.downtimeEnd}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.downtimeEnd && Boolean(errors.downtimeEnd)}
                          helperText={touched.downtimeEnd && errors.downtimeEnd}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                          fullWidth
                          label="Location"
                          name="downtimeLocation"
                          value={values.downtimeLocation}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.downtimeLocation &&
                            Boolean(errors.downtimeLocation)
                          }
                          helperText={
                            touched.downtimeLocation && errors.downtimeLocation
                          }
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                          fullWidth
                          label="Description"
                          name="downtimeDescription"
                          value={values.downtimeDescription}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.downtimeDescription && Boolean(errors.downtimeDescription)}
                          helperText={touched.downtimeDescription && errors.downtimeDescription}
                          size="small"
                        />
                      </Grid>

                      {/* Reason */}
                      <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                          fullWidth
                          select
                          label="Reason"
                          name="downtimeReason"
                          value={values.downtimeReason}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.downtimeReason && Boolean(errors.downtimeReason)}
                          helperText={touched.downtimeReason && errors.downtimeReason}
                          size="small"
                        >
                          {downtimeReasons.map((reason) => (
                            <MenuItem key={reason} value={reason}>
                              {reason}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>

                    {/* Additional Details */}
                    <Typography variant="h5" mt={3}>
                      6. Additional Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                          fullWidth
                          label="Avg. Cost of Transportation (Price Per Ton)"
                          name="avgCost"
                          type="number"
                          value={values.avgCost}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.avgCost && Boolean(errors.avgCost)}
                          helperText={touched.avgCost && errors.avgCost}
                          size="small"
                        />
                      </Grid>
                    </Grid>


                    <Box mt={3} textAlign='center'>
                      <Button variant="contained" color="primary" type="submit">
                        Submit
                      </Button>
                    </Box>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Collapse>

      </Box>

      {/* Data grid */}
      <div style={{ marginTop: "40px" }}>
        <DataGridComponent
          columns={columns}
          rows={rows}
          isLoading={false} // Set true to show loading state
          pageSizeOptions={[10, 20, 30]} // Optional: customize page size options
          initialPageSize={10} // Optional: default page size
        />
      </div>

    </>
  );
};

export default VehicleForm;
