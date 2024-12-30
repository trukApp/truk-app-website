'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Collapse,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DataGridComponent } from './GridComponent';
import { GridColDef } from '@mui/x-data-grid';

// Validation schema
const validationSchema = Yup.object({
  locationDescription: Yup.string().required('Location description is required'),
  locationType: Yup.string().required('Location type is required'),
  // vehiclesNearBy: Yup.array()
  // .min(1, 'Select at least one vehicle')
  // .required('Required'),

});

const Locations: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  // Static data for vehicle options
  const vehicleOptions = [
    { id: '1', name: 'Truck - 001' },
    { id: '2', name: 'Trailer - 002' },
    { id: '3', name: 'Container - 003' },
    { id: '4', name: 'Truck - 004' },
    { id: '5', name: 'Trailer - 005' },
  ];


  const formik = useFormik({
    initialValues: {
      locationId: '',
      locationDescription: '',
      locationType: '',
      glnCode: '',
      iataCode: '',
      longitude: '',
      latitude: '',
      timeZone: '',
      city: '',
      district: '',
      state: '',
      country: '',
      pincode: '',
      vehiclesNearBy: [],
      locationContactName: '',
      locationContactNumber: ''
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;

  const rows = Array.from({ length: 10 }, (_, id) => ({
    id,
    locationId: `LOC-${id + 1}`,
    locationDescription: `Location Description ${id + 1}`,
    locationType: id % 2 === 0 ? "Warehouse" : "Depot",
    glnCode: `GLN-${1000 + id}`,
    iataCode: `IATA-${200 + id}`,
    longitude: (78.4 + id * 0.1).toFixed(2),
    latitude: (17.3 + id * 0.1).toFixed(2),
    timeZone: "UTC+05:30",
    city: `City-${id + 1}`,
    district: `District-${id + 1}`,
    state: `State-${id + 1}`,
    country: "India",
    pincode: `5000${id}`,
    locationContactName: `Contact Name ${id + 1}`,
    locationContactNumber: `98765432${id}`,
  }));

  const columns: GridColDef[] = [
    { field: "locationId", headerName: "Location ID", width: 150 },
    { field: "locationDescription", headerName: "Description", width: 200 },
    { field: "locationType", headerName: "Type", width: 150 },
    { field: "glnCode", headerName: "GLN Code", width: 150 },
    { field: "iataCode", headerName: "IATA Code", width: 150 },
    { field: "longitude", headerName: "Longitude", width: 150 },
    { field: "latitude", headerName: "Latitude", width: 150 },
    { field: "timeZone", headerName: "Time Zone", width: 150 },
    { field: "city", headerName: "City", width: 150 },
    { field: "district", headerName: "District", width: 150 },
    { field: "state", headerName: "State", width: 150 },
    { field: "country", headerName: "Country", width: 150 },
    { field: "pincode", headerName: "Pincode", width: 150 },
    { field: "locationContactName", headerName: "Contact Name", width: 200 },
    { field: "locationContactNumber", headerName: "Contact Number", width: 150 },
  ];

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >

        <Typography variant="h5" align="center" gutterBottom>
          Location Master Data
        </Typography>
        <Box display="flex" justifyContent="flex-end" marginBottom={3} gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? 'Close Form' : 'Create Location'}
          </Button>
          <Button variant="outlined" color="secondary">
            Mass Upload
          </Button>
        </Box>

        <Collapse in={showForm}>

          <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
            <Grid container spacing={2}>

              <Grid container spacing={2}>
                <Typography variant="h6" align="center" gutterBottom>
                  1. General info
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth disabled
                      size="small"
                      label="Location ID* (Auto-generated)"
                      name="locationId"
                      value={values.locationId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Location Description*"
                      name="locationDescription"
                      value={values.locationDescription}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.locationDescription && Boolean(errors.locationDescription)}
                      helperText={touched.locationDescription && errors.locationDescription}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      select
                      name="locationType"
                      value={values.locationType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.locationType && Boolean(errors.locationType)}
                      helperText={touched.locationType && errors.locationType}
                      SelectProps={{
                        native: true, // Use native dropdown
                      }}
                    >
                      <option value="" disabled>
                        Select Location Type *
                      </option>
                      <option value="product plant">Product Plant</option>
                      <option value="distribution center">Distribution Center</option>
                      <option value="shipping point">Shipping Point</option>
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor</option>
                      <option value="terminal">Terminal</option>
                      <option value="port">Port</option>
                      <option value="airport">Airport</option>
                      <option value="railway station">Railway Station</option>
                      <option value="container freight station">Container Freight Station</option>
                      <option value="hub">Hub</option>
                      <option value="gateway">Gateway</option>
                      <option value="container yard">Container Yard</option>
                      <option value="warehouse">Warehouse</option>
                      <option value="carrier warehouse">Carrier Warehouse</option>
                      <option value="rail junction">Rail Junction</option>
                      <option value="border cross point">Border Cross Point</option>
                    </TextField>
                  </Grid>


                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="GLN Code (13 Characters Length)"
                      name="glnCode"
                      value={values.glnCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      inputProps={{ maxLength: 13 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="IATA Code (3 Characters Length)"
                      name="iataCode"
                      value={values.iataCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      inputProps={{ maxLength: 3 }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} mt={1} sx={{ marginLeft: '3px' }}>
                  <Typography gutterBottom>
                    Geographical data
                  </Typography>
                  <Grid container spacing={2} >
                    <Grid item xs={12} sm={6} md={2.4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Longitude*"
                        name="longitude"
                        value={values.longitude}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Latitude*"
                        name="latitude"
                        value={values.latitude}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Time Zone*"
                        name="timeZone"
                        value={values.timeZone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.timeZone && Boolean(errors.timeZone)}
                        helperText={touched.timeZone && errors.timeZone}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container spacing={2} ml={1} mt={2}>
                  <Typography variant="h6" align="center" gutterBottom >
                    2. Address
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="City"
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="District"
                        name="district"
                        value={values.district}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="State"
                        name="state"
                        value={values.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Country"
                        name="country"
                        value={values.country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Pincode"
                        name="pincode"
                        value={values.pincode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid spacing={4} mt={2} ml={1}>
                  <Typography variant="h6" mb={1}  >
                    3. Vehicles
                  </Typography>



                  <Box sx={{ marginBottom: 2 }}>
                    <FormControl fullWidth sx={{ minWidth: '280px' }}>
                      <InputLabel
                        id="vehiclesNearBy-label"
                      >
                        Vehicles operated at this location
                      </InputLabel>
                      <Select
                        labelId="vehiclesNearBy-label"
                        id="vehiclesNearBy"
                        multiple
                        value={formik.values.vehiclesNearBy}
                        onChange={(event) => formik.setFieldValue('vehiclesNearBy', event.target.value)}
                        input={
                          <OutlinedInput
                            label="Vehicles Operated Nearby"
                          />
                        }
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => {
                              const vehicle = vehicleOptions.find((v) => v.id === value);
                              return vehicle ? <Chip key={value} label={vehicle.name} /> : null;
                            })}
                          </Box>
                        )}

                      >
                        {vehicleOptions.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.vehiclesNearBy && formik.errors.vehiclesNearBy && (
                        <Box sx={{ color: 'red', fontSize: '0.8rem', marginTop: 1 }}>
                          {formik.errors.vehiclesNearBy}
                        </Box>
                      )}
                    </FormControl>
                  </Box>



                </Grid>

                <Grid container spacing={2} ml={1} mt={2}>
                  <Typography variant="h6" align="center" gutterBottom >
                    4. Additional details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Location contact name"
                        name="locationContactName"
                        value={values.locationContactName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Location contact number"
                        name="locationContactNumber"
                        value={values.locationContactNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>

                  </Grid>
                </Grid>



              </Grid>
            </Grid>
            <Box sx={{ marginTop: '24px', textAlign: 'center' }}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box>
          </Box>
        </Collapse>


      </Box>

      {/* Data grid */}
      <div style={{ marginTop: "40px" }}>
        <DataGridComponent
          columns={columns}
          rows={rows}
          isLoading={false}
          pageSizeOptions={[10, 20,30]}
          initialPageSize={10}
        />
      </div>

    </>
  );
};

export default Locations;
