'use client';
import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, TextField, Grid, Typography, Collapse, IconButton, Backdrop, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { DataGridComponent } from '../GridComponent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './MasterData.module.css';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetPackageMasterQuery, usePostPackageMasterMutation, useEditPackageMasterMutation, useDeletePackageMasterMutation } from '@/api/apiSlice';
import MassUpload from '../MassUpload/MassUpload';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { useQuery } from "@apollo/client";
import {GET_ALL_PACKAGES } from '@/api/graphqlApiSlice';
export interface Package {
  handling_unit_type: string;
  pack_length: number,
  pack_width: number,
  pack_height: number,
  packageItem: string;
  dimensions_uom: string;
  packaging_type_name: string;
  pac_ID: string;
  package_id: string;

}
export interface PackageInfo {
  id: string;
  handlingUnitType: string;
  packagingDimensions: string;
  packagingLength: string;
  packagingWidth: string;
  packagingHeight: string;
  packagingDimensionsUoM: string;
  packagingTypeName: string;
  packagingTypeId: string;

}

const PackagingForm = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10, });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
  const [isEditing, setIsEditing] = useState(false);
  const [editRow, setEditRow] = useState<PackageInfo | null>(null);;
  const [showForm, setShowForm] = useState(false);
  const { data, error, isLoading } = useGetPackageMasterQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize })
  const { data: allData } = useGetPackageMasterQuery({});
      // graphqlAPI
      const { data: allPackagesDatas, loading: packagesLoading, error: packagesError } = useQuery(GET_ALL_PACKAGES);
  const [postPackage, { isLoading: postPackageLoading }] = usePostPackageMasterMutation()
  const [editPackage, { isLoading: editPackageLoading }] = useEditPackageMasterMutation()
  const [deletePackage, { isLoading: deletePackageLoading }] = useDeletePackageMasterMutation()
  const unitsofMeasurement = useSelector((state: RootState) => state.auth.unitsofMeasurement);
  if (error) {
    console.log("err while getting package info :", error)
  }
  const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };
  const handleFormSubmit = async (values: PackageInfo) => {
    try {
      const body = {
        packages: [
          {
            packaging_type_name: values.packagingTypeName,
            dimensions_uom: values.packagingDimensionsUoM,
            pack_length: values.packagingLength ,
            pack_width: values.packagingWidth,
            pack_height: values.packagingHeight,
            handling_unit_type:  values.handlingUnitType,
          }
        ]
      }
      const editBody = {
            packaging_type_name: values.packagingTypeName,
            dimensions_uom: values.packagingDimensionsUoM,
            pack_length: values.packagingLength ,
            pack_width: values.packagingWidth,
            pack_height: values.packagingHeight,
            handling_unit_type:  values.handlingUnitType,
      }
      if (isEditing && editRow) {
        const packageId = editRow.id
        const response = await editPackage({ body: editBody, packageId }).unwrap()
        if (response?.updated_record) {
          setSnackbarMessage(`Package ID ${response.updated_record} updated successfully!`);
          formik.resetForm();
          setShowForm(false)
          setIsEditing(false)
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
           
        }

      }
      else {
        const response = await postPackage(body).unwrap();
        if (response?.created_records) {
          setSnackbarMessage(`Package ID ${response.created_records[0]} created successfully!`);
          formik.resetForm();
          setShowForm(false)
          setIsEditing(false)
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }


      }

    } catch (error) {
      console.error('API Error:', error);
      setIsEditing(false)
      setShowForm(false)
      setSnackbarMessage("Something went wrong! please try again");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

  }
  const formik = useFormik({
    initialValues: {
      id: '',
      packagingTypeId: '',
      packagingTypeName: '',
      packagingDimensionsUoM: unitsofMeasurement[0],
      packagingLength: '', 
      packagingWidth: '',
      packagingHeight:'',
      handlingUnitType: '',
      packagingDimensions:''
    },
    validationSchema: Yup.object({
      packagingTypeName: Yup.string().required('Packaging Type Name is required'),
      packagingDimensionsUoM: Yup.string().required('Packaging Dimensions UoM is required'),
      packagingLength: Yup.string().required('Packaging length is required'),
      packagingWidth: Yup.string().required('Packaging width is required'),
      packagingHeight: Yup.string().required('Packaging height is required'),
      handlingUnitType: Yup.string().required('Handling Unit Type is required'),
    }),
    onSubmit: handleFormSubmit
  });

  useEffect(() => {
    if (editRow) {
      console.log('edit row :', editRow)
      const dimensions = editRow.packagingDimensions.split(" * ")
      formik.setValues({
        id: editRow?.id,
        packagingTypeId: editRow?.packagingTypeId,
        packagingTypeName: editRow?.packagingTypeName,
        packagingDimensionsUoM: editRow?.packagingDimensionsUoM,
        packagingLength:dimensions[0],
        packagingWidth: dimensions[1],
        packagingHeight: dimensions[2],
        handlingUnitType: editRow?.handlingUnitType,
        packagingDimensions : ''


      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRow]); 
  const handleEdit = (row: PackageInfo) => {
    setShowForm(true)
    setIsEditing(true)
    setEditRow(row)
  };

  const handleDelete = async (row: PackageInfo) => {
    const packageId = row?.id;
    if (!packageId) {
      console.error("Row ID is missing");
      setSnackbarMessage("Error: Package ID is missing!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this vehicle?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await deletePackage(packageId);
      if (response?.data?.deleted_record) {
        setSnackbarMessage(`Package ID ${response.data.deleted_record} deleted successfully!`);
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setSnackbarMessage("Failed to delete package. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };


  const rows = data?.packages.map((packageItem: Package) => ({
    id: packageItem?.package_id,
    packagingTypeId: packageItem.pac_ID,
    packagingTypeName: packageItem?.packaging_type_name,
    packagingDimensionsUoM: packageItem.dimensions_uom,
    packagingDimensions: `${packageItem.pack_length} * ${packageItem.pack_width} * ${packageItem.pack_height}` ,
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
      <Backdrop
        sx={{
          color: "#ffffff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={postPackageLoading || editPackageLoading || deletePackageLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
      <Box display="flex" justifyContent="flex-end" marginBottom={3} gap={2}>
        <Button
          variant="contained"
          onClick={() => setShowForm((prev) => !prev)}
          className={styles.createButton}
        >
          Create Package
          {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 8 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 8 }} />}
        </Button>
        <MassUpload arrayKey='packages' />
      </Box>

      <Collapse in={showForm}>
        <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h5" align='center' gutterBottom>
              Packaging master
            </Typography>
            <Grid container spacing={2}  >

              {isEditing &&
                <Grid item xs={12} md={2.4}>
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
              </Grid> }


              {/* Packaging Type Name */}
              <Grid item xs={12} md={2.4}>
                <TextField
                  fullWidth
                  id="packagingTypeName"
                  name="packagingTypeName"
                  label="Packaging Type Name"
                  onBlur = {formik.handleBlur}
                  value={formik.values.packagingTypeName}
                  onChange={formik.handleChange}
                  error={formik.touched.packagingTypeName && Boolean(formik.errors.packagingTypeName)}
                  helperText={formik.touched.packagingTypeName && formik.errors.packagingTypeName}
                  size="small"
                />
              </Grid>

              {/* Packaging Dimensions UoM */}
              <Grid item xs={12} md={2.4}>
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
                  {unitsofMeasurement.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Packaging Dimensions */}
              <Grid item xs={12} md={2.4}>
                <TextField
                  fullWidth
                  id="packagingLength"
                  name="packagingLength"
                  label="Package length" type='number'
                  value={formik.values.packagingLength}
                  onBlur = {formik.handleBlur}
                  onChange={formik.handleChange}
                  error={formik.touched.packagingLength && Boolean(formik.errors.packagingLength)}
                  helperText={formik.touched.packagingLength && formik.errors.packagingLength}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <TextField
                  fullWidth
                  id="packagingWidth"
                  name="packagingWidth"
                  onBlur = {formik.handleBlur}
                  label="Package width" type='number'
                  value={formik.values.packagingWidth}
                  onChange={formik.handleChange}
                  error={formik.touched.packagingWidth && Boolean(formik.errors.packagingWidth)}
                  helperText={formik.touched.packagingWidth && formik.errors.packagingWidth}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <TextField
                  fullWidth
                  id="packagingHeight"
                  name="packagingHeight"
                  label="Package height" type='number'
                  value={formik.values.packagingHeight}
                  onChange={formik.handleChange}
                  onBlur = {formik.handleBlur}
                  error={formik.touched.packagingHeight && Boolean(formik.errors.packagingHeight)}
                  helperText={formik.touched.packagingHeight && formik.errors.packagingHeight}
                  size="small"
                />
              </Grid>
                <Grid item xs={12} md={2.4}>
                <TextField 
                  fullWidth size='small' disabled
                  label="Volume"
                  value={
                    Number(formik.values.packagingLength || 1) *
                    Number(formik.values.packagingWidth || 1) *
                    Number(formik.values.packagingHeight || 1)
                  }

                  InputProps={{ readOnly: true }}
                />
              </Grid>
              {/* Handling Unit Type Dropdown */}
              <Grid item xs={12} md={2.4}>
                <TextField
                  fullWidth
                  id="handlingUnitType"
                  name="handlingUnitType"
                  label="Handling unit type"
                  value={formik.values.handlingUnitType}
                  onChange={formik.handleChange}
                  onBlur = {formik.handleBlur}
                  error={formik.touched.handlingUnitType && Boolean(formik.errors.handlingUnitType)}
                  helperText={formik.touched.handlingUnitType && formik.errors.handlingUnitType}
                  size="small"
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Box sx={{ marginTop: 3, textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#83214F",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#fff",
                    color: "#83214F"
                  }
                }}
              >
                {isEditing ? "Update package" : "Create package"}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  formik.resetForm()
                  setIsEditing(false);
                  setEditRow(null);
                }}
                style={{ marginLeft: "10px" }}>Reset
              </Button>
            </Box>
          </form>
        </Box>

      </Collapse>

      {/* Data grid */}
      <div style={{ marginTop: "40px" }}>
        {isLoading ? (
          <DataGridSkeletonLoader columns={columns} />
        ) : (
          <DataGridComponent
            columns={columns}
            rows={rows}
            rowCount={allData && allData?.length}
            isLoading={isLoading}
            paginationModel={paginationModel}
            activeEntity='packages'
            onPaginationModelChange={handlePaginationModelChange}
          />
        )}
      </div>
    </>
  );
};

export default PackagingForm;
