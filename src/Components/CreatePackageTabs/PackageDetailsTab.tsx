import React from "react";
import { Formik, Form, Field, FieldArray, FieldProps, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button, Grid, TextField, MenuItem, Tooltip, CircularProgress, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  // setCompletedState,
  setProductsList
} from "@/store/authSlice";
import styles from './CreatePackage.module.css';
import { useGetAllProductsQuery } from "@/api/apiSlice";
import { Product } from "@/app/productmaster/page";
import { CustomButtonFilled, CustomButtonOutlined } from "../ReusableComponents/ButtonsComponent";


interface PackageDetails {
  productId: string;
  productName: string;
  hsnCode: string;
  rfid: string;
  dimensions: string;
  quantity: string;
  weight: string;
  packagingType: string;
}

interface FormValues {
  packageDetails: PackageDetails[];
}

interface PackingDetailsTab {
  onNext: (values: FormValues) => void;
  onBack: () => void;
}

const PackageForm: React.FC<PackingDetailsTab> = ({ onNext, onBack }) => {
  const dispatch = useAppDispatch();
  const productListFromRedux = useAppSelector((state) => state.auth.packagesDetails);
  const { data: productsData, isLoading: isProductsLoading } = useGetAllProductsQuery({})
  const productIdOptions = productsData?.products.length > 0 ? productsData?.products : []
  console.log("products data :", productsData)
  const validationSchema = Yup.object().shape({
    packageDetails: Yup.array().of(
      Yup.object().shape({
        productId: Yup.string().required("Required"),
        productName: Yup.string().required("Required"),
        // hsnCode: Yup.string().required("Required"),
        // rfid: Yup.string().required("Required"),
        dimensions: Yup.string().required("Required"),
        quantity: Yup.string().required("Required"),
        weight: Yup.string().required("Required"),
        // packagingType: Yup.string().required("Required"),
      })
    ),
  });

  const initialValues: FormValues = {
    packageDetails:
      productListFromRedux.length > 0
        ? productListFromRedux
        : [
          {
            productId: "",
            productName: "",
            hsnCode: "",
            rfid: "",
            dimensions: "",
            quantity: "",
            weight: "",
            packagingType: "",
          },
        ],
  };

  const handleFormSubmit = (values: FormValues,) => {
    dispatch(setProductsList(values.packageDetails));
    // dispatch(setCompletedState(2));
    onNext(values);
  };

  const handleProductChange = (
    event: React.ChangeEvent<{ value: unknown }>,
    index: number,
    setFieldValue: FormikHelpers<FormValues>["setFieldValue"]
  ) => {
    const selectedProductId = event.target.value as string;
    const selectedProduct = productIdOptions.find(
      (product: Product) => product.product_ID === selectedProductId
    );

    setFieldValue(`packageDetails.${index}.productId`, selectedProductId);

    if (selectedProduct) {
      setFieldValue(`packageDetails.${index}.productName`, selectedProduct.product_name);
      setFieldValue(`packageDetails.${index}.hsnCode`, selectedProduct.hsn_code);
      setFieldValue(`packageDetails.${index}.weight`, `${selectedProduct.weight} ${selectedProduct.weight_uom}`);
      setFieldValue(`packageDetails.${index}.dimensions`, `${selectedProduct.volume} ${selectedProduct.volume_uom}`);
      setFieldValue(`packageDetails.${index}.packagingType`, selectedProduct.packaging_type[0]?.pac_ID);


    }
  };

  return (
    <Grid>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleFormSubmit}>
  {({ values, handleSubmit, setFieldValue }) => (
    <Form onSubmit={handleSubmit} className={styles.formsBgContainer}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>Package Details</Typography>
      <FieldArray name="packageDetails">
        {({ push, remove }) => (
          <>
            {values.packageDetails.map((_, index) => (
              <Grid container spacing={2} sx={{ marginTop: 1 }} key={index}>
                {Object.keys(initialValues.packageDetails[0]).map((fieldName) => (
                  <Grid item xs={12} md={2.4} key={fieldName}>
                    <Field name={`packageDetails.${index}.${fieldName}`}>
                      {({ field, meta }: FieldProps) => {
                        if (fieldName === "productId") {
                          return (
                            <TextField
                              {...field}
                              select
                              InputLabelProps={{ shrink: true }}
                              label="Product ID*"
                              fullWidth
                              onChange={(event) => handleProductChange(event, index, setFieldValue)}
                              size="small" 
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            >
                              {isProductsLoading ? (
                                <MenuItem disabled>
                                  <CircularProgress size={20} />
                                </MenuItem>
                              ) : (
                                productIdOptions?.map((product: Product) => (
                                  <MenuItem key={product.product_ID} value={String(product.product_ID)}>
                                    <Tooltip title={`${product.product_name}, ${product.product_desc}`} placement="right">
                                      <span style={{ flex: 1 }}>{product.product_ID}</span>
                                    </Tooltip>
                                  </MenuItem>
                                ))
                              )}
                            </TextField>
                          );
                        }
                        // else if (fieldName === "packagingType") {
                        //   return (
                        //     <TextField
                        //       {...field}
                        //       select
                        //       InputLabelProps={{ shrink: true }}
                        //       label="Packaging Type"
                        //       fullWidth
                        //       size="small"
                        //       error={meta.touched && Boolean(meta.error)}
                        //       helperText={meta.touched && meta.error}
                        //     >
                        //       {isPackagesLoading ? (
                        //         <MenuItem disabled>
                        //           <CircularProgress size={20} />
                        //         </MenuItem>
                        //       ) : (
                        //         getAllPackages.map((pkg:Package) => (
                        //           <MenuItem key={pkg.pac_ID} value={String(pkg.pac_ID)}>
                        //             {pkg.pac_ID}
                        //           </MenuItem>
                        //         ))
                        //       )}
                        //     </TextField>
                        //   );
                        // }
                        else {
                          return (
                            <TextField
                              {...field} disabled={fieldName !== "rfid" && fieldName !== "quantity" } 
                              InputLabelProps={{ shrink: true }} 
                              label={
                                    fieldName
                                        .replace(/([A-Z])/g, " $1") 
                                        .replace(/^./, (str) => str.toUpperCase())
                                        .trim() + " *"
                                    }

                                    fullWidth
                                    size="small"
                                    type={fieldName === "quantity" ? "number" : "text"}
                                    error={meta.touched && Boolean(meta.error)}
                                    helperText={meta.touched && meta.error}
                                  />
                                );
                              }
                            }}
                          </Field>
                        </Grid>
                      ))}

                      {values.packageDetails.length > 1 && (
                        <Grid item xs={12}>
                          <Button variant="outlined" size="small" color="secondary" onClick={() => remove(index)}>
                            Remove
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  ))}

                  <Grid item xs={12} style={{ marginTop: 10 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() =>
                        push({
                          productId: "",
                          productName: "",
                          hsnCode: "",
                          rfid: "",
                          dimensions: "",
                          quantity: "",
                          weight: "",
                          packagingType: "",
                        })
                      }
                    >
                      Add One More
                    </Button>
                  </Grid>
                </>
              )}
            </FieldArray>

            <Grid container spacing={2} justifyContent="center" marginTop={2}>
              <Grid item>
                {/* <Button variant="outlined" onClick={onBack}>
            Back
          </Button> */}
                <CustomButtonOutlined onClick={onBack}>Back</CustomButtonOutlined>
              </Grid>
              <Grid item>
                {/* <Button variant="contained" color="primary" type="submit">
            Next
          </Button> */}
                <CustomButtonFilled  >Next</CustomButtonFilled>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

    </Grid>
  );
};

export default PackageForm;
