'use client';
import React, { useState } from 'react';
import { Box, Button, MenuItem, TextField, Select, FormControl, InputLabel, OutlinedInput, Grid, Typography, Collapse } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GridColDef } from '@mui/x-data-grid';
import { DataGridComponent } from './GridComponent';

const PackagingForm = () => {
  const [showForm, setShowForm] = useState(false);
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

  const rows = Array.from({ length: 10 }, (_, id) => ({
    id,
    packagingTypeId: `PKG-${id + 1}`,
    packagingTypeName: `Type ${id + 1}`,
    packagingDimensionsUoM: id % 2 === 0 ? "cm" : "inches",
    packagingDimensions: `${50 + id * 5} x ${30 + id * 3} x ${20 + id * 2}`,
    handlingUnitType: id % 2 === 0 ? "Pallet" : "Crate",
  }));

  const columns: GridColDef[] = [
    { field: "packagingTypeId", headerName: "Packaging Type ID", width: 200, editable: false },
    { field: "packagingTypeName", headerName: "Packaging Name", width: 200 },
    { field: "packagingDimensionsUoM", headerName: "Dimensions UoM", width: 180 },
    { field: "packagingDimensions", headerName: "Dimensions", width: 250 },
    { field: "handlingUnitType", headerName: "Handling Unit Type", width: 200 },
  ];

  return (
    <>
      <Box display="flex" justifyContent="flex-end" marginBottom={3} gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? 'Close Form' : 'Create Package'}
        </Button>
        <Button variant="outlined" color="secondary">
          Mass Upload
        </Button>
      </Box>
      <Collapse in={showForm}>
        <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
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
        </Box>

      </Collapse>

      {/* Data grid */}
      <div style={{ marginTop: "60px" }}>
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

export default PackagingForm;
