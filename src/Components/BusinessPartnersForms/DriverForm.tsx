import React from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import { useFormikContext } from 'formik';
import styles from './BusinessPartners.module.css'
import { DataGridComponent } from '../GridComponent';
interface DriverFormValues {
  drivingLicense: string;
  fromTime: string;
  toTime: string;
  experience: string;
}

const dummyDriverData = [
  {
    id: 1,
    drivingLicense: 'DL123456789',
    fromTime: '08:00 AM',
    toTime: '05:00 PM',
    experience: '5 years',
  },
  {
    id: 2,
    drivingLicense: 'DL987654321',
    fromTime: '09:00 AM',
    toTime: '06:00 PM',
    experience: '3 years',
  },
  {
    id: 3,
    drivingLicense: 'DL112233445',
    fromTime: '07:00 AM',
    toTime: '04:00 PM',
    experience: '7 years',
  },
  {
    id: 4,
    drivingLicense: 'DL556677889',
    fromTime: '10:00 AM',
    toTime: '07:00 PM',
    experience: '2 years',
  },
  {
    id: 5,
    drivingLicense: 'DL998877665',
    fromTime: '06:00 AM',
    toTime: '03:00 PM',
    experience: '10 years',
  },
];

const driverColumns = [
  { field: 'drivingLicense', headerName: 'Driving License', width: 200 },
  { field: 'fromTime', headerName: 'From Time', width: 150 },
  { field: 'toTime', headerName: 'To Time', width: 150 },
  { field: 'experience', headerName: 'Experience', width: 150 },
];


const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

const DriverForm: React.FC = () => {
  const { values, handleChange, handleBlur, errors, touched } = useFormikContext<DriverFormValues>();

  return (
    <div>
      <h3 className={styles.mainHeding}>Driver Details</h3>
      <Grid container spacing={2}>
        {/* Driving License */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Driving License"
            name="drivingLicense"
            value={values.drivingLicense}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.drivingLicense && Boolean(errors.drivingLicense)}
            helperText={touched.drivingLicense && errors.drivingLicense}
          />
        </Grid>

        {/* From Time */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="From Time"
            name="fromTime"
            value={values.fromTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.fromTime && Boolean(errors.fromTime)}
            helperText={touched.fromTime && errors.fromTime}
          >
            {hours.map((hour) => (
              <MenuItem key={hour} value={hour}>
                {hour}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* To Time */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="To Time"
            name="toTime"
            value={values.toTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.toTime && Boolean(errors.toTime)}
            helperText={touched.toTime && errors.toTime}
          >
            {hours.map((hour) => (
              <MenuItem key={hour} value={hour}>
                {hour}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Experience */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Experience (Years)"
            name="experience"
            type="number"
            value={values.experience}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.experience && Boolean(errors.experience)}
            helperText={touched.experience && errors.experience}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '50px' }}>
        <DataGridComponent
          columns={driverColumns}
          rows={dummyDriverData}
          isLoading={false}
          pageSizeOptions={[10, 20]}
          initialPageSize={10}
        />
      </Grid>
    </div>
  );
};

export default DriverForm;
