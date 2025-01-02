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
import { DataGridComponent } from '../GridComponent';
import { GridColDef } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './MasterData.module.css';
import { withAuthComponent } from '../WithAuthComponent';
import { useGetLocationMasterQuery } from '@/api/apiSlice';

// Define the type for each location object returned by the backend
interface Location {
  location_id: number;
  loc_ID: string;
  loc_desc: string;
  loc_type?: string;
  gln_code?: string;
  iata_code?: string;
  longitude: string;
  latitude: string;
  timezone?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
  contact_name?: string;
  contact_number?: string;
}

// Define the type for each row in the DataGrid
interface DataGridRow {
  locationId: string;
  locationDescription: string;
  locationType: string;
  glnCode: string;
  iataCode: string;
  longitude: string;
  latitude: string;
  timeZone: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  vehiclesNearBy : [],
  locationContactName: string;
  locationContactNumber: string;
}


// Validation schema
const validationSchema = Yup.object({
  locationDescription: Yup.string().required('Location description is required'),
  locationType: Yup.string().required('Location type is required'),
  latitude: Yup.string().required('Latitude  is required'),
  longitude: Yup.string().required('Longitude  is required'),
  timeZone:Yup.string().required('Time zone is required'),
  // vehiclesNearBy: Yup.array()
  // .min(1, 'Select at least one vehicle')
  // .required('Required'),

});

const Locations: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { data, error, isLoading } = useGetLocationMasterQuery([])
  console.log("all locations :", data?.locations)
  if (isLoading) {
  console.log("Loading locations...");
}

if (error) {
  console.error("Error fetching locations:", error);
  // Handle the error case
}
  
  const locationsMaster = data?.locations
  // Static data for vehicle options
  const vehicleOptions = [
    { id: '1', name: 'Truck - 001' },
    { id: '2', name: 'Trailer - 002' },
    { id: '3', name: 'Container - 003' },
    { id: '4', name: 'Truck - 004' },
    { id: '5', name: 'Trailer - 005' },
  ];

  const handleFormSubmit = (values:DataGridRow) => {
    console.log("form submitted locations :", values)
  }

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
    onSubmit: handleFormSubmit
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;


const rows: DataGridRow[] = locationsMaster?.map((location: Location, index: number) => ({
  id: location.location_id,
  locationId: location.loc_ID,
  locationDescription: location.loc_desc,
  locationType: location.loc_type || null,
  glnCode: location.gln_code || `GLN-${1000 + index}`,
  iataCode: location.iata_code || `IATA-${200 + index}`,
  longitude: location.longitude,
  latitude: location.latitude,
  timeZone: location.timezone || "UTC+05:30",
  city: location.city || `City-${index + 1}`,
  district: location.district || `District-${index + 1}`,
  state: location.state || `State-${index + 1}`,
  country: location.country || "India",
  pincode: location.pincode || `5000${index}`,
  locationContactName: location.contact_name || 'null',
  locationContactNumber: location.contact_number || 'null',
})) || [];

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
          boxSizing: 'border-box',
        }}
      >

        <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '20px', md:'24px' } }} align="center" gutterBottom>
            Location master
        </Typography>

        <Box display="flex" justifyContent="flex-end" marginBottom={3} gap={2}>
          <Button
            variant="contained"
            onClick={() => setShowForm((prev) => !prev)}
            className={styles.createButton}
          >
            Create Location
            {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 4 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />}
          </Button>
        </Box>

        <Collapse in={showForm}>

          <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
         

              <Grid container spacing={2} padding={2}>
                <Typography variant="h6" align="center" gutterBottom>
                  1. General info
                </Typography>
                <Grid container spacing={2}>
                  {/* <Grid item xs={12} sm={6} md={2.4}>
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
                  </Grid> */}
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
                      error={touched.longitude && Boolean(errors.longitude)}
                      helperText={touched.longitude && errors.longitude}
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
                      error={touched.latitude && Boolean(errors.latitude)}
                      helperText={touched.latitude && errors.latitude}
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
          pageSizeOptions={[10, 20, 30]}
          initialPageSize={10}
        />
      </div>

    </>
  );
};

export default withAuthComponent(Locations);
