import React, { useState } from 'react';
import { TextField, Grid, MenuItem, Box, Button, Collapse } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styles from './BusinessPartners.module.css';
import { DataGridComponent } from '../GridComponent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


interface AgentFormValues {
    agencyName: string;
    agencyId: string;
    serviceArea: string;
    modeOfTransport: string;
    contactNumber: string;
}

const dummyAgencyData = [
    { id: 1, agencyName: "FastTrack Logistics", agencyId: "AG001", serviceArea: "North America", modeOfTransport: "Road", contactNumber: "+1-555-123-4567" },
    { id: 2, agencyName: "SkyHigh Air Cargo", agencyId: "AG002", serviceArea: "Global", modeOfTransport: "Air", contactNumber: "+44-20-7946-0958" },
    { id: 3, agencyName: "Oceanic Shipping Co.", agencyId: "AG003", serviceArea: "Asia-Pacific", modeOfTransport: "Sea", contactNumber: "+91-22-3456-7890" },
    { id: 4, agencyName: "Urban Courier Services", agencyId: "AG004", serviceArea: "Urban Areas", modeOfTransport: "Bicycle", contactNumber: "+1-555-987-6543" },
    { id: 5, agencyName: "Interstate Movers", agencyId: "AG005", serviceArea: "United States", modeOfTransport: "Truck", contactNumber: "+1-800-555-6789" },
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
    const [showForm, setShowForm] = useState(false);

    const initialValues: AgentFormValues = {
        agencyName: '',
        agencyId: '',
        serviceArea: '',
        modeOfTransport: '',
        contactNumber: '',
    };

    const validationSchema = Yup.object({
        agencyName: Yup.string().required('Agency Name is required'),
        agencyId: Yup.string().required('Agency ID is required'),
        serviceArea: Yup.string().required('Service Area is required'),
        modeOfTransport: Yup.string().required('Mode of Transport is required'),
        contactNumber: Yup.string().required('Contact Number is required'),
    });

    const handleSubmit = (values: AgentFormValues) => {
        console.log('Agent Form Submitted:', values);
    };

    return (
        <div className={styles.formsMainContainer}>
            <Box display="flex" justifyContent="flex-end"  gap={2}>
                <Button
                    variant="contained"
                    onClick={() => setShowForm((prev) => !prev)}
                    className={styles.createButton}
                >
                    Create Agent
                    {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 4 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />}
                </Button>
            </Box>

            <Collapse in={showForm}>
                <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, handleChange, handleBlur, errors, touched }) => (
                            <Form>
                                <h3 className={styles.mainHeading}>Agent Details</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Agency Name"
                                            name="agencyName"
                                            value={values.agencyName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.agencyName && Boolean(errors.agencyName)}
                                            helperText={touched.agencyName && errors.agencyName}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Agency ID"
                                            name="agencyId"
                                            value={values.agencyId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.agencyId && Boolean(errors.agencyId)}
                                            helperText={touched.agencyId && errors.agencyId}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
                                            label="Service Area"
                                            name="serviceArea"
                                            value={values.serviceArea}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.serviceArea && Boolean(errors.serviceArea)}
                                            helperText={touched.serviceArea && errors.serviceArea}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
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

                                    <Grid item xs={12} sm={6} md={2.4}>
                                        <TextField
                                            fullWidth size='small'
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

                                <Box marginTop={3} textAlign="center">
                                    <Button type="submit" variant="contained" color="primary">
                                        Submit
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Collapse>

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
