import React from 'react';
import { Box, Button, MenuItem, TextField, Select, FormControl, InputLabel, OutlinedInput, Grid, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const PackagingForm = () => {
  const formik = useFormik({
    initialValues: {
      packagingTypeId: '', // Auto-generated, read-only
      packagingTypeName: '',
      packagingDimensionsUoM: '',
      packagingDimensions: '',
      handlingUnitType: '',
    },
    validationSchema: Yup.object({
      packagingTypeName: Yup.string().required('Packaging Type Name is required'),
      packagingDimensionsUoM: Yup.string().required('Packaging Dimensions UoM is required'),
      packagingDimensions: Yup.string()
        .matches(/^\d+\*\d+\*\d+$/, 'Enter dimensions in L*W*H format (e.g., 10*20*30)')
        .required('Packaging Dimensions are required'),
      handlingUnitType: Yup.string().required('Handling Unit Type is required'),
    }),
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
    },
  });

  const handlingUnitOptions = ['Pallet', 'Container', 'Crate', 'Box', 'Drum', 'Bag', 'Sack'];

  return (
    <form onSubmit={formik.handleSubmit}>
          <Typography variant="h5" align='center' gutterBottom>
        Packaging master
      </Typography>
      <Grid container spacing={2}  >
        
        {/* Auto-Generated ID (Read-only) */}
        <Grid item xs={2.4}>
          <TextField
            fullWidth disabled
            id="packagingTypeId"
            name="packagingTypeId"
            label="ID (Auto-generated)"
            value={formik.values.packagingTypeId}
            onChange={formik.handleChange}
            InputProps={{ readOnly: true }}
            size="small"
          />
        </Grid>

        {/* Packaging Type Name */}
        <Grid item xs={2.4}>
          <TextField
            fullWidth
            id="packagingTypeName"
            name="packagingTypeName"
            label="Packaging Type Name"
            value={formik.values.packagingTypeName}
            onChange={formik.handleChange}
            error={formik.touched.packagingTypeName && Boolean(formik.errors.packagingTypeName)}
            helperText={formik.touched.packagingTypeName && formik.errors.packagingTypeName}
            size="small"
          />
        </Grid>

        {/* Packaging Dimensions UoM */}
        <Grid item xs={2.4}>
          <TextField
            fullWidth
            id="packagingDimensionsUoM"
            name="packagingDimensionsUoM"
            label="Dimensions UoM"
            value={formik.values.packagingDimensionsUoM}
            onChange={formik.handleChange}
            error={formik.touched.packagingDimensionsUoM && Boolean(formik.errors.packagingDimensionsUoM)}
            helperText={formik.touched.packagingDimensionsUoM && formik.errors.packagingDimensionsUoM}
            size="small"
          />
        </Grid>

        {/* Packaging Dimensions */}
        <Grid item xs={2.4}>
          <TextField
            fullWidth
            id="packagingDimensions"
            name="packagingDimensions"
            label="Dimensions (L*W*H)"
            placeholder="e.g., 10*20*30"
            value={formik.values.packagingDimensions}
            onChange={formik.handleChange}
            error={formik.touched.packagingDimensions && Boolean(formik.errors.packagingDimensions)}
            helperText={formik.touched.packagingDimensions && formik.errors.packagingDimensions}
            size="small"
          />
        </Grid>

        {/* Handling Unit Type Dropdown */}
        <Grid item xs={2.4}>
          <FormControl fullWidth size="small">
            <InputLabel id="handlingUnitType-label">Handling Unit Type</InputLabel>
            <Select
              labelId="handlingUnitType-label"
              id="handlingUnitType"
              name="handlingUnitType"
              value={formik.values.handlingUnitType}
              onChange={(event) => formik.setFieldValue('handlingUnitType', event.target.value)}
              input={<OutlinedInput label="Handling Unit Type" />}
              error={formik.touched.handlingUnitType && Boolean(formik.errors.handlingUnitType)}
            >
              {handlingUnitOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.handlingUnitType && formik.errors.handlingUnitType && (
              <Box sx={{ color: 'red', fontSize: '0.8rem', marginTop: 0.5 }}>
                {formik.errors.handlingUnitType}
              </Box>
            )}
          </FormControl>
        </Grid>
      </Grid>

      {/* Submit Button */}
      <Box sx={{ marginTop: 3, textAlign: 'center' }}>
        <Button color="primary" variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default PackagingForm;
