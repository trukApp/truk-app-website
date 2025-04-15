import React, { useState } from "react";
import {
  Formik, Form, FieldArray, FieldProps, Field
} from "formik";
import * as Yup from "yup";
import { Grid, TextField, CircularProgress, Typography, Autocomplete } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store";
import { setProductsList } from "@/store/authSlice";
import styles from './CreatePackage.module.css';
import { useGetAllProductsQuery, useGetFilteredProductsQuery } from "@/api/apiSlice";
import { Product } from "@/app/productmaster/page";
import { CustomButtonFilled, CustomButtonOutlined } from "../ReusableComponents/ButtonsComponent";
import { useQuery } from '@apollo/client';
import { GET_ALL_PRODUCTS, SEARCH_PRODUCTS } from '@/api/graphqlApiSlice';
interface PackageDetails {
  productId: string;
  productName: string;
  hsnCode: string;
  rfid: string;
  dimensions: string;
  quantity: string;
  weight: string;
  packagingType: string;
  product_ID: string;
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

  // const { data: allProducts, isLoading: isAllProductsLoading } = useGetAllProductsQuery({});

  const { data: allProducts,loading: isAllProductsLoading } = useQuery(GET_ALL_PRODUCTS, {
    variables: {  },
  });
 
  const [searchKey, setSearchKey] = useState("");

  const {
    data: filteredProductsData,
    isFetching: isFilteredLoading
  } = useGetFilteredProductsQuery(searchKey.length >= 3 ? searchKey : null, {
    skip: searchKey.length < 3,
  });

// graphqlAPi
  const { loading, error, data, refetch } = useQuery(SEARCH_PRODUCTS, {
    variables: { searchKey: "", page: 1, limit: 10 },
    skip: true, // Skip initial execution until search is performed
  });
  const allProductList = allProducts?.getAllProducts.products || [];
  const filteredProducts = filteredProductsData?.results || [];

  const productOptions = searchKey.length >= 3 ? filteredProducts : allProductList;

  const validationSchema = Yup.object().shape({
    packageDetails: Yup.array().of(
      Yup.object().shape({
        productId: Yup.string().required("Required"),
        // productName: Yup.string().required("Required"),
        // dimensions: Yup.string().required("Required"),
        quantity: Yup.number()
          .min(1, "Quantity must be at least 1")
          .max(9999, "Quantity cannot exceed 99999")
          .required("Quantity is required"),
        // weight: Yup.string().required("Required"),
      })
    ),
  });

  // const initialValues: FormValues = {
  //   packageDetails: productListFromRedux.length > 0
  //     ? productListFromRedux
  //     : [{
  //       productId: "",
  //       productName: "",
  //       hsnCode: "",
  //       rfid: "",
  //       dimensions: "",
  //       quantity: "",
  //       weight: "",
  //       packagingType: "",
  //     }],
  // };
  const initialValues: FormValues = {
    packageDetails: productListFromRedux.length > 0
      ? productListFromRedux.map((p) => ({
        ...p,
        product_ID: p.productId || "",
      }))
      : [{
        product_ID: "",
        productId: "",
        productName: "",
        hsnCode: "",
        rfid: "",
        dimensions: "",
        quantity: "",
        weight: "",
        packagingType: "",
      }],
  };

  const handleFormSubmit = (values: FormValues) => {
    dispatch(setProductsList(values.packageDetails));
    onNext(values);
  };

  return (
    <Grid>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleFormSubmit}>
        {({ values, handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit} className={styles.formsBgContainer}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Package Details
            </Typography>
            <FieldArray name="packageDetails">
              {({ push, remove }) => (
                <>
                  {values.packageDetails.map((_, index) => (
                    <Grid container spacing={2} sx={{ marginTop: 1 }} key={index}>
                      <Grid item xs={12} md={2.4}>
                        <Autocomplete
                          freeSolo
                          options={productOptions}
                          loading={isAllProductsLoading || isFilteredLoading}
                          value={
                            allProductList.find(
                              (p: Product) => p.product_ID === values.packageDetails[index].productId
                            ) || null
                          }
                          getOptionLabel={(option: Product | string) => {
                            if (typeof option === "string") return option;
                            return `${option.product_ID} - ${option.product_name}`;
                          }}

                          renderOption={(props, option) => (
                            <li {...props} key={typeof option === "string" ? option : option.product_ID}>
                              {typeof option === "string"
                                ? option
                                : `${option.product_ID} - ${option.product_name}`}
                            </li>
                          )}
                          filterOptions={(options, { inputValue }) =>
                            options.filter((option) => {
                              const label = typeof option === "string"
                                ? option
                                : `${option.product_ID} ${option.product_name}`.toLowerCase();
                              return label.includes(inputValue.toLowerCase());
                            })
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Product ID *"
                              variant="outlined"
                              size="small"
                              onChange={(e) => {
                                const value = e.target.value;
                                setSearchKey(value);
                              }}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {(isAllProductsLoading || isFilteredLoading) ? (
                                      <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                          onChange={(e, selectedOption) => {
                            if (!selectedOption) {
                              setFieldValue(`packageDetails.${index}.productId`, '');
                              setFieldValue(`packageDetails.${index}.productName`, '');
                              setFieldValue(`packageDetails.${index}.hsnCode`, '');
                              setFieldValue(`packageDetails.${index}.weight`, '');
                              setFieldValue(`packageDetails.${index}.dimensions`, '');
                              setFieldValue(`packageDetails.${index}.packagingType`, '');
                              return;
                            }

                            const selected =
                              typeof selectedOption === "string"
                                ? allProductList.find((p: Product) => p.product_ID === selectedOption)
                                : selectedOption;

                            if (selected) {
                              setFieldValue(`packageDetails.${index}.productId`, selected.product_ID);
                              setFieldValue(`packageDetails.${index}.productName`, selected.product_name);
                              setFieldValue(`packageDetails.${index}.hsnCode`, selected.hsn_code);
                              setFieldValue(`packageDetails.${index}.weight`, `${selected.weight} ${selected.weight_uom}`);
                              setFieldValue(`packageDetails.${index}.dimensions`, `${selected.volume} ${selected.volume_uom}`);
                              setFieldValue(`packageDetails.${index}.packagingType`, selected.packaging_type[0]?.pac_ID);
                            }
                          }}
                        />
                      </Grid>

                      {["productName", "hsnCode", "rfid", "dimensions", "quantity", "weight", "packagingType"].map((fieldName) => (
                        <Grid item xs={12} md={2.4} key={fieldName}>
                          <Field name={`packageDetails.${index}.${fieldName}`}>
                            {({ field, meta }: FieldProps) => (
                              <TextField
                                {...field}
                                disabled={fieldName !== "rfid" && fieldName !== "quantity"}
                                label={
                                  fieldName.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())
                                }
                                fullWidth
                                size="small"
                                type={fieldName === "quantity" ? "number" : "text"}
                                error={meta.touched && Boolean(meta.error)}
                                helperText={meta.touched && meta.error}
                                      inputProps={
                        fieldName === "quantity"
                          ? {
                              min: 1,
                              onKeyDown: (e) => {
                                if (e.key === "-" || e.key === "e") {
                                  e.preventDefault();
                                }
                              },
                            }
                          : {}
                      }
                              />
                            )}
                          </Field>
                        </Grid>
                      ))}

                      {values.packageDetails.length > 1 && (
                        <Grid item xs={12}>
                          <CustomButtonOutlined size="small" onClick={() => remove(index)}>
                            Remove
                          </CustomButtonOutlined>
                        </Grid>
                      )}
                    </Grid>
                  ))}

                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <CustomButtonFilled
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
                    </CustomButtonFilled>
                  </Grid>
                </>
              )}
            </FieldArray>

            <Grid container spacing={2} justifyContent="center" marginTop={2}>
              <Grid item>
                <CustomButtonOutlined onClick={onBack}>Back</CustomButtonOutlined>
              </Grid>
              <Grid item>
                <CustomButtonFilled type="submit">Next</CustomButtonFilled>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Grid>
  );
};

export default PackageForm;
