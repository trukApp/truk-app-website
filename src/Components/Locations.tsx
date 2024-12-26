'use client';

import React from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { GridColDef } from '@mui/x-data-grid';
import { DataGridComponent } from './GridComponent';

const columns: GridColDef[] = [
  { field: 'locationName', headerName: 'Location Name', width: 150 },
  { field: 'address', headerName: 'Address', width: 200 },
  { field: 'city', headerName: 'City', width: 120 },
  { field: 'state', headerName: 'State', width: 120 },
  { field: 'postalCode', headerName: 'Postal Code', width: 120 },
  { field: 'country', headerName: 'Country', width: 120 },
  { field: 'contactPerson', headerName: 'Contact Person', width: 150 },
  { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'notes', headerName: 'Notes', width: 250 },
];

const dummyData = [
  {
    id: 1,
    locationName: 'Warehouse A',
    address: '123 Main St',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90001',
    country: 'USA',
    contactPerson: 'John Doe',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    notes: 'Handles fragile items.',
  },
  {
    id: 2,
    locationName: 'Distribution Center B',
    address: '456 Elm St',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60601',
    country: 'USA',
    contactPerson: 'Jane Smith',
    phoneNumber: '9876543210',
    email: 'jane.smith@example.com',
    notes: '24/7 operations.',
  },
  {
    id: 3,
    locationName: 'Regional Office C',
    address: '789 Pine St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA',
    contactPerson: 'Alice Johnson',
    phoneNumber: '5551234567',
    email: 'alice.johnson@example.com',
    notes: 'Main hub for logistics.',
  },
  {
    id: 4,
    locationName: 'Warehouse D',
    address: '101 Maple St',
    city: 'Houston',
    state: 'TX',
    postalCode: '77001',
    country: 'USA',
    contactPerson: 'Bob Lee',
    phoneNumber: '4449876543',
    email: 'bob.lee@example.com',
    notes: 'Specializes in heavy goods.',
  },
  {
    id: 5,
    locationName: 'Storage Facility E',
    address: '202 Oak St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94101',
    country: 'USA',
    contactPerson: 'Mary Davis',
    phoneNumber: '3332221111',
    email: 'mary.davis@example.com',
    notes: 'Secure storage only.',
  },
  {
    id: 6,
    locationName: 'Depot F',
    address: '303 Birch St',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'USA',
    contactPerson: 'Sam Wilson',
    phoneNumber: '6665554444',
    email: 'sam.wilson@example.com',
    notes: 'Near port area.',
  },
  {
    id: 7,
    locationName: 'Shipping Center G',
    address: '404 Cedar St',
    city: 'Atlanta',
    state: 'GA',
    postalCode: '30301',
    country: 'USA',
    contactPerson: 'Paul Harris',
    phoneNumber: '1112223333',
    email: 'paul.harris@example.com',
    notes: 'Includes cold storage.',
  },
  {
    id: 8,
    locationName: 'Logistics Hub H',
    address: '505 Spruce St',
    city: 'Denver',
    state: 'CO',
    postalCode: '80201',
    country: 'USA',
    contactPerson: 'Diana Prince',
    phoneNumber: '7778889999',
    email: 'diana.prince@example.com',
    notes: 'Centralized operations.',
  },
  {
    id: 9,
    locationName: 'Facility I',
    address: '606 Palm St',
    city: 'Phoenix',
    state: 'AZ',
    postalCode: '85001',
    country: 'USA',
    contactPerson: 'Clark Kent',
    phoneNumber: '2223334444',
    email: 'clark.kent@example.com',
    notes: 'Recently upgraded.',
  },
  {
    id: 10,
    locationName: 'Station J',
    address: '707 Willow St',
    city: 'Miami',
    state: 'FL',
    postalCode: '33101',
    country: 'USA',
    contactPerson: 'Bruce Wayne',
    phoneNumber: '8889997777',
    email: 'bruce.wayne@example.com',
    notes: 'High-security location.',
  },
];
const countries = ['India', 'USA', 'Canada', 'Australia', 'Germany'];

// Initial Values
const initialValues = {
  locationName: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: countries[0],
  contactPerson: '',
  phoneNumber: '',
  email: '',
  notes: '',
};

// Validation Schema
const validationSchema = Yup.object({
  locationName: Yup.string().required('Location name is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postalCode: Yup.string().required('Postal code is required'),
  country: Yup.string().required('Country is required'),
  contactPerson: Yup.string().required('Contact person is required'),
  phoneNumber: Yup.string()
    .matches(/^\d+$/, 'Phone number must be numeric')
    .required('Phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  notes: Yup.string(),
});

// Submit Handler
const handleSubmit = (values: typeof initialValues) => {
  console.log('location values :', values);
};

const Locations: React.FC = () => {
  return (
    <Box sx={{ padding: '20px', boxSizing: 'border-box', width: '100%' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Location Details
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form>
            <Grid container spacing={2}>
              {/* Row 1 */}
              <Grid item xs={12} sm={6} md={2.4}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Location Name"
                  name="locationName"
                  variant="outlined"
                  size="small"
                  error={touched.locationName && Boolean(errors.locationName)}
                  helperText={<ErrorMessage name="locationName" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Address"
                  name="address"
                  variant="outlined"
                  size="small"
                  error={touched.address && Boolean(errors.address)}
                  helperText={<ErrorMessage name="address" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Field
                  as={TextField}
                  fullWidth
                  label="City"
                  name="city"
                  variant="outlined"
                  size="small"
                  error={touched.city && Boolean(errors.city)}
                  helperText={<ErrorMessage name="city" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Field
                  as={TextField}
                  fullWidth
                  label="State"
                  name="state"
                  variant="outlined"
                  size="small"
                  error={touched.state && Boolean(errors.state)}
                  helperText={<ErrorMessage name="state" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Postal Code"
                  name="postalCode"
                  variant="outlined"
                  size="small"
                  error={touched.postalCode && Boolean(errors.postalCode)}
                  helperText={<ErrorMessage name="postalCode" />}
                />
              </Grid>

              {/* Row 2 */}
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl
                  fullWidth
                  size="small"
                  error={touched.country && Boolean(errors.country)}
                >
                  {/* <InputLabel>Country</InputLabel> */}
                  <Field
                    as={Select}
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Field>
                  <FormHelperText>
                    {touched.country && errors.country}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Contact Person"
                  name="contactPerson"
                  variant="outlined"
                  size="small"
                  error={
                    touched.contactPerson && Boolean(errors.contactPerson)
                  }
                  helperText={<ErrorMessage name="contactPerson" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  variant="outlined"
                  size="small"
                  error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                  helperText={<ErrorMessage name="phoneNumber" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Email"
                  name="email"
                  variant="outlined"
                  size="small"
                  error={touched.email && Boolean(errors.email)}
                  helperText={<ErrorMessage name="email" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Notes"
                  name="notes"
                  variant="outlined"
                  size="small"
                  rows={3}
                  error={touched.notes && Boolean(errors.notes)}
                  helperText={<ErrorMessage name="notes" />}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 2,
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: 'none', fontSize: '16px' }}
                  >
                    Save Location
                  </Button>
                </Box>
              </Grid>
            </Grid>
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
    </Box>
  );
};

export default Locations;
