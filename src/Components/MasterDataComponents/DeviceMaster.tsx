"use client";
import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, Box, Typography, Collapse, IconButton, Backdrop, CircularProgress, FormControl, InputLabel, Select, MenuItem, Tooltip, FormHelperText } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { DataGridComponent } from "../GridComponent";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './MasterData.module.css';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetDeviceMasterQuery, usePostDeviceMasterMutation, useEditDeviceMasterMutation, useDeleteDeviceMasterMutation, useGetLocationMasterQuery, useGetCarrierMasterQuery } from '@/api/apiSlice';
import MassUpload from '../MassUpload/MassUpload';
import DataGridSkeletonLoader from '../ReusableComponents/DataGridSkeletonLoader';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
import { Location } from './Locations';
import { CarrierFormBE } from '../BusinessPartnersForms/CarriersForm';


interface DeviceMasterValues {
  id: string;
  deviceId: string;
  deviceType: string;
  deviceUID: string;
  simImeiNumber: string;
  vehicleNumber: string;
  carrierId: string;
  locationId: string;
}

export interface DeviceInfoBE {
  carrier_ID: string;
  carrier_id: string;
  cr_id: string;
  dev_ID: string;
  device_UID: string;
  device_id: string;
  device_type: string;
  loc_ID: string;
  location_id: string
  sim_imei_num: string;
  vehicle_number: string;
}

const DeviceMaster: React.FC = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10, });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRow, setEditRow] = useState<DeviceMasterValues | null>(null);
  const { data, error, isLoading, refetch } = useGetDeviceMasterQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize });
  const [postDevice, { isLoading: postDeviceLoading, isSuccess: postSuccess, }] = usePostDeviceMasterMutation();
  const [editDevice, { isLoading: editDeviceLoading, isSuccess: editSuccess }] = useEditDeviceMasterMutation();
  const [deleteDevice, { isLoading: deleteDeviceLoading, isSuccess: deleteSuccess }] = useDeleteDeviceMasterMutation()
  const { data: locationsData, isLoading: isLocationLoading } = useGetLocationMasterQuery({});
  const { data: carriersData, isLoading: isCarrierLoading } = useGetCarrierMasterQuery({});
  const getAllLocations = locationsData?.locations.length > 0 ? locationsData?.locations : [];
  const getAllCarriers = carriersData?.carriers.length > 0 ? carriersData?.carriers : [];

  useEffect(() => {
    if (postSuccess || editSuccess || deleteSuccess) {
      refetch();
    }
  }, [postSuccess, editSuccess, deleteSuccess, refetch]);
  if (error) {
    console.error("Error fetching devices:", error);
  }
  const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  const handleFormSubmit = async (values: DeviceMasterValues) => {
    try {
      const body = {
        devices: [
          {
            device_type: values.deviceType,
            device_UID: values.deviceUID,
            sim_imei_num: values.simImeiNumber,
            vehicle_number: values.vehicleNumber,
            carrier_ID: values.carrierId,
            loc_ID: values.locationId
          },
        ]
      }
      const editBody = {
        device_type: values.deviceType,
        device_UID: values.deviceUID,
        sim_imei_num: values.simImeiNumber,
        vehicle_number: values.vehicleNumber,
        carrier_ID: values.carrierId,
        loc_ID: values.locationId
      }
      if (isEditing && editRow) {
        const deviceId = editRow.id
        const response = await editDevice({ body: editBody, deviceId }).unwrap()
        if (response?.updated_record) {
          setSnackbarMessage(`Device ID ${response.updated_record} updated successfully!`);
          formik.resetForm();
          setIsEditing(false)
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }
      }
      else {
        const response = await postDevice(body).unwrap();
        if (response?.created_records) {
          setSnackbarMessage(`Device ID ${response.created_records[0]} created successfully!`);
          formik.resetForm();
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }
      }

    } catch (error) {
      console.error('API Error:', error);
      setSnackbarMessage("Something went wrong! please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

  }
  const handleEdit = (row: DeviceMasterValues) => {
    setShowForm(true)
    setIsEditing(true)
    setEditRow(row)
  };

  const handleDelete = async (row: DeviceMasterValues) => {
    const deviceId = row?.id;
    if (!deviceId) {
      console.error("Row ID is missing");
      setSnackbarMessage("Error: Device ID is missing!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteDevice(deviceId);
      if (response.data.deleted_record) {
        setSnackbarMessage(`Device ID ${response.data.deleted_record} deleted successfully!`);
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error deleting device:", error);
      setSnackbarMessage("Failed to delete device. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const initialValues: DeviceMasterValues = {
    id: '',
    deviceId: "",
    deviceType: "GPS",
    deviceUID: "",
    simImeiNumber: "",
    vehicleNumber: "",
    carrierId: "",
    locationId: "",
  };

  const validationSchema = Yup.object({
    deviceType: Yup.string().required("Device Type is required"),
    deviceUID: Yup.string().required("Device UID is required"),
    simImeiNumber: Yup.string()
      .matches(/^\d+$/, "SIM IMEI Number must be numeric")
      .required("SIM IMEI Number is required"),
    vehicleNumber: Yup.string().required("Vehicle Number is required"),
  });

  const formik = useFormik<DeviceMasterValues>({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit
  });
  const rows = data?.devices.map((device: DeviceInfoBE) => ({
    id: device.device_id,
    deviceId: device.dev_ID,
    deviceType: device.device_type,
    deviceUID: device.device_UID,
    simImeiNumber: device.sim_imei_num,
    vehicleNumber: device.vehicle_number,
    carrierId: device.carrier_ID,
    locationId: device.loc_ID,
  }));

  const columns: GridColDef[] = [
    { field: "deviceId", headerName: "Device ID", width: 150 },
    { field: "deviceType", headerName: "Device Type", width: 150 },
    { field: "deviceUID", headerName: "Device UID", width: 200 },
    { field: "simImeiNumber", headerName: "SIM IMEI Number", width: 200 },
    { field: "vehicleNumber", headerName: "Vehicle Number", width: 150 },
    { field: "carrierId", headerName: "Carrier ID", width: 150 },
    { field: "locationId", headerName: "Location ID", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
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

  useEffect(() => {
    if (editRow) {
      formik.setValues({
        id: editRow.id || '',
        deviceId: editRow.deviceId,
        deviceType: editRow.deviceType,
        deviceUID: editRow.deviceUID,
        simImeiNumber: editRow.simImeiNumber,
        vehicleNumber: editRow.vehicleNumber,
        carrierId: editRow.carrierId,
        locationId: editRow.locationId,

      });
    }
  }, [editRow]);

  return (
    <>
      <Backdrop
        sx={{
          color: "#ffffff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={postDeviceLoading || editDeviceLoading || deleteDeviceLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
      <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '20px', md: '24px' } }} align="center" gutterBottom>
        Device master
      </Typography>
      <Box display="flex" justifyContent="flex-end" >
        <Button
          variant="contained"
          onClick={() => setShowForm((prev) => !prev)}
          className={styles.createButton}
        >
          Create Device
          {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 4 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />}
        </Button>
        <MassUpload arrayKey="devices" />
      </Box>


      <Collapse in={showForm}>
        <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              {/* Device ID */}
              <Grid item xs={12} sm={6} md={2.4}  >
                <TextField
                  fullWidth size='small'
                  id="deviceId"
                  name="deviceId"
                  label="Device ID (Auto Generated)"
                  value={formik.values.deviceId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled
                />
              </Grid>

              {/* Device Type */}
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth size='small'
                  id="deviceType"
                  name="deviceType"
                  label="Device Type"
                  value={formik.values.deviceType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.deviceType && Boolean(formik.errors.deviceType)}
                  helperText={formik.touched.deviceType && formik.errors.deviceType}
                />
              </Grid>

              {/* Device UID */}
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth size='small'
                  id="deviceUID"
                  name="deviceUID"
                  label="Device UID"
                  value={formik.values.deviceUID}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.deviceUID && Boolean(formik.errors.deviceUID)}
                  helperText={formik.touched.deviceUID && formik.errors.deviceUID}
                />
              </Grid>

              {/* SIM IMEI Number */}
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth size='small'
                  id="simImeiNumber"
                  name="simImeiNumber"
                  label="SIM IMEI Number"
                  value={formik.values.simImeiNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.simImeiNumber && Boolean(formik.errors.simImeiNumber)}
                  helperText={formik.touched.simImeiNumber && formik.errors.simImeiNumber}
                />
              </Grid>

              {/* Vehicle Number */}
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth size='small'
                  id="vehicleNumber"
                  name="vehicleNumber"
                  label="Vehicle Number"
                  value={formik.values.vehicleNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.vehicleNumber && Boolean(formik.errors.vehicleNumber)}
                  helperText={formik.touched.vehicleNumber && formik.errors.vehicleNumber}
                />
              </Grid>

              {/* Carrier ID */}
              {/* <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth size='small'
                  id="carrierId"
                  name="carrierId"
                  label="Carrier ID"
                  value={formik.values.carrierId}
                  onChange={formik.handleChange}
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl
                  fullWidth
                  size="small"
                  error={
                    formik.touched.carrierId && Boolean(formik.errors.carrierId)
                  }
                >
                  <InputLabel>Carrier ID</InputLabel>
                  <Select
                    label="Carrier ID"
                    name="carrierId"
                    value={formik.values.carrierId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >

                    {isCarrierLoading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} color="inherit" />
                        <span style={{ marginLeft: "10px" }}>Loading...</span>
                      </MenuItem>
                    ) : (
                      getAllCarriers?.map((carrier: CarrierFormBE) => (
                        <MenuItem key={carrier?.carrier_ID} value={String(carrier.carrier_ID)}>
                          <Tooltip
                            title={`${carrier?.carrier_name}, ${carrier?.carrier_address}`}
                            placement="right"
                          >
                            <span style={{ flex: 1 }}>{carrier?.carrier_ID}</span>
                          </Tooltip>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {formik.touched.carrierId && formik.errors.carrierId && (
                    <FormHelperText>{formik.errors.carrierId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Location ID */}
              {/* <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth size='small'
                  id="locationId"
                  name="locationId"
                  label="Location ID"
                  value={formik.values.locationId}
                  onChange={formik.handleChange}
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl
                  fullWidth
                  size="small"
                  error={
                    formik.touched.locationId && Boolean(formik.errors.locationId)
                  }
                >
                  <InputLabel>Location ID</InputLabel>
                  <Select
                    label="Location ID"
                    name="locationId"
                    value={formik.values.locationId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {isLocationLoading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} color="inherit" />
                        <span style={{ marginLeft: "10px" }}>Loading...</span>
                      </MenuItem>
                    ) : (
                      getAllLocations?.map((location: Location) => (
                        <MenuItem key={location.loc_ID} value={String(location.loc_ID)}>
                          <Tooltip
                            title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
                            placement="right"
                          >
                            <span style={{ flex: 1 }}>{location.loc_ID}</span>
                          </Tooltip>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {formik.touched.locationId && formik.errors.locationId && (
                    <FormHelperText>{formik.errors.locationId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Box mt={3} textAlign="center">
              <Button variant="contained" color="primary" type="submit">
                {isEditing ? "Update device" : "Create device"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  formik.resetForm();
                  setIsEditing(false);
                  setEditRow(null);
                }}
                style={{ marginLeft: "10px" }}
              >
                Reset
              </Button>
            </Box>

          </form>
        </Box>
      </Collapse>



      <div style={{ marginTop: "40px" }}>
        {isLoading ? (
          <DataGridSkeletonLoader columns={columns} />
        ) : (
          <DataGridComponent
            columns={columns}
            rows={rows}
            isLoading={isLoading}
            paginationModel={paginationModel}
            activeEntity='devices'
            onPaginationModelChange={handlePaginationModelChange}
          />
        )}
      </div>
    </>
  );
};

export default DeviceMaster;
