import React from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import { useFormikContext } from 'formik';
// import styles from './BusinessPartners.module.css'
import { DataGridComponent } from '../GridComponent';

interface AgentFormValues {
    agencyName: string;
    agencyId: string;
    serviceArea: string;
    modeOfTransport: string;
    contactNumber: string;
}

const dummyAgencyData = [
    {
        id: 1,
        agencyName: "FastTrack Logistics",
        agencyId: "AG001",
        serviceArea: "North America",
        modeOfTransport: "Road",
        contactNumber: "+1-555-123-4567",
    },
    {
        id: 2,
        agencyName: "SkyHigh Air Cargo",
        agencyId: "AG002",
        serviceArea: "Global",
        modeOfTransport: "Air",
        contactNumber: "+44-20-7946-0958",
    },
    {
        id: 3,
        agencyName: "Oceanic Shipping Co.",
        agencyId: "AG003",
        serviceArea: "Asia-Pacific",
        modeOfTransport: "Sea",
        contactNumber: "+91-22-3456-7890",
    },
    {
        id: 4,
        agencyName: "Urban Courier Services",
        agencyId: "AG004",
        serviceArea: "Urban Areas",
        modeOfTransport: "Bicycle",
        contactNumber: "+1-555-987-6543",
    },
    {
        id: 5,
        agencyName: "Interstate Movers",
        agencyId: "AG005",
        serviceArea: "United States",
        modeOfTransport: "Truck",
        contactNumber: "+1-800-555-6789",
    },
];


const agencyColumns = [
    { field: "agencyName", headerName: "Agency Name", width: 200 },
    { field: "agencyId", headerName: "Agency ID", width: 150 },
    { field: "serviceArea", headerName: "Service Area", width: 200 },
    { field: "modeOfTransport", headerName: "Mode of Transport", width: 200 },
    { field: "contactNumber", headerName: "Contact Number", width: 200 },
];


const transportModes = ['Road', 'Air', 'Sea', 'Rail'];

const AgentForm: React.FC = () => {
    const { values, handleChange, handleBlur, errors, touched } = useFormikContext<AgentFormValues>();

    return (
        <div>
            <h3>Agent Details</h3>
            <Grid container spacing={2}>
                {/* Agency Name */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Agency Name"
                        name="agencyName"
                        value={values.agencyName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.agencyName && Boolean(errors.agencyName)}
                        helperText={touched.agencyName && errors.agencyName}
                    />
                </Grid>

                {/* Agency ID */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Agency ID"
                        name="agencyId"
                        value={values.agencyId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.agencyId && Boolean(errors.agencyId)}
                        helperText={touched.agencyId && errors.agencyId}
                    />
                </Grid>

                {/* Service Area */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Service Area"
                        name="serviceArea"
                        value={values.serviceArea}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.serviceArea && Boolean(errors.serviceArea)}
                        helperText={touched.serviceArea && errors.serviceArea}
                    />
                </Grid>

                {/* Mode of Transport */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Mode of Transport"
                        name="modeOfTransport"
                        value={values.modeOfTransport}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.modeOfTransport && Boolean(errors.modeOfTransport)}
                        helperText={touched.modeOfTransport && errors.modeOfTransport}
                    >
                        {transportModes.map((mode) => (
                            <MenuItem key={mode} value={mode}>
                                {mode}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Contact Number */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Contact Number"
                        name="contactNumber"
                        value={values.contactNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.contactNumber && Boolean(errors.contactNumber)}
                        helperText={touched.contactNumber && errors.contactNumber}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12} style={{ marginTop: '50px' }}>
                <DataGridComponent
                    columns={agencyColumns}
                    rows={dummyAgencyData}
                    isLoading={false}
                    pageSizeOptions={[10, 20]}
                    initialPageSize={10}
                />
            </Grid>
        </div>
    );
};

export default AgentForm;
