import React from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import { useFormikContext } from 'formik';

interface AgentFormValues {
    agencyName: string;
    agencyId: string;
    serviceArea: string;
    modeOfTransport: string;
    contactNumber: string;
}

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
        </div>
    );
};

export default AgentForm;
