"use client";
import React, { useState } from 'react';
import { Grid, TextField, Button, MenuItem, Box, Typography, Collapse } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DataGridComponent } from "../GridComponent";
import { GridColDef } from "@mui/x-data-grid";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './MasterData.module.css'

interface VehicleGroupValues {
  vehicleGroupId: string;
  vehicleGroupDescription: string;
  vehicleType: string;
}
const rows = Array.from({ length: 10 }, (_, id) => ({
  id,
  vehicleGroupId: `VG-${id + 1}`,
  vehicleGroupDescription: `Group Description ${id + 1}`,
  vehicleType: id % 3 === 0 ? "Truck" : id % 3 === 1 ? "Van" : "Container",
}));

// Columns Definition
const columns: GridColDef[] = [
  { field: "vehicleGroupId", headerName: "Vehicle Group ID", width: 200 },
  { field: "vehicleGroupDescription", headerName: "Vehicle Group Description", width: 300 },
  { field: "vehicleType", headerName: "Vehicle Type", width: 200 },
];

const VehicleGroup: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const initialValues: VehicleGroupValues = {
    vehicleGroupId: "",
    vehicleGroupDescription: "",
    vehicleType: "",
  };

  const validationSchema = Yup.object({
    vehicleGroupId: Yup.string().required("Vehicle Group ID is required"),
    vehicleGroupDescription: Yup.string().required("Vehicle Group Description is required"),
    vehicleType: Yup.string().required("Vehicle Type is required"),
  });

  const formik = useFormik<VehicleGroupValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Values:", values);
    },
  });

  return (
    <>
      <Box display="flex" justifyContent="flex-end" marginBottom={3} gap={2}>
        <Button
          variant="contained"
          onClick={() => setShowForm((prev) => !prev)}
          className={styles.createButton}
        >
          Create Vechile Group
          {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 8 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 8 }} />}
        </Button>
      </Box>
      <Collapse in={showForm}>
        <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h5" align="center" gutterBottom>
              Vehicle group Master
            </Typography>
            <Grid container spacing={2}>

              {/* Vehicle Group ID */}
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth size="small"
                  id="vehicleGroupId"
                  name="vehicleGroupId"
                  label="Vehicle Group ID"
                  value={formik.values.vehicleGroupId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.vehicleGroupId && Boolean(formik.errors.vehicleGroupId)}
                  helperText={formik.touched.vehicleGroupId && formik.errors.vehicleGroupId}
                />
              </Grid>

              {/* Vehicle Group Description */}
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField size="small"
                  fullWidth
                  id="vehicleGroupDescription"
                  name="vehicleGroupDescription"
                  label="Vehicle Group Description"
                  value={formik.values.vehicleGroupDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.vehicleGroupDescription &&
                    Boolean(formik.errors.vehicleGroupDescription)
                  }
                  helperText={
                    formik.touched.vehicleGroupDescription &&
                    formik.errors.vehicleGroupDescription
                  }
                />
              </Grid>

              {/* Vehicle Type */}
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  select size="small"
                  fullWidth
                  id="vehicleType"
                  name="vehicleType"
                  label="Vehicle Type"
                  value={formik.values.vehicleType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.vehicleType && Boolean(formik.errors.vehicleType)}
                  helperText={formik.touched.vehicleType && formik.errors.vehicleType}
                >
                  <MenuItem value="Truck">Truck</MenuItem>
                  <MenuItem value="Van">Van</MenuItem>
                  <MenuItem value="Container">Container</MenuItem>
                </TextField>
              </Grid>

              {/* Submit Button */}
              {/* <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
            </Button>
            </Grid> */}

            </Grid>
            <Box mt={3} textAlign='center' >
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Collapse>



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

export default VehicleGroup;
