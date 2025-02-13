// 'use client';
// import React from 'react';
// import { Formik, Form, Field, FormikHelpers } from 'formik';
// import { Grid, TextField, Checkbox, FormControlLabel, Button } from '@mui/material';
// import * as Yup from 'yup';
// import styles from './CreatePackage.module.css';
// import { useAppDispatch, useAppSelector } from '@/store';
// import { setPackageAddtionalInfo } from '@/store/authSlice';

// export interface AdditionalInfo {
//     referenceId: string;
//     invoiceNumber: string;
//     poNumber: string;
//     salesOrderNumber: string;
//     department: string;
//     returnLabel: boolean;
// }

// interface FormValues {
//     additionalInfo: AdditionalInfo;
// }

// interface AdditionalInformationProps {
//     onNext: (values: FormValues) => void;
//     onBack: () => void;
// }


// // Validation Schema
// const validationSchema = Yup.object().shape({
//     additionalInfo: Yup.object().shape({
//         referenceId: Yup.string().required('Reference ID is required'),
//         invoiceNumber: Yup.string().required('Invoice # is required'),
//         poNumber: Yup.string().required('PO # is required'),
//         salesOrderNumber: Yup.string().required('Sales Order # is required'),
//         department: Yup.string().required('Department is required'),
//         returnLabel: Yup.boolean(),
//     }),
// });



// const AdditionalInformation: React.FC<AdditionalInformationProps> = ({ onNext, onBack }) => {
//     const dispatch = useAppDispatch()
//     const packageAddtionalInfoFromRedux = useAppSelector((state) => state.auth.packageAdditionalInfo)
//     console.log("packageAddtionalInfoFromRedux: ", packageAddtionalInfoFromRedux)

//     // Initial Values
//     const initialValues: FormValues = {
//         additionalInfo: packageAddtionalInfoFromRedux ? packageAddtionalInfoFromRedux : {
//             referenceId: '',
//             invoiceNumber: '',
//             poNumber: '',
//             salesOrderNumber: '',
//             department: '',
//             returnLabel: false,
//         },
//     };
//     // Submit Handler
//     const handleFormSubmit = (values: FormValues, actions: FormikHelpers<FormValues>, onNext: (values: FormValues) => void) => {
//         console.log('Form Submitted:', values);
//         dispatch(setPackageAddtionalInfo(values.additionalInfo))
//         onNext(values);
//         actions.setSubmitting(false);
//     };


//     return (
//         <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={(values, actions) => handleFormSubmit(values, actions, onNext)}
//         >
//             {({ touched, errors }) => (
//                 <Form>
//                     <Grid>
//                         <h3 className={styles.mainHeading}>Additional Information</h3>
//                         <Grid container spacing={2} className={styles.formsBgContainer}>
//                             <Grid item xs={12} md={2.4}>
//                                 <Field
//                                     as={TextField}
//                                     name="additionalInfo.referenceId"
//                                     label="Reference ID"
//                                     fullWidth

//                                     size="small"
//                                     error={touched.additionalInfo?.referenceId && Boolean(errors.additionalInfo?.referenceId)}
//                                     helperText={touched.additionalInfo?.referenceId && errors.additionalInfo?.referenceId}
//                                 />
//                             </Grid>

//                             <Grid item xs={12} md={2.4}>
//                                 <Field
//                                     as={TextField}
//                                     name="additionalInfo.invoiceNumber"
//                                     label="Invoice #"
//                                     fullWidth

//                                     size="small"
//                                     error={touched.additionalInfo?.invoiceNumber && Boolean(errors.additionalInfo?.invoiceNumber)}
//                                     helperText={touched.additionalInfo?.invoiceNumber && errors.additionalInfo?.invoiceNumber}
//                                 />
//                             </Grid>

//                             <Grid item xs={12} md={2.4}>
//                                 <Field
//                                     as={TextField}
//                                     name="additionalInfo.poNumber"
//                                     label="PO #"
//                                     fullWidth

//                                     size="small"
//                                     error={touched.additionalInfo?.poNumber && Boolean(errors.additionalInfo?.poNumber)}
//                                     helperText={touched.additionalInfo?.poNumber && errors.additionalInfo?.poNumber}
//                                 />
//                             </Grid>

//                             <Grid item xs={12} md={2.4}>
//                                 <Field
//                                     as={TextField}
//                                     name="additionalInfo.salesOrderNumber"
//                                     label="Sales Order #"
//                                     fullWidth

//                                     size="small"
//                                     error={touched.additionalInfo?.salesOrderNumber && Boolean(errors.additionalInfo?.salesOrderNumber)}
//                                     helperText={touched.additionalInfo?.salesOrderNumber && errors.additionalInfo?.salesOrderNumber}
//                                 />
//                             </Grid>

//                             <Grid item xs={12} md={2.4}>
//                                 <Field
//                                     as={TextField}
//                                     name="additionalInfo.department"
//                                     label="Department"
//                                     fullWidth

//                                     size="small"
//                                     error={touched.additionalInfo?.department && Boolean(errors.additionalInfo?.department)}
//                                     helperText={touched.additionalInfo?.department && errors.additionalInfo?.department}
//                                 />
//                             </Grid>

//                             <Grid item xs={12}>
//                                 <Field name="additionalInfo.returnLabel">
//                                     {({ field }: { field: { value: boolean; onChange: () => void; onBlur: () => void } }) => (
//                                         <FormControlLabel
//                                             control={<Checkbox {...field} checked={field.value} />}
//                                             label="Return Label"
//                                             labelPlacement="end"
//                                         />
//                                     )}
//                                 </Field>
//                             </Grid>

//                             {/* Navigation Buttons */}
//                             <Grid container spacing={2} justifyContent="center" marginTop={2}>
//                                 <Grid item>
//                                     <Button variant="outlined" onClick={onBack}  >
//                                         Back
//                                     </Button>
//                                 </Grid>
//                                 <Grid item>
//                                     <Button
//                                         type="submit"
//                                         variant="contained"
//                                         color="primary"
//                                     >
//                                         Next
//                                     </Button>
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                     </Grid>

//                 </Form>
//             )}
//         </Formik>
//     );
// };

// export default AdditionalInformation;



'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Grid, TextField, Checkbox, FormControlLabel, Button, Typography } from '@mui/material';
import * as Yup from 'yup';
import styles from './CreatePackage.module.css';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCompletedState, setPackageAddtionalInfo } from '@/store/authSlice';

export interface AdditionalInfo {
    referenceId: string;
    invoiceNumber: string;
    poNumber: string;
    salesOrderNumber: string;
    department: string;
    returnLabel: boolean;
    file: File | null;
}

interface FormValues {
    additionalInfo: AdditionalInfo;
}

interface AdditionalInformationProps {
    onNext: (values: FormValues) => void;
    onBack: () => void;
}

// Validation Schema
const validationSchema = Yup.object().shape({
    additionalInfo: Yup.object().shape({
        referenceId: Yup.string().required('Reference ID is required'),
        invoiceNumber: Yup.string().required('Invoice # is required'),
        poNumber: Yup.string().required('PO # is required'),
        salesOrderNumber: Yup.string().required('Sales Order # is required'),
        department: Yup.string().required('Department is required'),
        returnLabel: Yup.boolean(),
        // file: Yup.mixed().nullable().required('File is required'),
    }),
});

const AdditionalInformation: React.FC<AdditionalInformationProps> = ({ onNext, onBack }) => {
    const dispatch = useAppDispatch();
    const packageAddtionalInfoFromRedux = useAppSelector((state) => state.auth.packageAdditionalInfo);
    console.log("packageAddtionalInfoFromRedux: ", packageAddtionalInfoFromRedux);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Initial Values
    const initialValues: FormValues = {
        additionalInfo: packageAddtionalInfoFromRedux ? packageAddtionalInfoFromRedux : {
            referenceId: '',
            invoiceNumber: '',
            poNumber: '',
            salesOrderNumber: '',
            department: '',
            returnLabel: false,
            file: null,
        },
    };

    // File Change Handler
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: File | null) => void) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        setFieldValue('additionalInfo.file', file);
    };

    // Submit Handler
    const handleFormSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
        console.log('Form Submitted:', values);
        dispatch(setPackageAddtionalInfo(values.additionalInfo));
        dispatch(setCompletedState(4));
        onNext(values);
        actions.setSubmitting(false);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
        >
            {({ touched, errors, setFieldValue }) => (
                <Form>
                    <Typography variant="h6" sx={{fontWeight:'bold', textAlign:'center' , marginTop:3}}>Additional Details</Typography>
                    <Grid>
                        <h3 className={styles.mainHeading}>Additional Information</h3>
                        <Grid container spacing={2} className={styles.formsBgContainer}>
                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="additionalInfo.referenceId"
                                    label="Reference ID"
                                    fullWidth
                                    size="small"
                                    error={touched.additionalInfo?.referenceId && Boolean(errors.additionalInfo?.referenceId)}
                                    helperText={touched.additionalInfo?.referenceId && errors.additionalInfo?.referenceId}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="additionalInfo.invoiceNumber"
                                    label="Invoice #"
                                    fullWidth
                                    size="small"
                                    error={touched.additionalInfo?.invoiceNumber && Boolean(errors.additionalInfo?.invoiceNumber)}
                                    helperText={touched.additionalInfo?.invoiceNumber && errors.additionalInfo?.invoiceNumber}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="additionalInfo.poNumber"
                                    label="PO #"
                                    fullWidth
                                    size="small"
                                    error={touched.additionalInfo?.poNumber && Boolean(errors.additionalInfo?.poNumber)}
                                    helperText={touched.additionalInfo?.poNumber && errors.additionalInfo?.poNumber}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="additionalInfo.salesOrderNumber"
                                    label="Sales Order #"
                                    fullWidth
                                    size="small"
                                    error={touched.additionalInfo?.salesOrderNumber && Boolean(errors.additionalInfo?.salesOrderNumber)}
                                    helperText={touched.additionalInfo?.salesOrderNumber && errors.additionalInfo?.salesOrderNumber}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <Field
                                    as={TextField}
                                    name="additionalInfo.department"
                                    label="Department"
                                    fullWidth
                                    size="small"
                                    error={touched.additionalInfo?.department && Boolean(errors.additionalInfo?.department)}
                                    helperText={touched.additionalInfo?.department && errors.additionalInfo?.department}
                                />
                            </Grid>


                            {/* File Upload */}
                            <Grid item xs={12} md={4.8}>
                                <label>Upload File (Image/PDF)</label>
                                <Field name="additionalInfo.file">
                                    {() => (
                                        <>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                variant="outlined"
                                                value={selectedFile ? selectedFile.name : ''}
                                                placeholder="Choose a file"
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: (
                                                        <Button sx={{alignSelf:'flex-end'}}
                                                            variant="contained"
                                                            component="label"
                                                        >
                                                            Browse
                                                            <input
                                                                type="file"
                                                                hidden
                                                                accept="image/*, application/pdf"
                                                                onChange={(event) => handleFileChange(event, setFieldValue)}
                                                            />
                                                        </Button>
                                                    ),
                                                }}
                                                // error={touched.additionalInfo?.file && Boolean(errors.additionalInfo?.file)}
                                                // helperText={touched.additionalInfo?.file && errors.additionalInfo?.file}
                                            />
                                            {/* {selectedFile && <p>Selected File: {selectedFile.name}</p>} */}
                                        </>
                                    )}
                                </Field>
                            </Grid>
                            <Grid item xs={12} md={2.4} sx={{marginTop:'20px'}}>
                                <Field name="additionalInfo.returnLabel">
                                    {({ field }: { field: { value: boolean; onChange: () => void; onBlur: () => void } }) => (
                                        <FormControlLabel
                                            control={<Checkbox {...field} checked={field.value} />}
                                            label="Return Label"
                                            labelPlacement="end"
                                        />
                                    )}
                                </Field>
                            </Grid>

                            {/* Navigation Buttons */}
                            <Grid container spacing={2} justifyContent="center" marginTop={2}>
                                <Grid item>
                                    <Button variant="outlined" onClick={onBack}>
                                        Back
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button type="submit" variant="contained" color="primary">
                                        Next
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default AdditionalInformation;
