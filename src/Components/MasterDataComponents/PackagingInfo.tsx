'use client';
import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, TextField, Select, FormControl, InputLabel, OutlinedInput, Grid, Typography, Collapse, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GridColDef } from '@mui/x-data-grid';
import { DataGridComponent } from '../GridComponent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './MasterData.module.css';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetPackageMasterQuery,usePostPackageMasterMutation,useEditPackageMasterMutation,useDeletePackageMasterMutation } from '@/api/apiSlice';

interface Package {
  handling_unit_type: string;
  dimensions: string;
  packageItem: string;
  dimensions_uom: string;
  packaging_type_name: string;
  pac_ID: string;
  package_id: string;
  
}
interface PackageInfo {
  id: string;
  handlingUnitType: string;
  packagingDimensions: string;
  packagingDimensionsUoM: string;
  packagingTypeName: string;
  packagingTypeId: string;
  
}

const PackagingForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editRow,setEditRow] = useState<PackageInfo | null>(null); ;
  const [showForm, setShowForm] = useState(false);
  const { data, error } = useGetPackageMasterQuery([])
  const [postPackage] = usePostPackageMasterMutation()
  const [editPackage] = useEditPackageMasterMutation()
  const [deletePackage] = useDeletePackageMasterMutation()
  const lengthUnits = ['meter', 'centi meter', 'milli meter','inch' ]
  console.log('package data :', data?.packages)
  if (error) {
    console.log("err while getting package info :", error)
  }
  const handleFormSubmit = async (values: PackageInfo) => {
    console.log("form submitted locations :", values)

        try {
            const body = {
                packages: [
                    {
                    packaging_type_name:values.packagingTypeName,
                    dimensions_uom: values.packagingDimensionsUoM,
                    dimensions: values.packagingDimensions,
                    handling_unit_type: values.handlingUnitType
                }
                ]
              }
              const editBody = {
                    packaging_type_name:values.packagingTypeName,
                    dimensions_uom: values.packagingDimensionsUoM,
                    dimensions: values.packagingDimensions,
                    handling_unit_type: values.handlingUnitType
                }
              console.log("location body: ", body)
              if (isEditing && editRow) {
                console.log('edit body is :', editBody)
                const packageId = editRow.id
                const response = await editPackage({body:editBody, packageId}).unwrap()
                console.log("edit response is ", response)
                setShowForm(false)
                formik.resetForm()
              }
              else {
                console.log("post create location ",body)
                const response = await postPackage(body).unwrap();
                setShowForm(false)
                formik.resetForm()
                console.log('response in post location:', response);
                 
              }
          
        } catch (error) {
            console.error('API Error:', error);
        }

  }
  const formik = useFormik({
    initialValues: {
      id:'',
      packagingTypeId: '', // Auto-generated, read-only
      packagingTypeName: '',
      packagingDimensionsUoM: lengthUnits[0],
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
    onSubmit: handleFormSubmit
  });

    useEffect(() => {
      if (editRow) {
        formik.setValues({
          id : editRow?.id,
          packagingTypeId: editRow?.packagingTypeId,
          packagingTypeName: editRow?.packagingTypeName,
          packagingDimensionsUoM: editRow?.packagingDimensionsUoM,
          packagingDimensions: editRow?.packagingDimensions,
          handlingUnitType: editRow?.handlingUnitType,
          
       
        });
      }
    }, [editRow]);
  const handlingUnitOptions = ['Pallet', 'Container', 'Crate', 'Box', 'Drum', 'Bag', 'Sack'];

  const handleEdit = (row: PackageInfo) => {
    console.log("Edit row:", row);
    setShowForm(true)
    setIsEditing(true)
    setEditRow(row)
    };

const handleDelete = async (row: PackageInfo) => {
  const packageId = row?.id;
  if (!packageId) {
    console.error("Row ID is missing");
    return;
  }
  const confirmed = window.confirm("Are you sure you want to delete this vehicle?");
  
  if (!confirmed) {
    console.log("Delete canceled by user.");
    return;
  }

  try {
    const response = await deletePackage(packageId);
    console.log("Delete response:", response);
  } catch (error) {
    console.error("Error deleting vehicle:", error);
  }
};

const rows = data?.packages.map((packageItem :Package) => ({
  id: packageItem?.package_id,
  packagingTypeId: packageItem.pac_ID ,
  packagingTypeName: packageItem?.packaging_type_name,
  packagingDimensionsUoM: packageItem.dimensions_uom  ,
  packagingDimensions: packageItem.dimensions ,
  handlingUnitType: packageItem.handling_unit_type,
}));


  const columns: GridColDef[] = [
    { field: "packagingTypeId", headerName: "Packaging Type ID", width: 200, editable: false },
    { field: "packagingTypeName", headerName: "Packaging Name", width: 200 },
    { field: "packagingDimensionsUoM", headerName: "Dimensions UoM", width: 200 },
    { field: "packagingDimensions", headerName: "Dimensions", width: 300 },
    { field: "handlingUnitType", headerName: "Handling Unit Type", width: 200 },
          {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <Box display="flex" justifyContent="flex-end" marginBottom={3} gap={2}>
        <Button
          variant="contained"
          onClick={() => setShowForm((prev) => !prev)}
          className={styles.createButton}
        >
          Create Package
          {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 8 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 8 }} />}
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

              
              {/* Packaging Dimensions UoM */}
              <Grid item xs={2.4}>
                {/* <TextField
                  fullWidth
                  id="packagingDimensionsUoM"
                  name="packagingDimensionsUoM"
                  label="Dimensions UoM"
                  value={formik.values.packagingDimensionsUoM}
                  onChange={formik.handleChange}
                  error={formik.touched.packagingDimensionsUoM && Boolean(formik.errors.packagingDimensionsUoM)}
                  helperText={formik.touched.packagingDimensionsUoM && formik.errors.packagingDimensionsUoM}
                  size="small"
                /> */}

                  <TextField
                        fullWidth
                        select
                        onBlur={formik.handleBlur}
                        name="packagingDimensionsUoM" 
                        value={formik.values.packagingDimensionsUoM || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.packagingDimensionsUoM && Boolean(formik.errors.packagingDimensionsUoM)}
                        helperText={formik.touched.packagingDimensionsUoM && formik.errors.packagingDimensionsUoM}
                        size="small"
                  >
                      {lengthUnits.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                              {unit}
                          </MenuItem>
                      ))}
                    </TextField>
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
                {isEditing ? "Update package" : "Create pacakage"}
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
          pageSizeOptions={[10, 20, 30]}
          initialPageSize={10}
        />
      </div>
    </>
  );
};

export default PackagingForm;
