'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, Typography, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GridColDef } from '@mui/x-data-grid';
import { DataGridComponent } from './GridComponent';

// Define types for form values
interface PackagingInfoFormValues {
  packageName: string;
  dimensions: string;
  weight: string;
  weightUnit: string;
  length: string;
  lengthUnit: string;
  width: string;
  widthUnit: string;
  height: string;
  heightUnit: string;
  volume: string;
  material: string;
  notes: string;
}

const dummyData = [
  {
    id: 1,
    packageName: 'Small Box',
    length: '10 cm',
    width: '15 cm',
    height: '20 cm',
    weight: '2 kg',
    dimensions: '10x15x20 cm',
    volume: '3000.00 cm³',
    material: 'Cardboard',
    notes: 'Fragile',
  },
  {
    id: 2,
    packageName: 'Medium Box',
    length: '20 cm',
    width: '25 cm',
    height: '30 cm',
    weight: '5 kg',
    dimensions: '20x25x30 cm',
    volume: '15000.00 cm³',
    material: 'Plastic',
    notes: '',
  },
  {
    id: 3,
    packageName: 'Large Box',
    length: '50 cm',
    width: '60 cm',
    height: '70 cm',
    weight: '15 kg',
    dimensions: '50x60x70 cm',
    volume: '210000.00 cm³',
    material: 'Wood',
    notes: 'Handle with care',
  },
  {
    id: 4,
    packageName: 'Small Cylinder',
    length: '15 cm',
    width: '15 cm',
    height: '40 cm',
    weight: '3 kg',
    dimensions: '15x15x40 cm',
    volume: '9000.00 cm³',
    material: 'Metal',
    notes: '',
  },
  {
    id: 5,
    packageName: 'Flat Package',
    length: '5 cm',
    width: '50 cm',
    height: '70 cm',
    weight: '1 kg',
    dimensions: '5x50x70 cm',
    volume: '17500.00 cm³',
    material: 'Paperboard',
    notes: '',
  },
  {
    id: 6,
    packageName: 'Compact Box',
    length: '25 cm',
    width: '25 cm',
    height: '25 cm',
    weight: '4 kg',
    dimensions: '25x25x25 cm',
    volume: '15625.00 cm³',
    material: 'Plastic',
    notes: 'Waterproof',
  },
  {
    id: 7,
    packageName: 'Gift Box',
    length: '30 cm',
    width: '30 cm',
    height: '15 cm',
    weight: '2.5 kg',
    dimensions: '30x30x15 cm',
    volume: '13500.00 cm³',
    material: 'Cardboard',
    notes: '',
  },
  {
    id: 8,
    packageName: 'Food Container',
    length: '40 cm',
    width: '40 cm',
    height: '10 cm',
    weight: '8 kg',
    dimensions: '40x40x10 cm',
    volume: '16000.00 cm³',
    material: 'Plastic',
    notes: 'Keep refrigerated',
  },
  {
    id: 9,
    packageName: 'Tall Cylinder',
    length: '10 cm',
    width: '10 cm',
    height: '100 cm',
    weight: '5 kg',
    dimensions: '10x10x100 cm',
    volume: '10000.00 cm³',
    material: 'Metal',
    notes: '',
  },
  {
    id: 10,
    packageName: 'Custom Package',
    length: '35 cm',
    width: '35 cm',
    height: '35 cm',
    weight: '7 kg',
    dimensions: '35x35x35 cm',
    volume: '42875.00 cm³',
    material: 'Wood',
    notes: 'Customs cleared',
  },
];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 50 },
  { field: 'packageName', headerName: 'Package Name', width: 150 },
  { field: 'weight', headerName: 'Weight', width: 100 },
  { field: 'length', headerName: 'Length', width: 100 },
  { field: 'width', headerName: 'Width', width: 100 },
  { field: 'height', headerName: 'Height', width: 100 },
  { field: 'dimensions', headerName: 'Dimensions', width: 150 },
  { field: 'volume', headerName: 'Volume', width: 150 },
  { field: 'material', headerName: 'Material', width: 150 },
  { field: 'notes', headerName: 'Notes', width: 200 },
];

// Validation schema
const validationSchema = Yup.object({
  packageName: Yup.string().required('Package Name is required'),
  weight: Yup.number().typeError('Weight must be a number').required('Weight is required'),
  dimensions: Yup.string().required('Dimensions are required'),
  length: Yup.number().typeError('Length must be a number').required('Length is required'),
  width: Yup.number().typeError('Width must be a number').required('Width is required'),
  height: Yup.number().typeError('Height must be a number').required('Height is required'),
  volume: Yup.string().required('Volume is required'),
  material: Yup.string().required('Material is required'),
  notes: Yup.string(),
});

const PackagingInfo: React.FC = () => {
  const unitOptions = ['cm', 'm', 'in', 'ft'];
  const weightUnitOptions = ['kg', 'g', 'lb', 'oz'];
  const [globalUnit, setGlobalUnit] = useState('cm');
  console.log(globalUnit)

  const formik = useFormik<PackagingInfoFormValues>({
    initialValues: {
      packageName: '',
      dimensions: '',
      weight: '',
      weightUnit: 'kg',
      length: '',
      lengthUnit: 'cm',
      width: '',
      widthUnit: 'cm',
      height: '',
      heightUnit: 'cm',
      volume: '',
      material: '',
      notes: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Packaging Info:', values);
    },
  });


  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = formik;

  // Handle global unit change
  const handleGlobalUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedUnit = event.target.value;
    setGlobalUnit(selectedUnit);
    setFieldValue('lengthUnit', selectedUnit);
    setFieldValue('widthUnit', selectedUnit);
    setFieldValue('heightUnit', selectedUnit);
  };

  useEffect(() => {
    const length = parseFloat(values.length) || 0;
    const width = parseFloat(values.width) || 0;
    const height = parseFloat(values.height) || 0;

    // Calculate volume
    const volume = length * width * height;
    setFieldValue('volume', `${volume.toFixed(2)} ${values.lengthUnit}³`, false);

    // Set dimensions
    setFieldValue('dimensions', `${length}x${width}x${height} ${values.lengthUnit}`, false);
  }, [values.length, values.width, values.height, values.lengthUnit]);

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
          Packaging Information
        </Typography>
        <Grid container spacing={2}>
          {/* Package Name */}
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Package Name"
              name="packageName"
              value={values.packageName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.packageName && Boolean(errors.packageName)}
              helperText={touched.packageName && errors.packageName}
              variant="outlined"
              size="small"
            />
          </Grid>

          {/* Weight */}
          <Grid item xs={9} sm={5} md={1.7}>
            <TextField
              fullWidth
              label="Weight"
              name="weight"
              value={values.weight}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.weight && Boolean(errors.weight)}
              helperText={touched.weight && errors.weight}
              variant="outlined"
              size="small"
              type="number"
            />
          </Grid>
          <Grid item xs={3} sm={1} md={0.7}>
            <TextField
              select
              fullWidth
              name="weightUnit"
              value={values.weightUnit}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              {weightUnitOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Length */}
          <Grid item xs={9} sm={5} md={1.7}>
            <TextField
              fullWidth
              label="Length"
              name="length"
              value={values.length}
              onChange={(e) => {
                handleChange(e);
                // recalculateFields();
              }}
              onBlur={handleBlur}
              error={touched.length && Boolean(errors.length)}
              helperText={touched.length && errors.length}
              variant="outlined"
              size="small"
              type="number"
            />
          </Grid>
          <Grid item xs={3} sm={1} md={0.7}>
            <TextField
              select
              fullWidth
              name="lengthUnit"
              value={values.lengthUnit}
              onChange={handleGlobalUnitChange}
              variant="outlined"
              size="small"
            >
              {unitOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Width */}
          <Grid item xs={9} sm={5} md={1.7}>
            <TextField
              fullWidth
              label="Width"
              name="width"
              value={values.width}
              onChange={(e) => {
                handleChange(e);
                // recalculateFields();
              }}
              onBlur={handleBlur}
              error={touched.width && Boolean(errors.width)}
              helperText={touched.width && errors.width}
              variant="outlined"
              size="small"
              type="number"
            />
          </Grid>
          <Grid item xs={3} sm={1} md={0.7}>
            <TextField
              select
              fullWidth
              name="widthUnit"
              value={values.widthUnit}
              onChange={handleGlobalUnitChange}
              variant="outlined"
              size="small"
            >
              {unitOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Height */}
          <Grid item xs={9} sm={5} md={1.7}>
            <TextField
              fullWidth
              label="Height"
              name="height"
              value={values.height}
              onChange={(e) => {
                handleChange(e);
                // recalculateFields();
              }}
              onBlur={handleBlur}
              error={touched.height && Boolean(errors.height)}
              helperText={touched.height && errors.height}
              variant="outlined"
              size="small"
              type="number"
            />
          </Grid>
          <Grid item xs={3} sm={1} md={0.7}>
            <TextField
              select
              fullWidth
              name="heightUnit"
              value={values.heightUnit}
              onChange={handleGlobalUnitChange}
              variant="outlined"
              size="small"
            >
              {unitOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Volume */}
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Volume"
              name="volume"
              value={values.volume}
              onBlur={handleBlur}
              error={touched.volume && Boolean(errors.volume)}
              helperText={touched.volume && errors.volume}
              variant="outlined"
              size="small"
              type="text"
              disabled
            />
          </Grid>

          {/* Dimensions */}
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Dimensions"
              name="dimensions"
              value={values.dimensions}
              onBlur={handleBlur}
              error={touched.dimensions && Boolean(errors.dimensions)}
              helperText={touched.dimensions && errors.dimensions}
              variant="outlined"
              size="small"
              disabled
            />
          </Grid>

          {/* Material */}
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Material"
              name="material"
              value={values.material}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.material && Boolean(errors.material)}
              helperText={touched.material && errors.material}
              variant="outlined"
              size="small"
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={values.notes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.notes && Boolean(errors.notes)}
              helperText={touched.notes && errors.notes}
              variant="outlined"
              size="small"
              multiline
              rows={3}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none', fontSize: '16px' }}>
                Save Packaging Info
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

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

export default PackagingInfo;
