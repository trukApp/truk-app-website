import React from "react";
import { Grid, TextField, Button, Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GridColDef } from "@mui/x-data-grid";
import { DataGridComponent } from "./GridComponent";

interface DeviceMasterValues {
  deviceId: string;
  deviceType: string;
  deviceUID: string;
  simImeiNumber: string;
  vehicleNumber: string;
  carrierId: string;
  locationId: string;
}
const rows = Array.from({ length: 10 }, (_, id) => ({
  id,
  deviceId: `DEV-${id + 1}`,
  deviceType: "GPS",
  deviceUID: `UID-${id + 1000}`,
  simImeiNumber: `123456789012345${id}`,
  vehicleNumber: `Vehicle-${id + 1}`,
  carrierId: `Carrier-${id + 1}`,
  locationId: `Location-${id + 1}`,
}));

const columns: GridColDef[] = [
  { field: "deviceId", headerName: "Device ID", width: 150 },
  { field: "deviceType", headerName: "Device Type", width: 150 },
  { field: "deviceUID", headerName: "Device UID", width: 200 },
  { field: "simImeiNumber", headerName: "SIM IMEI Number", width: 200 },
  { field: "vehicleNumber", headerName: "Vehicle Number", width: 150 },
  { field: "carrierId", headerName: "Carrier ID", width: 150 },
  { field: "locationId", headerName: "Location ID", width: 150 },
];

const DeviceMaster: React.FC = () => {
  const initialValues: DeviceMasterValues = {
    deviceId: "", // Auto-generated
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
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
    },
  });

    return (
      <>
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="h5" align="center" gutterBottom>
                Device Master
            </Typography>
        <Grid container spacing={2}>
            {/* Device ID */}
            <Grid item xs={12} sm={6} md={2.4}  >
            <TextField
                fullWidth size='small'
                id="deviceId"
                name="deviceId"
                // label="Device ID (Auto Generated)"
                value="Device ID (Auto Generated)"
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
            <Grid item xs={12} sm={6} md={2.4}>
            <TextField
                fullWidth size='small'
                id="carrierId"
                name="carrierId"
                label="Carrier ID"
                value={formik.values.carrierId}
                onChange={formik.handleChange}
            />
            </Grid>

            {/* Location ID */}
            <Grid item xs={12} sm={6} md={2.4}>
            <TextField
                fullWidth size='small'
                id="locationId"
                name="locationId"
                label="Location ID"
                value={formik.values.locationId}
                onChange={formik.handleChange}
            />
            </Grid>
        </Grid>
               <Box mt={3} textAlign='center' >
                <Button variant="contained" color="primary" type="submit">
                    Submit
                </Button>
            </Box>
        </form>
            
        <div style={{ marginTop: "80px" }}>
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

export default DeviceMaster;
