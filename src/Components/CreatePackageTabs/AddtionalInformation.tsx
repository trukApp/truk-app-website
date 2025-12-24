// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from 'react';
// import { useFormikContext, Field } from 'formik';
// import {
//     Grid,
//     TextField,
//     Checkbox,
//     FormControlLabel,
//     Button,
//     Typography,
//     MenuItem,
// } from '@mui/material';
// import { useImageUploadingMutation } from '@/api/apiSlice';

// interface AdditionalInfo {
//     referenceId: string;
//     invoiceNumber: string;
//     poNumber: string;
//     salesOrderNumber: string;
//     department: string;
//     deliveryType: string;
//     deliveryMode: string;
//     stnDoNumber?: string;
//     valueOfGoods: number | '';
//     eWayBillFile?: File | null;
//     eWayBillNumber?: string; // to store uploaded file url or name
//     returnLabel: boolean;
//     file: File | string | null;
// }

// interface FormValues {
//     additionalInfo: AdditionalInfo;
// }


// const AdditionalInformation: React.FC = () => {
//     const { values, touched, errors, setFieldValue } = useFormikContext<FormValues>();
//     console.log("Additional Information values: ", values)

//     const [selectedFileName, setSelectedFileName] = useState<string>(
//         typeof values.additionalInfo.file === 'string'
//             ? values.additionalInfo.file.split('/').pop() || ''
//             : values.additionalInfo.file?.name || ''
//     );

//     const [selectedEWayFileName, setSelectedEWayFileName] = useState<string>(
//         values.additionalInfo.eWayBillNumber || ''
//     );

//     const [imageUpload] = useImageUploadingMutation();

//     const uploadFile = async (
//         file: File | null,
//         setFieldFn: (value: any) => void,
//         fieldName: keyof AdditionalInfo,
//         setFileNameFn: (name: string) => void
//     ) => {
//         if (!file) return;
//         try {
//             const formData = new FormData();
//             formData.append('image', file);

//             const response = await imageUpload(formData).unwrap();
//             if (response?.imageUrl) {
//                 setFieldFn(response.imageUrl);
//                 setFileNameFn(response.imageUrl.split('/').pop() || '');
//             }
//         } catch (error) {
//             console.error('File upload failed:', error);
//         }
//     };

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0] || null;
//         setSelectedFileName(file?.name || '');
//         setFieldValue('additionalInfo.file', file);

//         uploadFile(file, (val) => setFieldValue('additionalInfo.file', val), 'file', setSelectedFileName);
//     };

//     const handleEWayFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0] || null;
//         setSelectedEWayFileName(file?.name || '');
//         setFieldValue('additionalInfo.eWayBillFile', file);

//         uploadFile(file, (val) => setFieldValue('additionalInfo.eWayBillFile', val), 'eWayBillFile', setSelectedEWayFileName);
//     };

//     return (
//         <Grid className="formsBgContainer" sx={{ padding: 2 }}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', marginLeft: 1, marginTop: 3 }}>
//                 Shipment Details
//             </Typography>

//             <Grid container spacing={2}>

//                 {/* Reference ID - optional */}
//                 <Grid item xs={12} md={2.4}>
//                     <Field name="additionalInfo.referenceId">
//                         {({ field }: any) => (
//                             <TextField
//                                 {...field}
//                                 label="Order Reference Number"
//                                 fullWidth
//                                 size="small"
//                                 error={touched.additionalInfo?.referenceId && Boolean(errors.additionalInfo?.referenceId)}
//                                 helperText={touched.additionalInfo?.referenceId && errors.additionalInfo?.referenceId}
//                             />
//                         )}
//                     </Field>
//                 </Grid>

//                 {/* Invoice Number - mandatory */}
//                 <Grid item xs={12} md={2.4}>
//                     <Field name="additionalInfo.invoiceNumber">
//                         {({ field }: any) => (
//                             <TextField
//                                 {...field}
//                                 label="Invoice Number *"
//                                 fullWidth
//                                 size="small"
//                                 error={touched.additionalInfo?.invoiceNumber && Boolean(errors.additionalInfo?.invoiceNumber)}
//                                 helperText={touched.additionalInfo?.invoiceNumber && errors.additionalInfo?.invoiceNumber}
//                             />
//                         )}
//                     </Field>
//                 </Grid>

//                 {/* PO Number - mandatory */}
//                 <Grid item xs={12} md={2.4}>
//                     <Field name="additionalInfo.poNumber">
//                         {({ field }: any) => (
//                             <TextField
//                                 {...field}
//                                 label="PO Number *"
//                                 fullWidth
//                                 size="small"
//                                 error={touched.additionalInfo?.poNumber && Boolean(errors.additionalInfo?.poNumber)}
//                                 helperText={touched.additionalInfo?.poNumber && errors.additionalInfo?.poNumber}
//                             />
//                         )}
//                     </Field>
//                 </Grid>

//                 {/* Sales Order Number - mandatory */}
//                 <Grid item xs={12} md={2.4}>
//                     <Field name="additionalInfo.salesOrderNumber">
//                         {({ field }: any) => (
//                             <TextField
//                                 {...field}
//                                 label="Sales Order Number *"
//                                 fullWidth
//                                 size="small"
//                                 error={touched.additionalInfo?.salesOrderNumber && Boolean(errors.additionalInfo?.salesOrderNumber)}
//                                 helperText={touched.additionalInfo?.salesOrderNumber && errors.additionalInfo?.salesOrderNumber}
//                             />
//                         )}
//                     </Field>
//                 </Grid>

//                 {/* Department - mandatory */}
//                 <Grid item xs={12} md={2.4}>
//                     <Field name="additionalInfo.department">
//                         {({ field }: any) => (
//                             <TextField
//                                 {...field}
//                                 label="Department *"
//                                 fullWidth
//                                 size="small"
//                                 error={touched.additionalInfo?.department && Boolean(errors.additionalInfo?.department)}
//                                 helperText={touched.additionalInfo?.department && errors.additionalInfo?.department}
//                             />
//                         )}
//                     </Field>
//                 </Grid>

//                 {/* Delivery Type - mandatory select */}
//                 <Grid item xs={12} md={2.4}>
//                     <Field name="additionalInfo.deliveryType">
//                         {({ field }: any) => (
//                             <TextField
//                                 {...field}
//                                 select
//                                 label="Delivery Type *"
//                                 fullWidth
//                                 size="small"
//                                 error={touched.additionalInfo?.deliveryType && Boolean(errors.additionalInfo?.deliveryType)}
//                                 helperText={touched.additionalInfo?.deliveryType && errors.additionalInfo?.deliveryType}
//                             >
//                                 <MenuItem value="">Select Delivery Type</MenuItem>
//                                 {['Standard', 'Express', 'Overnight'].map((type) => (
//                                     <MenuItem key={type} value={type}>
//                                         {type}
//                                     </MenuItem>
//                                 ))}
//                             </TextField>
//                         )}
//                     </Field>
//                 </Grid>

//                 {/* Delivery Mode - mandatory select */}
//                 <Grid item xs={12} md={2.4}>
//                     <Field name="additionalInfo.deliveryMode">
//                         {({ field }: any) => (
//                             <TextField
//                                 {...field}
//                                 select
//                                 label="Delivery Mode *"
//                                 fullWidth
//                                 size="small"
//                                 error={touched.additionalInfo?.deliveryMode && Boolean(errors.additionalInfo?.deliveryMode)}
//                                 helperText={touched.additionalInfo?.deliveryMode && errors.additionalInfo?.deliveryMode}
//                             >
//                                 <MenuItem value="">Select Delivery Mode</MenuItem>
//                                 {['Road', 'Rail', 'Air', 'Sea', 'Multi Modal'].map((mode) => (
//                                     <MenuItem key={mode} value={mode}>
//                                         {mode}
//                                     </MenuItem>
//                                 ))}
//                             </TextField>
//                         )}
//                     </Field>
//                 </Grid>

//                 {/* STN / DO Number - optional */}
//                 <Grid item xs={12} md={2.4}>
//                     <Field name="additionalInfo.stnDoNumber">
//                         {({ field }: any) => (
//                             <TextField
//                                 {...field}
//                                 label="STN / DO Number"
//                                 fullWidth
//                                 size="small"
//                                 error={touched.additionalInfo?.stnDoNumber && Boolean(errors.additionalInfo?.stnDoNumber)}
//                                 helperText={touched.additionalInfo?.stnDoNumber && errors.additionalInfo?.stnDoNumber}
//                             />
//                         )}
//                     </Field>
//                 </Grid>

//                 {/* Value of Goods - mandatory */}
//                 <Grid item xs={12} md={2.4}>
//                     <Field name="additionalInfo.valueOfGoods">
//                         {({ field }: any) => (
//                             <TextField
//                                 {...field}
//                                 label="Value of Goods *"
//                                 type="number"
//                                 fullWidth
//                                 size="small"
//                                 error={touched.additionalInfo?.valueOfGoods && Boolean(errors.additionalInfo?.valueOfGoods)}
//                                 helperText={touched.additionalInfo?.valueOfGoods && errors.additionalInfo?.valueOfGoods}
//                             />
//                         )}
//                     </Field>
//                 </Grid>

//                 {/* E-Way Bill Number upload (file) */}
//                 {/* <Grid item xs={12} md={2.4}>
//                     <Typography sx={{ mb: 1 }}>E-Way Bill Document (If Applicable)</Typography>
//                     <TextField
//                         fullWidth
//                         size="small"
//                         variant="outlined"
//                         placeholder="Choose E-Way Bill file"
//                         value={selectedEWayFileName}
//                         InputProps={{
//                             readOnly: true,
//                             endAdornment: (
//                                 <Button
//                                     variant="contained"
//                                     component="label"
//                                     sx={{ minWidth: 'auto', margin: 0, marginRight: '-12px', height: '100%', color: '#fff' }}
//                                 >
//                                     Browse
//                                     <input
//                                         type="file"
//                                         hidden
//                                         accept="image/*,application/pdf"
//                                         onChange={handleEWayFileChange}
//                                     />
//                                 </Button>
//                             ),
//                         }}
//                         error={touched.additionalInfo?.eWayBillNumber && Boolean(errors.additionalInfo?.eWayBillNumber)}
//                         helperText={touched.additionalInfo?.eWayBillNumber && errors.additionalInfo?.eWayBillNumber}
//                     />
//                 </Grid> */}

//                 <Grid item xs={12} md={4.8}>
//                     <Typography sx={{ mb: 1 }}>Attachment File (Image/PDF) *</Typography>
//                     <TextField
//                         fullWidth
//                         size="small"
//                         variant="outlined"
//                         placeholder="Choose attachment file"
//                         value={selectedFileName}
//                         InputProps={{
//                             readOnly: true,
//                             endAdornment: (
//                                 <Button
//                                     variant="contained"
//                                     component="label"
//                                     sx={{ minWidth: 'auto', margin: 0, marginRight: '-12px', height: '100%', color: '#fff' }}
//                                 >
//                                     Browse
//                                     <input
//                                         type="file"
//                                         hidden
//                                         accept="image/*,application/pdf"
//                                         onChange={handleFileChange}
//                                     />
//                                 </Button>
//                             ),
//                         }}
//                         error={touched.additionalInfo?.file && Boolean(errors.additionalInfo?.file)}
//                         helperText={touched.additionalInfo?.file && errors.additionalInfo?.file}
//                     />
//                 </Grid>

//                 {/* E-Way Bill Document upload */}
//                 <Grid item xs={12} md={4.8}>
//                     <Typography sx={{ mb: 1 }}>E-Way Bill Document (If Applicable)</Typography>
//                     <TextField
//                         fullWidth
//                         size="small"
//                         variant="outlined"
//                         placeholder="Choose E-Way Bill file"
//                         value={selectedEWayFileName}
//                         InputProps={{
//                             readOnly: true,
//                             endAdornment: (
//                                 <Button
//                                     variant="contained"
//                                     component="label"
//                                     sx={{ minWidth: 'auto', margin: 0, marginRight: '-12px', height: '100%', color: '#fff' }}
//                                 >
//                                     Browse
//                                     <input
//                                         type="file"
//                                         hidden
//                                         accept="image/*,application/pdf"
//                                         onChange={handleEWayFileChange}
//                                     />
//                                 </Button>
//                             ),
//                         }}
//                         error={touched.additionalInfo?.eWayBillFile && Boolean(errors.additionalInfo?.eWayBillFile)}
//                         helperText={touched.additionalInfo?.eWayBillFile && errors.additionalInfo?.eWayBillFile}
//                     />
//                 </Grid>

//                 {/* Return Label checkbox */}
//                 <Grid item xs={12} md={2.4} sx={{ marginTop: '20px' }}>
//                     <Field name="additionalInfo.returnLabel">
//                         {({ field }: { field: { value: boolean; onChange: () => void; onBlur: () => void } }) => (
//                             <FormControlLabel
//                                 control={<Checkbox {...field} checked={field.value} />}
//                                 label="Return Label"
//                                 labelPlacement="end"
//                             />
//                         )}
//                     </Field>
//                 </Grid>

//             </Grid>
//         </Grid>
//     );
// };

// export default AdditionalInformation;



/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useFormikContext, Field } from 'formik';
import {
    Grid,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Typography,
    MenuItem,
} from '@mui/material';
import { useImageUploadingMutation } from '@/api/apiSlice';

interface AdditionalInfo {
    referenceId: string;
    invoiceNumber: string;
    poNumber: string;
    salesOrderNumber: string;
    department: string;
    deliveryType: string;
    deliveryMode: string;
    stnDoNumber?: string;
    valueOfGoods: number | '';
    eWayBillFile?: File | string | null;
    eWayBillNumber?: string;
    returnLabel: boolean;
    file: File | string | null;
}

interface FormValues {
    packages: {
        additionalInfo: AdditionalInfo;
    }[];
}

interface Props {
    index: number;
}

const AdditionalInformation: React.FC<Props> = ({ index }) => {
    const { values, touched, errors, setFieldValue } =
        useFormikContext<FormValues>();

    const pkg = values.packages[index];

    const [selectedFileName, setSelectedFileName] = useState<string>(
        typeof pkg.additionalInfo.file === 'string'
            ? pkg.additionalInfo.file.split('/').pop() || ''
            : pkg.additionalInfo.file?.name || ''
    );

    const [selectedEWayFileName, setSelectedEWayFileName] = useState<string>(
        pkg.additionalInfo.eWayBillNumber || ''
    );

    const [imageUpload] = useImageUploadingMutation();

    const uploadFile = async (
        file: File | null,
        fieldPath: string,
        setFileNameFn: (name: string) => void
    ) => {
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await imageUpload(formData).unwrap();
            if (response?.imageUrl) {
                setFieldValue(fieldPath, response.imageUrl);
                setFileNameFn(response.imageUrl.split('/').pop() || '');
            }
        } catch (error) {
            console.error('File upload failed:', error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFileName(file?.name || '');

        uploadFile(
            file,
            `packages.${index}.additionalInfo.file`,
            setSelectedFileName
        );
    };

    const handleEWayFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0] || null;
        setSelectedEWayFileName(file?.name || '');

        uploadFile(
            file,
            `packages.${index}.additionalInfo.eWayBillFile`,
            setSelectedEWayFileName
        );
    };

    return (
        <Grid className="formsBgContainer" sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, ml: 1 }}>
                Shipment Details
            </Typography>

            <Grid container spacing={2}>
                {/* 🔽 ALL OTHER FIELDS REMAIN SAME, ONLY PREFIX CHANGED */}

                <Grid item xs={12} md={2.4}>
                    <Field name={`packages.${index}.additionalInfo.referenceId`}>
                        {({ field }: any) => (
                            <TextField {...field} label="Order Reference Number" fullWidth size="small" />
                        )}
                    </Field>
                </Grid>

                <Grid item xs={12} md={2.4}>
                    <Field name={`packages.${index}.additionalInfo.invoiceNumber`}>
                        {({ field }: any) => (
                            <TextField {...field} label="Invoice Number *" fullWidth size="small" />
                        )}
                    </Field>
                </Grid>

                <Grid item xs={12} md={2.4}>
                    <Field name={`packages.${index}.additionalInfo.poNumber`}>
                        {({ field }: any) => (
                            <TextField {...field} label="PO Number *" fullWidth size="small" />
                        )}
                    </Field>
                </Grid>

                <Grid item xs={12} md={2.4}>
                    <Field name={`packages.${index}.additionalInfo.salesOrderNumber`}>
                        {({ field }: any) => (
                            <TextField {...field} label="Sales Order Number *" fullWidth size="small" />
                        )}
                    </Field>
                </Grid>

                <Grid item xs={12} md={2.4}>
                    <Field name={`packages.${index}.additionalInfo.department`}>
                        {({ field }: any) => (
                            <TextField {...field} label="Department *" fullWidth size="small" />
                        )}
                    </Field>
                </Grid>

                <Grid item xs={12} md={2.4}>
                    <Field name={`packages.${index}.additionalInfo.deliveryType`}>
                        {({ field }: any) => (
                            <TextField {...field} select label="Delivery Type *" fullWidth size="small">
                                <MenuItem value="">Select</MenuItem>
                                {['Standard', 'Express', 'Overnight'].map((t) => (
                                    <MenuItem key={t} value={t}>{t}</MenuItem>
                                ))}
                            </TextField>
                        )}
                    </Field>
                </Grid>

                <Grid item xs={12} md={2.4}>
                    <Field name={`packages.${index}.additionalInfo.deliveryMode`}>
                        {({ field }: any) => (
                            <TextField {...field} select label="Delivery Mode *" fullWidth size="small">
                                {['Road', 'Rail', 'Air', 'Sea', 'Multi Modal'].map((m) => (
                                    <MenuItem key={m} value={m}>{m}</MenuItem>
                                ))}
                            </TextField>
                        )}
                    </Field>
                </Grid>

                <Grid item xs={12} md={2.4}>
                    <Field name={`packages.${index}.additionalInfo.valueOfGoods`}>
                        {({ field }: any) => (
                            <TextField {...field} label="Value of Goods *" type="number" fullWidth size="small" />
                        )}
                    </Field>
                </Grid>

                {/* Attachment */}
                <Grid item xs={12} md={4.8}>
                    <Typography sx={{ mb: 1 }}>Attachment File *</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        value={selectedFileName}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <Button component="label" variant="contained">
                                    Browse
                                    <input hidden type="file" onChange={handleFileChange} />
                                </Button>
                            ),
                        }}
                    />
                </Grid>

                {/* E-Way Bill */}
                <Grid item xs={12} md={4.8}>
                    <Typography sx={{ mb: 1 }}>E-Way Bill (Optional)</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        value={selectedEWayFileName}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <Button component="label" variant="contained">
                                    Browse
                                    <input hidden type="file" onChange={handleEWayFileChange} />
                                </Button>
                            ),
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={2.4} sx={{ mt: 2 }}>
                    <Field name={`packages.${index}.additionalInfo.returnLabel`}>
                        {({ field }: any) => (
                            <FormControlLabel
                                control={<Checkbox {...field} checked={field.value} />}
                                label="Return Label"
                            />
                        )}
                    </Field>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AdditionalInformation;
