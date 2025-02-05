// 'use client';
// import React from 'react';
// import { Field } from 'formik';
// import { Grid, TextField } from '@mui/material';

// const ShipFrom = () => {
//     return (
//         <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//                 <Field name="shipFrom.locationId" as={TextField} label="Location ID" fullWidth required />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//                 <Field name="shipFrom.locationDescription" as={TextField} label="Location Description" fullWidth required />
//             </Grid>
//             <Grid item xs={12}>
//                 <Field name="shipFrom.detailedAddress" as={TextField} label="Detailed Address with Pincode" fullWidth required multiline rows={3} />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//                 <Field name="shipFrom.contactPerson" as={TextField} label="Contact Person" fullWidth required />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//                 <Field name="shipFrom.phoneNumber" as={TextField} label="Phone Number" fullWidth required />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//                 <Field name="shipFrom.email" as={TextField} label="Email Address" fullWidth required />
//             </Grid>
//         </Grid>
//     );
// };

// export default ShipFrom;


'use client';
import React from 'react';
import { Field } from 'formik';
import { Grid, TextField } from '@mui/material';
import styles from './CreatePackage.module.css'

const ShipFrom = () => {
    return (
        <Grid container spacing={2} className={styles.formsBgContainer}>
            <h3 className={styles.mainHeading}>Location Details</h3>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Field name="shipFrom.locationId" as={TextField} label="Location ID" fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field name="shipFrom.locationDescription" as={TextField} label="Location Description" fullWidth required />
                </Grid>
            </Grid>

            <h3 className={styles.mainHeading}>Contact Information</h3>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Field name="shipFrom.contactPerson" as={TextField} label="Contact Person" fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field name="shipFrom.phoneNumber" as={TextField} label="Phone Number" fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field name="shipFrom.email" as={TextField} label="Email Address" fullWidth required />
                </Grid>
            </Grid>

            {/* Address Fields */}
            <h3 className={styles.mainHeading}>Address Information</h3>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Field name="shipFrom.addressLine1" as={TextField} label="Address Line 1" fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field name="shipFrom.addressLine2" as={TextField} label="Address Line 2" fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field name="shipFrom.city" as={TextField} label="City" fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field name="shipFrom.state" as={TextField} label="State" fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field name="shipFrom.country" as={TextField} label="Country" fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field name="shipFrom.pincode" as={TextField} label="Pincode" fullWidth required />
                </Grid>
            </Grid>

        </Grid>
    );
};

export default ShipFrom;
