// import React, { useState } from 'react';
// import { Formik, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { Button, TextField, Box, Grid, Collapse } from '@mui/material';
// import { GridColDef } from '@mui/x-data-grid';
// import { DataGridComponent } from '../GridComponent';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import styles from './MasterData.module.css'

// interface FormValues {
//   unitName: string;
//   unitDescription: string;
//   altUnit: string;
//   altUnitDescription: string;
//   id: number;
// }

// const UnitsDummyData: FormValues[] = [
//   {
//     id: 1,
//     unitName: 'Kilogram',
//     unitDescription: 'Weight measurement unit',
//     altUnit: 'Gram',
//     altUnitDescription: 'Smaller unit of weight',
//   },
//   {
//     id: 2,
//     unitName: 'Meter',
//     unitDescription: 'Length measurement unit',
//     altUnit: 'Centimeter',
//     altUnitDescription: 'Smaller unit of length',
//   },
//   {
//     id: 3,
//     unitName: 'Litre',
//     unitDescription: 'Volume measurement unit',
//     altUnit: 'Millilitre',
//     altUnitDescription: 'Smaller unit of volume',
//   },
//   {
//     id: 4,
//     unitName: 'Hour',
//     unitDescription: 'Time measurement unit',
//     altUnit: 'Minute',
//     altUnitDescription: 'Smaller unit of time',
//   },
// ];


// const columns: GridColDef[] = [
//   { field: 'unitName', headerName: 'Unit Name', flex: 1 },
//   { field: 'unitDescription', headerName: 'Unit Description', flex: 2 },
//   { field: 'altUnit', headerName: 'Alt. Unit', flex: 1 },
//   { field: 'altUnitDescription', headerName: 'Alt. Unit Description', flex: 2 },
// ];


// const UnitsOfMeasurement: React.FC = () => {
//   const [showForm, setShowForm] = useState(false);

//   const validationSchema = Yup.object({
//     unitName: Yup.string().required('Unit Name is required'),
//     unitDescription: Yup.string().required('Unit Description is required'),
//     altUnit: Yup.string().required('Alt. Unit is required'),
//     altUnitDescription: Yup.string().required('Alt. Unit Description is required'),
//   });


//   const initialValues: FormValues = {
//     id: 1,
//     unitName: '',
//     unitDescription: '',
//     altUnit: '',
//     altUnitDescription: '',
//   };


//   const handleSubmit = (values: FormValues) => {
//     console.log('Form values:', values);
//   };

//   return (
//     <Box p={3}>
//       <Box display="flex" justifyContent="flex-end" marginBottom={3} gap={2}>
//         <Button
//           variant="contained"
//           onClick={() => setShowForm((prev) => !prev)}
//           className={styles.createButton}
//         >
//           Create Unit
//           {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 8 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 8 }} />}
//         </Button>
//       </Box>

//       <Collapse in={showForm}>
//         <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ handleChange, handleBlur, values, touched, errors }) => (
//               <Form>
//                 <Grid container spacing={2} style={{ marginBottom: '30px' }}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Unit Name*"
//                       name="unitName"
//                       value={values.unitName}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       variant="outlined"
//                       error={touched.unitName && Boolean(errors.unitName)}
//                       helperText={<ErrorMessage name="unitName" />}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Unit Description*"
//                       name="unitDescription"
//                       value={values.unitDescription}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       variant="outlined"
//                       error={touched.unitDescription && Boolean(errors.unitDescription)}
//                       helperText={<ErrorMessage name="unitDescription" />}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Alt. Unit*"
//                       name="altUnit"
//                       value={values.altUnit}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       variant="outlined"
//                       error={touched.altUnit && Boolean(errors.altUnit)}
//                       helperText={<ErrorMessage name="altUnit" />}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Alt. Unit Description*"
//                       name="altUnitDescription"
//                       value={values.altUnitDescription}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       variant="outlined"
//                       error={touched.altUnitDescription && Boolean(errors.altUnitDescription)}
//                       helperText={<ErrorMessage name="altUnitDescription" />}
//                     />
//                   </Grid>
//                 </Grid>

//                 <Box display="flex" justifyContent="center" gap={2}>
//                   <Button type="submit" variant="contained" color="primary">
//                     Submit
//                   </Button>
//                 </Box>
//               </Form>
//             )}
//           </Formik>
//         </Box>
//       </Collapse>

//       <Grid item xs={12} style={{ marginTop: '70px' }}>
//         <DataGridComponent
//           columns={columns}
//           rows={UnitsDummyData}
//           isLoading={false}
//           pageSizeOptions={[10, 20]}
//           initialPageSize={10}
//         />
//       </Grid>
//     </Box>
//   );
// };

// export default UnitsOfMeasurement;



import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Box, Grid, Collapse, MenuItem, Select, InputLabel, FormControl, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { DataGridComponent } from '../GridComponent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './MasterData.module.css';

interface FormValues {
  unitName: string;
  unitDescription: string;
  altUnit: string;
  altUnitDescription: string;
  id: number;
}

// Mapping for units and their alternate units
const unitMappings: Record<string, string[]> = {
  Ton: ['Kilogram', 'Gram', 'Milligram'],
  Kilogram: ['Gram', 'Milligram'],
  Gram: ['Milligram'],
  Litre: ['Millilitre'],
  Meter: ['Centimeter', 'Millimeter'],
  Hour: ['Minute', 'Second'],
};

const UnitsDummyData: FormValues[] = [
  { id: 1, unitName: 'Kilogram', unitDescription: 'Weight measurement unit', altUnit: 'Gram', altUnitDescription: 'Smaller unit of weight' },
  { id: 2, unitName: 'Meter', unitDescription: 'Length measurement unit', altUnit: 'Centimeter', altUnitDescription: 'Smaller unit of length' },
  { id: 3, unitName: 'Litre', unitDescription: 'Volume measurement unit', altUnit: 'Millilitre', altUnitDescription: 'Smaller unit of volume' },
  { id: 4, unitName: 'Hour', unitDescription: 'Time measurement unit', altUnit: 'Minute', altUnitDescription: 'Smaller unit of time' },
];

const columns: GridColDef[] = [
  { field: 'unitName', headerName: 'Unit Name', flex: 1 },
  { field: 'unitDescription', headerName: 'Unit Description', flex: 2 },
  { field: 'altUnit', headerName: 'Alt. Unit', flex: 1 },
  { field: 'altUnitDescription', headerName: 'Alt. Unit Description', flex: 2 },
];

const UnitsOfMeasurement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [altUnitOptions, setAltUnitOptions] = useState<string[]>([]);

  const validationSchema = Yup.object({
    unitName: Yup.string().required('Unit Name is required'),
    unitDescription: Yup.string().required('Unit Description is required'),
    altUnit: Yup.string().required('Alt. Unit is required'),
    altUnitDescription: Yup.string().required('Alt. Unit Description is required'),
  });

  const initialValues: FormValues = {
    id: 1,
    unitName: '',
    unitDescription: '',
    altUnit: '',
    altUnitDescription: '',
  };

  const handleUnitNameChange = (unitName: string, setFieldValue: (field: string, value: any) => void) => {
    setFieldValue('unitName', unitName);
    setAltUnitOptions(unitMappings[unitName] || []);
    setFieldValue('altUnit', '');
  };

  const handleSubmit = (values: FormValues) => {
    console.log('Form values:', values);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="flex-end" marginBottom={3} gap={2}>
        <Button
          variant="contained"
          onClick={() => setShowForm((prev) => !prev)}
          className={styles.createButton}
        >
          Create Unit
          {showForm ? <KeyboardArrowUpIcon style={{ marginLeft: 8 }} /> : <KeyboardArrowDownIcon style={{ marginLeft: 8 }} />}
        </Button>
      </Box>

      <Collapse in={showForm}>
        <Box marginBottom={4} padding={2} border="1px solid #ccc" borderRadius={2}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, setFieldValue, values, touched, errors }) => (
              <Form>
                <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Unit Name*</InputLabel>
                      <Select
                        name="unitName"
                        value={values.unitName}
                        onChange={(e) => handleUnitNameChange(e.target.value, setFieldValue)}
                        onBlur={handleBlur}
                        error={touched.unitName && Boolean(errors.unitName)}
                      >
                        {Object.keys(unitMappings).map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                      <ErrorMessage name="unitName" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Unit Description*"
                      name="unitDescription"
                      value={values.unitDescription}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      error={touched.unitDescription && Boolean(errors.unitDescription)}
                      helperText={<ErrorMessage name="unitDescription" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Alt. Unit*</InputLabel>
                      <Select
                        name="altUnit"
                        value={values.altUnit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.altUnit && Boolean(errors.altUnit)}
                        disabled={altUnitOptions.length === 0}
                      >
                        {altUnitOptions.map((altUnit) => (
                          <MenuItem key={altUnit} value={altUnit}>
                            {altUnit}
                          </MenuItem>
                        ))}
                      </Select>
                      <ErrorMessage name="altUnit" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Alt. Unit Description*"
                      name="altUnitDescription"
                      value={values.altUnitDescription}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      error={touched.altUnitDescription && Boolean(errors.altUnitDescription)}
                      helperText={<ErrorMessage name="altUnitDescription" />}
                    />
                  </Grid>
                </Grid>

                <Box display="flex" justifyContent="center" gap={2}>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Collapse>

      <Grid item xs={12} style={{ marginTop: '70px' }}>
        <DataGridComponent
          columns={columns}
          rows={UnitsDummyData}
          isLoading={false}
          pageSizeOptions={[10, 20]}
          initialPageSize={10}
        />
      </Grid>
    </Box>
  );
};

export default UnitsOfMeasurement;
