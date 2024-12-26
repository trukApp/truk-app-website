'use client';

import React, { useState } from 'react';
import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DataGridComponent } from './GridComponent';

// Define types for form values
interface ResourcesFormValues {
  resourceName: string;
  resourceType: string;
  contactNumber: string;
  email: string;
  availability: string;
  notes: string;
}

// Validation schema
const validationSchema = Yup.object({
  resourceName: Yup.string().required('Resource Name is required'),
  resourceType: Yup.string().required('Resource Type is required'),
  contactNumber: Yup.string()
    .matches(/^\d{10}$/, 'Contact Number must be 10 digits')
    .required('Contact Number is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  availability: Yup.string().required('Availability status is required'),
  notes: Yup.string(),
});

// Dummy data for DataGrid
const initialDummyData = [
  { id: 1, resourceName: 'John Doe', resourceType: 'Driver', contactNumber: '1234567890', email: 'john.doe@example.com', availability: 'Available' },
  { id: 2, resourceName: 'Jane Smith', resourceType: 'Loader', contactNumber: '9876543210', email: 'jane.smith@example.com', availability: 'Not Available' },
  { id: 3, resourceName: 'Alice Brown', resourceType: 'Supervisor', contactNumber: '1234509876', email: 'alice.brown@example.com', availability: 'Available' },
  { id: 4, resourceName: 'Bob Green', resourceType: 'Mechanic', contactNumber: '5678901234', email: 'bob.green@example.com', availability: 'Available' },
  { id: 5, resourceName: 'Eve Black', resourceType: 'Manager', contactNumber: '6789012345', email: 'eve.black@example.com', availability: 'Not Available' },
];

// Columns for DataGrid
const columns = [
  { field: 'resourceName', headerName: 'Resource Name', width: 200 },
  { field: 'resourceType', headerName: 'Resource Type', width: 150 },
  { field: 'contactNumber', headerName: 'Contact Number', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'availability', headerName: 'Availability', width: 150 },
];

const Resources: React.FC = () => {
  const [data, setData] = useState(initialDummyData);

  const resourceTypes = ['Driver', 'Loader', 'Supervisor', 'Mechanic', 'Manager'];
  const availabilityOptions = ['Available', 'Not Available'];

  const formik = useFormik<ResourcesFormValues>({
    initialValues: {
      resourceName: '',
      resourceType: '',
      contactNumber: '',
      email: '',
      availability: '',
      notes: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const newData = {
        id: data.length + 1,
        ...values,
      };
      setData([...data, newData]);
      formik.resetForm();
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;

  return (
    <Box sx={{ width: '100%', padding: '20px' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Resource Information
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          marginBottom: '20px',
        }}
      >
        <Grid container spacing={2}>
          {/* Row 1 */}
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Resource Name"
              name="resourceName"
              value={values.resourceName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.resourceName && Boolean(errors.resourceName)}
              helperText={touched.resourceName && errors.resourceName}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              select
              fullWidth
              label="Resource Type"
              name="resourceType"
              value={values.resourceType}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.resourceType && Boolean(errors.resourceType)}
              helperText={touched.resourceType && errors.resourceType}
              variant="outlined"
              size="small"
            >
              {resourceTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={values.contactNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.contactNumber && Boolean(errors.contactNumber)}
              helperText={touched.contactNumber && errors.contactNumber}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              select
              fullWidth
              label="Availability"
              name="availability"
              value={values.availability}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.availability && Boolean(errors.availability)}
              helperText={touched.availability && errors.availability}
              variant="outlined"
              size="small"
            >
              {availabilityOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Button type="submit" variant="contained" color="primary"
            sx={{
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "6px",
              paddingBottom: "6px",
              fontSize: "16px",
              alignSelf: "center",
              display: "flex",
              justifyContent: "center",
              textTransform: "none",
            }}>
            Add Resource
          </Button>
        </Box>
      </Box>

      {/* DataGrid for Resources */}
      <div style={{ width: '100%', marginTop: '40px' }}>
        <DataGridComponent
          columns={columns}
          rows={data}
          isLoading={false}
          pageSizeOptions={[10, 20]}
          initialPageSize={10}

        />
      </div>
    </Box>
  );
};

export default Resources;
