'use client';

import React from 'react';
import { Box, Button, Grid, TextField, Typography, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { DataGridComponent } from './GridComponent';
import { GridColDef } from '@mui/x-data-grid';

const dummyData = [
  {
    id: 1,
    laneName: 'Lane A',
    origin: 'City 1',
    destination: 'City 2',
    distance: 150,
    time: '2h 30m',
    routeType: 'Highway',
    laneStatus: 'Active',
    pricePerKm: 15,
    tollCharges: 50,
    notes: 'Heavy traffic during peak hours',
  },
  {
    id: 2,
    laneName: 'Lane B',
    origin: 'City 3',
    destination: 'City 4',
    distance: 200,
    time: '3h 15m',
    routeType: 'Expressway',
    laneStatus: 'Inactive',
    pricePerKm: 12,
    tollCharges: 30,
    notes: 'Smooth road conditions',
  },
  {
    id: 3,
    laneName: 'Lane C',
    origin: 'City 5',
    destination: 'City 6',
    distance: 180,
    time: '2h 50m',
    routeType: 'City',
    laneStatus: 'Under Construction',
    pricePerKm: 18,
    tollCharges: 60,
    notes: 'Roadwork in progress',
  },
  {
    id: 4,
    laneName: 'Lane D',
    origin: 'City 7',
    destination: 'City 8',
    distance: 120,
    time: '1h 45m',
    routeType: 'Rural Road',
    laneStatus: 'Active',
    pricePerKm: 10,
    tollCharges: 20,
    notes: 'Scenic route',
  },
  {
    id: 5,
    laneName: 'Lane E',
    origin: 'City 9',
    destination: 'City 10',
    distance: 250,
    time: '4h',
    routeType: 'Highway',
    laneStatus: 'Active',
    pricePerKm: 14,
    tollCharges: 40,
    notes: 'Clear weather conditions',
  },
  {
    id: 6,
    laneName: 'Lane F',
    origin: 'City 11',
    destination: 'City 12',
    distance: 300,
    time: '5h',
    routeType: 'Expressway',

    laneStatus: 'Inactive',
    pricePerKm: 20,
    tollCharges: 100,
    notes: 'Toll charges apply',
  },
  {
    id: 7,
    laneName: 'Lane G',
    origin: 'City 13',
    destination: 'City 14',
    distance: 90,
    time: '1h 20m',
    routeType: 'City',

    laneStatus: 'Active',
    pricePerKm: 8,
    tollCharges: 10,
    notes: 'Frequent stops required',
  },
  {
    id: 8,
    laneName: 'Lane H',
    origin: 'City 15',
    destination: 'City 16',
    distance: 400,
    time: '7h',
    routeType: 'Rural Road',

    laneStatus: 'Under Construction',
    pricePerKm: 25,
    tollCharges: 120,
    notes: 'Long route with delays',
  },
  {
    id: 9,
    laneName: 'Lane I',
    origin: 'City 17',
    destination: 'City 18',
    distance: 350,
    time: '6h',
    routeType: 'Highway',

    laneStatus: 'Active',
    pricePerKm: 16,
    tollCharges: 75,
    notes: 'Checkpoints along the way',
  },
  {
    id: 10,
    laneName: 'Lane J',
    origin: 'City 19',
    destination: 'City 20',
    distance: 50,
    time: '40m',
    routeType: 'City',

    laneStatus: 'Active',
    pricePerKm: 5,
    tollCharges: 0,
    notes: 'Short distance route',
  },
];

const columns: GridColDef[] = [
  { field: 'laneName', headerName: 'Lane Name', width: 150, },
  { field: 'origin', headerName: 'Origin', width: 150, },
  { field: 'destination', headerName: 'Destination', width: 150, },
  { field: 'distance', headerName: 'Distance (km)', type: 'number', width: 150, },
  { field: 'time', headerName: 'Time', width: 150, },
  { field: 'routeType', headerName: 'Route Type', width: 150, },
  { field: 'laneStatus', headerName: 'Lane Status', width: 150, },
  { field: 'pricePerKm', headerName: 'Price per Km', type: 'number', width: 100, },
  { field: 'tollCharges', headerName: 'Toll Charges', type: 'number', width: 100, },
  { field: 'notes', headerName: 'Notes', flex: 2, width: 200, },
];




// Defining types for lane details
interface LaneDetails {
  laneName: string;
  origin: string;
  destination: string;
  distance: string;
  time: string;
  routeType: string;
  laneStatus: string;
  pricePerKm: string;
  tollCharges: string;
  notes: string;
}

// Validation Schema using Yup
const validationSchema = Yup.object({
  laneName: Yup.string().required('Lane Name is required'),
  origin: Yup.string().required('Origin is required'),
  destination: Yup.string().required('Destination is required'),
  distance: Yup.number().required('Distance is required').positive('Distance must be a positive number'),
  time: Yup.string().required('Time is required'),
  routeType: Yup.string().required('Route Type is required'),
  laneStatus: Yup.string().required('Lane Status is required'),
  pricePerKm: Yup.number().required('Price per Km is required').positive('Price must be a positive number'),
  tollCharges: Yup.number().required('Toll Charges are required').positive('Toll Charges must be a positive number'),
  notes: Yup.string().required('Notes are required'),
});

const Lanes: React.FC = () => {
  // Default lane details
  const initialValues: LaneDetails = {
    laneName: '',
    origin: '',
    destination: '',
    distance: '',
    time: '',
    routeType: '',
    laneStatus: '',
    pricePerKm: '',
    tollCharges: '',
    notes: '',
  };

  const routeTypes = ['Highway', 'City', 'Expressway', 'Rural Road'];
  const laneStatusOptions = ['Active', 'Inactive', 'Under Construction'];

  // Form submission handler
  const handleSubmit = (values: LaneDetails) => {
    console.log('lane details :', values);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange, handleBlur, values }) => (
          <Form>
            <Box
              sx={{
                width: '100%',
                padding: '20px',
                boxSizing: 'border-box',
                backgroundColor: '#f9f9f9',
              }}
            >
              <Typography variant="h5" align="center" gutterBottom>
                Lane Details
              </Typography>
              <Grid container spacing={2}>
                {/* Lane Name */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Lane Name"
                    name="laneName"
                    variant="outlined"
                    size="small"
                    error={touched.laneName && Boolean(errors.laneName)}
                    helperText={touched.laneName && errors.laneName}
                  />
                </Grid>

                {/* Origin */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Origin"
                    name="origin"
                    variant="outlined"
                    size="small"
                    error={touched.origin && Boolean(errors.origin)}
                    helperText={touched.origin && errors.origin}
                  />
                </Grid>

                {/* Destination */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Destination"
                    name="destination"
                    variant="outlined"
                    size="small"
                    error={touched.destination && Boolean(errors.destination)}
                    helperText={touched.destination && errors.destination}
                  />
                </Grid>

                {/* Distance */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Distance (km)"
                    name="distance"
                    type="number"
                    variant="outlined"
                    size="small"
                    error={touched.distance && Boolean(errors.distance)}
                    helperText={touched.distance && errors.distance}
                  />
                </Grid>

                {/* Time */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Time"
                    name="time"
                    variant="outlined"
                    size="small"
                    error={touched.time && Boolean(errors.time)}
                    helperText={touched.time && errors.time}
                  />
                </Grid>

                {/* Route Type */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth size="small" error={touched.routeType && Boolean(errors.routeType)}>
                    <InputLabel>Route Type</InputLabel>
                    <Field
                      as={Select}
                      label="Route Type"
                      name="routeType"
                      value={values.routeType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.routeType && Boolean(errors.routeType)}
                    >
                      {routeTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Field>
                    <FormHelperText sx={{ color: 'red' }}>{touched.routeType && errors.routeType}</FormHelperText>
                  </FormControl>
                </Grid>



                {/* Lane Status */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth size="small" error={touched.laneStatus && Boolean(errors.laneStatus)}>
                    <InputLabel>Lane Status</InputLabel>
                    <Field
                      as={Select}
                      label="Lane Status"
                      name="laneStatus"
                      value={values.laneStatus}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.laneStatus && Boolean(errors.laneStatus)}
                    >
                      {laneStatusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Field>
                    <FormHelperText>{touched.laneStatus && errors.laneStatus}</FormHelperText>
                  </FormControl>
                </Grid>

                {/* Price per Km */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Price per Km"
                    name="pricePerKm"
                    type="number"
                    variant="outlined"
                    size="small"
                    error={touched.pricePerKm && Boolean(errors.pricePerKm)}
                    helperText={touched.pricePerKm && errors.pricePerKm}
                  />
                </Grid>

                {/* Toll Charges */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Toll Charges"
                    name="tollCharges"
                    type="number"
                    variant="outlined"
                    size="small"
                    error={touched.tollCharges && Boolean(errors.tollCharges)}
                    helperText={touched.tollCharges && errors.tollCharges}
                  />
                </Grid>

                {/* Notes */}
                <Grid item xs={12} sm={6} md={2.4}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Notes"
                    name="notes"
                    variant="outlined"
                    size="small"
                    multiline
                    // rows={3}
                    error={touched.notes && Boolean(errors.notes)}
                    helperText={touched.notes && errors.notes}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        paddingTop: '6px',
                        paddingBottom: '6px',
                        fontSize: '16px',
                        alignSelf: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        textTransform: 'none',
                      }}
                    >
                      Save lane
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>

      <div style={{ marginTop: '80px' }}>
        <DataGridComponent
          columns={columns}
          rows={dummyData}
          isLoading={false}
          pageSizeOptions={[10, 20]}
          initialPageSize={10}
        />
      </div>
    </>
  );
};

export default Lanes;
