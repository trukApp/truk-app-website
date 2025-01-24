import React, { useEffect, useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Box, Grid, Collapse, MenuItem, Select, InputLabel, FormControl, TextField, IconButton } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { DataGridComponent } from '../GridComponent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './MasterData.module.css';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteUomMasterMutation, useEditUomMasterMutation, useGetUomMasterQuery, usePostUomMasterMutation } from '@/api/apiSlice';

interface FormValues {
  unitName: string;
  unitDescription: string;
  altUnit: string;
  altUnitDescription: string;
  id: string;
}
interface unitTypesBE {
  unit_name: string;
  unit_desc: string;
  alt_unit_name: string;
  alt_unit_desc: string;
  unit_id: string;
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


const UnitsOfMeasurement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [altUnitOptions, setAltUnitOptions] = useState<string[]>([]);
      const [isEditing, setIsEditing] = useState(false);
      const [editRow,setEditRow] = useState<FormValues | null>(null); ;
      const { data, error, isLoading } = useGetUomMasterQuery([]);
      const [postUom] = usePostUomMasterMutation();
      const [editUom] = useEditUomMasterMutation();
      const [deleteUom] = useDeleteUomMasterMutation()
    console.log("all uom :", data)
    if (isLoading) {
    console.log("Loading uom...");
  }

  if (error) {
    console.error("Error fetching uom:", error);
    // Handle the error case
  }
  const validationSchema = Yup.object({
    unitName: Yup.string().required('Unit Name is required'),
    unitDescription: Yup.string().required('Unit Description is required'),
    altUnit: Yup.string().required('Alt. Unit is required'),
    altUnitDescription: Yup.string().required('Alt. Unit Description is required'),
  });

  const initialFormValues = {
    id: '',
    unitName: '',
    unitDescription: '',
    altUnit: '',
    altUnitDescription: '',
  };
  const [initialValues, setInitialValues] = useState(initialFormValues );
   useEffect(() => {
   if (editRow) {
     setInitialValues(() => ({
       id: '',
       unitName: editRow?.unitName,
       unitDescription: editRow?.unitDescription,
       altUnit: editRow?.altUnit,
       altUnitDescription: editRow.altUnitDescription,
 
     }));
     setAltUnitOptions(unitMappings[editRow.unitName] || []);
  }
}, [editRow]);
  const handleUnitNameChange = (
    unitName: string,
    setFieldValue: (field: keyof FormValues, value: FormValues[keyof FormValues]) => void
  ) => {
    setFieldValue('unitName', unitName);
    setAltUnitOptions(unitMappings[unitName] || []);
    setFieldValue('altUnit', '');
  };


 const handleSubmit = async (values: FormValues, { resetForm }: { resetForm: () => void }) => {
        try {
          const body = {
              unit_name: values.unitName,
              unit_desc: values.unitDescription,
              alt_unit_name: values.altUnit,
              alt_unit_desc: values.altUnitDescription
          }
              const editBody =  {
                  unit_name: values.unitName,
                  unit_desc: values.unitDescription,
                  alt_unit_name: values.altUnit,
                  alt_unit_desc: values.altUnitDescription
              }
              console.log("uom body: ", body)
              if (isEditing && editRow) {
                console.log('edit uom body is :', editBody)
                const uomId = editRow.id
                const response = await editUom({ body: editBody, uomId }).unwrap()
                console.log("edit uom response is ", response)
                resetForm() 
                setShowForm(false)
                setIsEditing(false);
                setInitialValues({
                    id: '',
                    unitName: '',
                    unitDescription: '',
                    altUnit: '',
                    altUnitDescription: ''});       
                }
              else {
                console.log("post create uom :",body)
                const response = await postUom(body).unwrap();
                console.log('response in post uom :', response);
                resetForm()
                setShowForm(false);
                setIsEditing(false);
                setInitialValues({
                    id: '',
                    unitName: '',
                    unitDescription: '',
                    altUnit: '',
                    altUnitDescription: ''});
              }
          
        } catch (error) {
            console.error('API Error:', error);
        }

  }
const unitsData = data?.uomList.map((unit:unitTypesBE) => ({
  id:unit.unit_id ,
  unitName: unit.unit_name,
  unitDescription: unit.unit_desc,
  altUnit: unit.alt_unit_name,
  altUnitDescription: unit.alt_unit_desc,
}));
  
    const handleEdit = (row: FormValues) => {
    console.log("Edit row:", row);
    setShowForm(true)
    setIsEditing(true)
    setEditRow(row)
    };

const handleDelete = async (row: FormValues) => {
    const uomId = row?.id;
    if (!uomId) {
        console.error("Row ID is missing");
        return;
    }
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) {
        console.log("Delete canceled by user.");
        return;
    }

    try {
        const response = await deleteUom(uomId);
        console.log("Delete response:", response);
    } catch (error) {
        console.error("Error deleting uom:", error);
    }
};

const columns: GridColDef[] = [
  { field: 'unitName', headerName: 'Unit Name', width:150 },
  { field: 'unitDescription', headerName: 'Unit Description', width:300 },
  { field: 'altUnit', headerName: 'Alt. Unit', width:150 },
  { field: 'altUnitDescription', headerName: 'Alt. Unit Description', width: 300 },
  {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
];


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
        <Box marginBottom={4} padding={4} border="1px solid #ccc" borderRadius={2}>
          <Formik
            initialValues={initialValues} enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, setFieldValue, values, touched, errors,    }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <FormControl fullWidth size='small' >
                      <InputLabel>Unit Name*</InputLabel>
                      <Select
                        name="unitName" label= "Unit Name*"
                        value={values.unitName}
                        onChange={(e) => {
                          handleUnitNameChange(e.target.value, setFieldValue)
                          handleChange(e)
                        }}
                        onBlur={handleBlur}
                        error={touched.unitName && Boolean(errors.unitName)}
                      >
                        {Object.keys(unitMappings).map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                      <Box sx={{color:'red',fontSize:'12px'}}>
                         <ErrorMessage name="unitName" />
                      </Box>
                     
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
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
                  <Grid item xs={12} sm={6} md={2.4}>
                    <FormControl fullWidth size='small'>
                      <InputLabel>Alt. Unit*</InputLabel>
                      <Select
                        name="altUnit" label= 'Alt. Unit*'
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
                      <Box sx={{color:'red', fontSize:'12px'}}>
                          <ErrorMessage name="altUnit" />
                      </Box>
                  
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth size='small'
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

                <Box display="flex" justifyContent="center" gap={2} style={{ marginTop: '20px' }}>
                  <Button type="submit" variant="contained" color="primary">
                    {isEditing ? "Update UOM" : "Create UOM"}
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
          rows={unitsData}
          isLoading={false}
          pageSizeOptions={[10, 20]}
          initialPageSize={10}
        />
      </Grid>
    </Box>
  );
};

export default UnitsOfMeasurement;



// import React, { useEffect, useState } from 'react';
// import { Formik, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import {
//   Button,
//   Box,
//   Grid,
//   Collapse,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   TextField,
//   IconButton,
// } from '@mui/material';
// import { GridColDef } from '@mui/x-data-grid';
// import { DataGridComponent } from '../GridComponent';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// // import styles from './MasterData.module.css';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import {
//   useDeleteUomMasterMutation,
//   useEditUomMasterMutation,
//   useGetUomMasterQuery,
//   usePostUomMasterMutation,
// } from '@/api/apiSlice';

// interface FormValues {
//   unitName: string;
//   unitDescription: string;
//   altUnit: string;
//   altUnitDescription: string;
//   id: string;
// }

// interface UnitTypesBE {
//   unit_name: string;
//   unit_desc: string;
//   alt_unit_name: string;
//   alt_unit_desc: string;
//   unit_id: string;
// }

// // Mapping for units and their alternate units
// const unitMappings: Record<string, string[]> = {
//   Ton: ['Kilogram', 'Gram', 'Milligram'],
//   Kilogram: ['Gram', 'Milligram'],
//   Gram: ['Milligram'],
//   Litre: ['Millilitre'],
//   Meter: ['Centimeter', 'Millimeter'],
//   Hour: ['Minute', 'Second'],
// };

// const UnitsOfMeasurement: React.FC = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [altUnitOptions, setAltUnitOptions] = useState<string[]>([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editRow, setEditRow] = useState<FormValues | null>(null);

//   const { data, isLoading } = useGetUomMasterQuery([]);
//   const [postUom] = usePostUomMasterMutation();
//   const [editUom] = useEditUomMasterMutation();
//   const [deleteUom] = useDeleteUomMasterMutation();

//   const validationSchema = Yup.object({
//     unitName: Yup.string().required('Unit Name is required'),
//     unitDescription: Yup.string().required('Unit Description is required'),
//     altUnit: Yup.string().required('Alt. Unit is required'),
//     altUnitDescription: Yup.string().required('Alt. Unit Description is required'),
//   });

//   const initialFormValues: FormValues = {
//     id: '',
//     unitName: '',
//     unitDescription: '',
//     altUnit: '',
//     altUnitDescription: '',
//   };

//   const [initialValues, setInitialValues] = useState<FormValues>(initialFormValues);

//   useEffect(() => {
//     if (editRow) {
//       setInitialValues({
//         id: editRow.id,
//         unitName: editRow.unitName,
//         unitDescription: editRow.unitDescription,
//         altUnit: editRow.altUnit,
//         altUnitDescription: editRow.altUnitDescription,
//       });
//       setAltUnitOptions(unitMappings[editRow.unitName] || []);
//     }
//   }, [editRow]);

//   const handleUnitNameChange = (
//     unitName: string,
//     setFieldValue: (field: keyof FormValues, value: FormValues[keyof FormValues]) => void
//   ) => {
//     setFieldValue('unitName', unitName);
//     setAltUnitOptions(unitMappings[unitName] || []);
//     setFieldValue('altUnit', '');
//   };

//   const handleSubmit = async (values: FormValues, { resetForm }: { resetForm: () => void }) => {
//     try {
//       const body = {
//         unit_name: values.unitName,
//         unit_desc: values.unitDescription,
//         alt_unit_name: values.altUnit,
//         alt_unit_desc: values.altUnitDescription,
//       };

//       if (isEditing && editRow) {
//         const response = await editUom({ body, uomId: editRow.id }).unwrap();
//         console.log('Edit response:', response);
//       } else {
//         const response = await postUom(body).unwrap();
//         console.log('Create response:', response);
//       }

//       resetForm();
//       setShowForm(false);
//       setIsEditing(false);
//       setEditRow(null);
//     } catch (error) {
//       console.error('API Error:', error);
//     }
//   };

//   const unitsData = data?.uomList?.map((unit: UnitTypesBE) => ({
//     id: unit.unit_id,
//     unitName: unit.unit_name,
//     unitDescription: unit.unit_desc,
//     altUnit: unit.alt_unit_name,
//     altUnitDescription: unit.alt_unit_desc,
//   }));

//   const handleEdit = (row: FormValues) => {
//     setShowForm(true);
//     setIsEditing(true);
//     setEditRow(row);
//   };

//   const handleDelete = async (row: FormValues) => {
//     if (window.confirm('Are you sure you want to delete this item?')) {
//       try {
//         const response = await deleteUom(row.id).unwrap();
//         console.log('Delete response:', response);
//       } catch (error) {
//         console.error('Error deleting UOM:', error);
//       }
//     }
//   };

//   const columns: GridColDef[] = [
//     { field: 'unitName', headerName: 'Unit Name', width: 150 },
//     { field: 'unitDescription', headerName: 'Unit Description', width: 300 },
//     { field: 'altUnit', headerName: 'Alt. Unit', width: 150 },
//     { field: 'altUnitDescription', headerName: 'Alt. Unit Description', width: 300 },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       width: 150,
//       renderCell: (params) => (
//         <div>
//           <IconButton color="primary" onClick={() => handleEdit(params.row)}>
//             <EditIcon />
//           </IconButton>
//           <IconButton color="error" onClick={() => handleDelete(params.row)}>
//             <DeleteIcon />
//           </IconButton>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <Box p={3}>
//       <Box display="flex" justifyContent="flex-end" marginBottom={3}>
//         <Button
//           variant="contained"
//           onClick={() => {
//             setShowForm((prev) => !prev);
//             setIsEditing(false);
//             setEditRow(null);
//             setInitialValues(initialFormValues);
//           }}
//         >
//           {showForm ? 'Hide Form' : 'Create Unit'}
//           {showForm ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//         </Button>
//       </Box>

//       <Collapse in={showForm}>
//         <Box marginBottom={4} padding={4} border="1px solid #ccc" borderRadius={2}>
//           <Formik
//             initialValues={initialValues}
//             enableReinitialize
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ handleChange, handleBlur, setFieldValue, values, touched, errors }) => (
//               <Form>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <FormControl fullWidth>
//                       <InputLabel>Unit Name*</InputLabel>
//                       <Select
//                         name="unitName"
//                         value={values.unitName}
//                         onChange={(e) => {
//                           handleUnitNameChange(e.target.value, setFieldValue);
//                           handleChange(e);
//                         }}
//                         onBlur={handleBlur}
//                         error={touched.unitName && Boolean(errors.unitName)}
//                       >
//                         {Object.keys(unitMappings).map((unit) => (
//                           <MenuItem key={unit} value={unit}>
//                             {unit}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                       <ErrorMessage name="unitName" component="div"  />
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       fullWidth
//                       label="Unit Description*"
//                       name="unitDescription"
//                       value={values.unitDescription}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       error={touched.unitDescription && Boolean(errors.unitDescription)}
//                       helperText={<ErrorMessage name="unitDescription" />}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <FormControl fullWidth>
//                       <InputLabel>Alt. Unit*</InputLabel>
//                       <Select
//                         name="altUnit"
//                         value={values.altUnit}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={touched.altUnit && Boolean(errors.altUnit)}
//                         disabled={altUnitOptions.length === 0}
//                       >
//                         {altUnitOptions.map((altUnit) => (
//                           <MenuItem key={altUnit} value={altUnit}>
//                             {altUnit}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                       <ErrorMessage name="altUnit" component="div"   />
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <TextField
//                       fullWidth
//                       label="Alt. Unit Description*"
//                       name="altUnitDescription"
//                       value={values.altUnitDescription}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       error={touched.altUnitDescription && Boolean(errors.altUnitDescription)}
//                       helperText={<ErrorMessage name="altUnitDescription" />}
//                     />
//                   </Grid>
//                 </Grid>
//                 <Box display="flex" justifyContent="center" marginTop={3}>
//                   <Button type="submit" variant="contained" color="primary">
//                     {isEditing ? 'Update UOM' : 'Create UOM'}
//                   </Button>
//                 </Box>
//               </Form>
//             )}
//           </Formik>
//         </Box>
//       </Collapse>

//       <Grid item xs={12} style={{ marginTop: 70 }}>
//         <DataGridComponent
//           columns={columns}
//           rows={unitsData || []}
//           isLoading={isLoading}
//           pageSizeOptions={[10, 20]}
//           initialPageSize={10}
//         />
//       </Grid>
//     </Box>
//   );
// };

// export default UnitsOfMeasurement;
