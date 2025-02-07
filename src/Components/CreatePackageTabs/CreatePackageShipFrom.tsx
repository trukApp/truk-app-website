// 'use client';
// import React from 'react';
// import { Field, useFormikContext } from 'formik';
// import { Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
// import styles from './CreatePackage.module.css';
// interface ShipFrom {
//     locationId: string;
//     locationDescription: string;
//     contactPerson: string;
//     phoneNumber: string;
//     email: string;
//     addressLine1: string;
//     addressLine2: string;
//     city: string;
//     state: string;
//     country: string;
//     pincode: string;
//     saveAsNewLocationId: boolean;
//     saveAsDefaultShipFromLocation: boolean;
// }

// interface FormValues {
//     shipFrom: ShipFrom;
// }

// const ShipFrom = () => {
//     const { touched, errors } = useFormikContext<FormValues>();

//     return (
// <Grid container spacing={2} className={styles.formsBgContainer}>
//     <h3 className={styles.mainHeading}>Location Details</h3>
//     <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//             <Field
//                 name="shipFrom.locationId"
//                 as={TextField}
//                 label="Location ID"
//                 fullWidth
//                 required
//                 error={touched.shipFrom?.locationId && Boolean(errors.shipFrom?.locationId)}
//                 helperText={touched.shipFrom?.locationId && errors.shipFrom?.locationId}
//             />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//             <Field
//                 name="shipFrom.locationDescription"
//                 as={TextField}
//                 label="Location Description"
//                 fullWidth
//                 required
//                 error={touched.shipFrom?.locationDescription && Boolean(errors.shipFrom?.locationDescription)}
//                 helperText={touched.shipFrom?.locationDescription && errors.shipFrom?.locationDescription}
//             />
//         </Grid>
//     </Grid>

//     <h3 className={styles.mainHeading}>Contact Information</h3>
//     <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//             <Field
//                 name="shipFrom.contactPerson"
//                 as={TextField}
//                 label="Contact Person"
//                 fullWidth
//                 required
//                 error={touched.shipFrom?.contactPerson && Boolean(errors.shipFrom?.contactPerson)}
//                 helperText={touched.shipFrom?.contactPerson && errors.shipFrom?.contactPerson}
//             />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//             <Field
//                 name="shipFrom.phoneNumber"
//                 as={TextField}
//                 label="Phone Number"
//                 fullWidth
//                 required
//                 error={touched.shipFrom?.phoneNumber && Boolean(errors.shipFrom?.phoneNumber)}
//                 helperText={touched.shipFrom?.phoneNumber && errors.shipFrom?.phoneNumber}
//             />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//             <Field
//                 name="shipFrom.email"
//                 as={TextField}
//                 label="Email Address"
//                 fullWidth
//                 required
//                 error={touched.shipFrom?.email && Boolean(errors.shipFrom?.email)}
//                 helperText={touched.shipFrom?.email && errors.shipFrom?.email}
//             />
//         </Grid>
//     </Grid>

//     <h3 className={styles.mainHeading}>Address Information</h3>
//     <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//             <Field
//                 name="shipFrom.addressLine1"
//                 as={TextField}
//                 label="Address Line 1"
//                 fullWidth
//                 required
//                 error={touched.shipFrom?.addressLine1 && Boolean(errors.shipFrom?.addressLine1)}
//                 helperText={touched.shipFrom?.addressLine1 && errors.shipFrom?.addressLine1}
//             />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//             <Field
//                 name="shipFrom.addressLine2"
//                 as={TextField}
//                 label="Address Line 2"
//                 fullWidth
//                 required
//                 error={touched.shipFrom?.addressLine2 && Boolean(errors.shipFrom?.addressLine2)}
//                 helperText={touched.shipFrom?.addressLine2 && errors.shipFrom?.addressLine2}
//             />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//             <Field
//                 name="shipFrom.city"
//                 as={TextField}
//                 label="City"
//                 fullWidth
//                 required
//                 error={touched.shipFrom?.city && Boolean(errors.shipFrom?.city)}
//                 helperText={touched.shipFrom?.city && errors.shipFrom?.city}
//             />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//             <Field
//                 name="shipFrom.state"
//                 as={TextField}
//                 label="State"
//                 fullWidth
//                 required
//                 error={touched.shipFrom?.state && Boolean(errors.shipFrom?.state)}
//                 helperText={touched.shipFrom?.state && errors.shipFrom?.state}
//             />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//             <Field
//                 name="shipFrom.country"
//                 as={TextField}
//                 label="Country"
//                 fullWidth
//                 required
//                 error={touched.shipFrom?.country && Boolean(errors.shipFrom?.country)}
//                 helperText={touched.shipFrom?.country && errors.shipFrom?.country}
//             />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//             <Field
//                 name="shipFrom.pincode"
//                 as={TextField}
//                 label="Pincode"
//                 fullWidth
//                 required
//                 error={touched.shipFrom?.pincode && Boolean(errors.shipFrom?.pincode)}
//                 helperText={touched.shipFrom?.pincode && errors.shipFrom?.pincode}
//             />
//         </Grid>
//     </Grid>

//     <h3 className={styles.mainHeading}>Save Options</h3>
//     <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//             {/* <Field
//                 name="shipFrom.saveAsNewLocationId"
//                 type="checkbox"
//                 as={Checkbox}
//                 color="primary"
//                 id="saveAsNewLocationId"
//             /> */}
//             <FormControlLabel
//                 control={<Checkbox />}
//                 label="Save as new Location ID"
//                 name="shipFrom.saveAsNewLocationId"
//             />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//             <FormControlLabel
//                 control={<Checkbox />}
//                 label="Save as default Ship From Location"
//                 name="shipFrom.saveAsDefaultShipFromLocation"
//             />
//         </Grid>
//     </Grid>

// </Grid>
//     );
// };

// export default ShipFrom;


// 'use client';
// import React from 'react';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import { Checkbox, FormControlLabel, Grid, TextField, Button } from '@mui/material';
// import styles from './CreatePackage.module.css';

// interface ShipFromProps {
//     onNext: (values: any) => void; // Define `onNext` properly
// }

// const validationSchema = Yup.object({
//     shipFrom: Yup.object({
//         locationId: Yup.string().required('Location ID is required'),
//         locationDescription: Yup.string().required('Location Description is required'),
//         contactPerson: Yup.string().required('Contact Person is required'),
//         phoneNumber: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required('Phone Number is required'),
//         email: Yup.string().email('Invalid email').required('Email is required'),
//         addressLine1: Yup.string().required('Address Line 1 is required'),
//         city: Yup.string().required('City is required'),
//         state: Yup.string().required('State is required'),
//         country: Yup.string().required('Country is required'),
//         pincode: Yup.string().matches(/^\d{6}$/, 'Invalid pincode').required('Pincode is required'),
//         saveAsNewLocationId: Yup.boolean(),
//         saveAsDefaultShipFromLocation: Yup.boolean(),
//     })
// });


// const ShipFrom: React.FC<ShipFromProps> = ({ onNext }) => {
//     return (
//         <Formik
//             initialValues={{
//                 shipFrom: {
//                     locationId: '',
//                     locationDescription: '',
//                     contactPerson: '',
//                     phoneNumber: '',
//                     email: '',
//                     addressLine1: '',
//                     addressLine2: '',
//                     city: '',
//                     state: '',
//                     country: '',
//                     pincode: '',
//                     saveAsNewLocationId: false,
//                     saveAsDefaultShipFromLocation: false,
//                 }
//             }}
//             validationSchema={validationSchema}
//             onSubmit={(values) => {
//                 onNext(values); // Call `onNext` when form submits
//             }}
//         >
//             {({ touched, errors }) => (
//                 <Form>
//                     <Grid container spacing={2} className={styles.formsBgContainer}>
//                         <h3 className={styles.mainHeading}>Location Details</h3>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} sm={6}>
//                                 <Field
//                                     name="shipFrom.locationId"
//                                     as={TextField}
//                                     label="Location ID"
//                                     fullWidth
//                                     required
//                                     error={touched.shipFrom?.locationId && Boolean(errors.shipFrom?.locationId)}
//                                     helperText={touched.shipFrom?.locationId && errors.shipFrom?.locationId}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={6}>
//                                 <Field
//                                     name="shipFrom.locationDescription"
//                                     as={TextField}
//                                     label="Location Description"
//                                     fullWidth
//                                     required
//                                     error={touched.shipFrom?.locationDescription && Boolean(errors.shipFrom?.locationDescription)}
//                                     helperText={touched.shipFrom?.locationDescription && errors.shipFrom?.locationDescription}
//                                 />
//                             </Grid>
//                         </Grid>

//                         <h3 className={styles.mainHeading}>Contact Information</h3>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} sm={6}>
//                                 <Field
//                                     name="shipFrom.contactPerson"
//                                     as={TextField}
//                                     label="Contact Person"
//                                     fullWidth
//                                     required
//                                     error={touched.shipFrom?.contactPerson && Boolean(errors.shipFrom?.contactPerson)}
//                                     helperText={touched.shipFrom?.contactPerson && errors.shipFrom?.contactPerson}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={6}>
//                                 <Field
//                                     name="shipFrom.phoneNumber"
//                                     as={TextField}
//                                     label="Phone Number"
//                                     fullWidth
//                                     required
//                                     error={touched.shipFrom?.phoneNumber && Boolean(errors.shipFrom?.phoneNumber)}
//                                     helperText={touched.shipFrom?.phoneNumber && errors.shipFrom?.phoneNumber}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={6}>
//                                 <Field
//                                     name="shipFrom.email"
//                                     as={TextField}
//                                     label="Email Address"
//                                     fullWidth
//                                     required
//                                     error={touched.shipFrom?.email && Boolean(errors.shipFrom?.email)}
//                                     helperText={touched.shipFrom?.email && errors.shipFrom?.email}
//                                 />
//                             </Grid>
//                         </Grid>

//                         <h3 className={styles.mainHeading}>Address Information</h3>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} sm={6}>
//                                 <Field
//                                     name="shipFrom.addressLine1"
//                                     as={TextField}
//                                     label="Address Line 1"
//                                     fullWidth
//                                     required
//                                     error={touched.shipFrom?.addressLine1 && Boolean(errors.shipFrom?.addressLine1)}
//                                     helperText={touched.shipFrom?.addressLine1 && errors.shipFrom?.addressLine1}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={6}>
//                                 <Field
//                                     name="shipFrom.addressLine2"
//                                     as={TextField}
//                                     label="Address Line 2"
//                                     fullWidth
//                                     required
//                                     error={touched.shipFrom?.addressLine2 && Boolean(errors.shipFrom?.addressLine2)}
//                                     helperText={touched.shipFrom?.addressLine2 && errors.shipFrom?.addressLine2}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={6}>
//                                 <Field
//                                     name="shipFrom.city"
//                                     as={TextField}
//                                     label="City"
//                                     fullWidth
//                                     required
//                                     error={touched.shipFrom?.city && Boolean(errors.shipFrom?.city)}
//                                     helperText={touched.shipFrom?.city && errors.shipFrom?.city}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={6}>
//                                 <Field
//                                     name="shipFrom.state"
//                                     as={TextField}
//                                     label="State"
//                                     fullWidth
//                                     required
//                                     error={touched.shipFrom?.state && Boolean(errors.shipFrom?.state)}
//                                     helperText={touched.shipFrom?.state && errors.shipFrom?.state}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={6}>
//                                 <Field
//                                     name="shipFrom.country"
//                                     as={TextField}
//                                     label="Country"
//                                     fullWidth
//                                     required
//                                     error={touched.shipFrom?.country && Boolean(errors.shipFrom?.country)}
//                                     helperText={touched.shipFrom?.country && errors.shipFrom?.country}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={6}>
//                                 <Field
//                                     name="shipFrom.pincode"
//                                     as={TextField}
//                                     label="Pincode"
//                                     fullWidth
//                                     required
//                                     error={touched.shipFrom?.pincode && Boolean(errors.shipFrom?.pincode)}
//                                     helperText={touched.shipFrom?.pincode && errors.shipFrom?.pincode}
//                                 />
//                             </Grid>
//                         </Grid>

//                         <h3 className={styles.mainHeading}>Save Options</h3>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} sm={6}>
//                                 {/* <Field
//                         name="shipFrom.saveAsNewLocationId"
//                         type="checkbox"
//                         as={Checkbox}
//                         color="primary"
//                         id="saveAsNewLocationId"
//                     /> */}
//                                 <FormControlLabel
//                                     control={<Checkbox />}
//                                     label="Save as new Location ID"
//                                     name="shipFrom.saveAsNewLocationId"
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={6}>
//                                 <FormControlLabel
//                                     control={<Checkbox />}
//                                     label="Save as default Ship From Location"
//                                     name="shipFrom.saveAsDefaultShipFromLocation"
//                                 />
//                             </Grid>
//                         </Grid>

//                     </Grid>
//                 </Form>
//             )}
//         </Formik>
//     );
// };

// export default ShipFrom;



'use client';
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Checkbox, FormControlLabel, Grid, TextField, Button } from '@mui/material';
import styles from './CreatePackage.module.css';

interface ShipFromProps {
    onNext: (values: any) => void;
    // onBack: () => void;
}

const validationSchema = Yup.object({
    shipFrom: Yup.object({
        locationId: Yup.string().required('Location ID is required'),
        locationDescription: Yup.string().required('Location Description is required'),
        contactPerson: Yup.string().required('Contact Person is required'),
        phoneNumber: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required('Phone Number is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        addressLine1: Yup.string().required('Address Line 1 is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        country: Yup.string().required('Country is required'),
        pincode: Yup.string().matches(/^\d{6}$/, 'Invalid pincode').required('Pincode is required'),
        saveAsNewLocationId: Yup.boolean(),
        saveAsDefaultShipFromLocation: Yup.boolean(),
    })
});

const ShipFrom: React.FC<ShipFromProps> = ({ onNext, onBack }) => {
    return (
        <Formik
            initialValues={{
                shipFrom: {
                    locationId: '',
                    locationDescription: '',
                    contactPerson: '',
                    phoneNumber: '',
                    email: '',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    country: '',
                    pincode: '',
                    saveAsNewLocationId: false,
                    saveAsDefaultShipFromLocation: false,
                }
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                onNext(values);
            }}
        >
            {({ touched, errors, handleSubmit }) => (
                <Form>
                    <Grid container spacing={2} className={styles.formsBgContainer}>
                        <h3 className={styles.mainHeading}>Location Details</h3>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="shipFrom.locationId"
                                    as={TextField}
                                    label="Location ID"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.locationId && Boolean(errors.shipFrom?.locationId)}
                                    helperText={touched.shipFrom?.locationId && errors.shipFrom?.locationId}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="shipFrom.locationDescription"
                                    as={TextField}
                                    label="Location Description"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.locationDescription && Boolean(errors.shipFrom?.locationDescription)}
                                    helperText={touched.shipFrom?.locationDescription && errors.shipFrom?.locationDescription}
                                />
                            </Grid>
                        </Grid>

                        <h3 className={styles.mainHeading}>Contact Information</h3>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="shipFrom.contactPerson"
                                    as={TextField}
                                    label="Contact Person"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.contactPerson && Boolean(errors.shipFrom?.contactPerson)}
                                    helperText={touched.shipFrom?.contactPerson && errors.shipFrom?.contactPerson}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="shipFrom.phoneNumber"
                                    as={TextField}
                                    label="Phone Number"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.phoneNumber && Boolean(errors.shipFrom?.phoneNumber)}
                                    helperText={touched.shipFrom?.phoneNumber && errors.shipFrom?.phoneNumber}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="shipFrom.email"
                                    as={TextField}
                                    label="Email Address"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.email && Boolean(errors.shipFrom?.email)}
                                    helperText={touched.shipFrom?.email && errors.shipFrom?.email}
                                />
                            </Grid>
                        </Grid>

                        <h3 className={styles.mainHeading}>Address Information</h3>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="shipFrom.addressLine1"
                                    as={TextField}
                                    label="Address Line 1"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.addressLine1 && Boolean(errors.shipFrom?.addressLine1)}
                                    helperText={touched.shipFrom?.addressLine1 && errors.shipFrom?.addressLine1}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="shipFrom.addressLine2"
                                    as={TextField}
                                    label="Address Line 2"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="shipFrom.city"
                                    as={TextField}
                                    label="City"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.city && Boolean(errors.shipFrom?.city)}
                                    helperText={touched.shipFrom?.city && errors.shipFrom?.city}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="shipFrom.state"
                                    as={TextField}
                                    label="State"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.state && Boolean(errors.shipFrom?.state)}
                                    helperText={touched.shipFrom?.state && errors.shipFrom?.state}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="shipFrom.country"
                                    as={TextField}
                                    label="Country"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.country && Boolean(errors.shipFrom?.country)}
                                    helperText={touched.shipFrom?.country && errors.shipFrom?.country}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="shipFrom.pincode"
                                    as={TextField}
                                    label="Pincode"
                                    fullWidth
                                    required
                                    error={touched.shipFrom?.pincode && Boolean(errors.shipFrom?.pincode)}
                                    helperText={touched.shipFrom?.pincode && errors.shipFrom?.pincode}
                                />
                            </Grid>
                        </Grid>

                        <h3 className={styles.mainHeading}>Save Options</h3>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={<Field name="shipFrom.saveAsNewLocationId" type="checkbox" as={Checkbox} />}
                                    label="Save as new Location ID"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={<Field name="shipFrom.saveAsDefaultShipFromLocation" type="checkbox" as={Checkbox} />}
                                    label="Save as default Ship From Location"
                                />
                            </Grid>
                        </Grid>

                        {/* Back & Next Buttons */}
                        <Grid container spacing={2} justifyContent="space-between" marginTop={2}>
                            <Grid item>
                                <Button variant="outlined" onClick={onBack}>
                                    Back
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    // disabled={!isValid || !dirty}
                                    onClick={() => handleSubmit()}
                                >
                                    Next
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default ShipFrom;
