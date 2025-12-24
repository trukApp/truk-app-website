// import React, { useState } from "react";
// import {
//   Grid,
//   TextField,
//   CircularProgress,
//   Typography,
//   Autocomplete,
// } from "@mui/material";
// import {
//   useGetAllProductsQuery,
//   useGetFilteredProductsQuery,
// } from "@/api/apiSlice";
// import { Product } from "@/app/productmaster/page";
// import {
//   CustomButtonFilled,
//   CustomButtonOutlined,
// } from "../ReusableComponents/ButtonsComponent";
// import { useFormikContext, FieldArray, getIn } from "formik";

// interface PackageDetailsItem {
//   productId: string;
//   productName: string;
//   hsnCode: string;
//   rfid: string;
//   dimensions: string;
//   quantity: string;
//   weight: string;
//   packagingType: string;
// }

// interface FormValues {
//   packageDetails: PackageDetailsItem[];
// }

// const fieldLabels: Record<string, string> = {
//   productName: "Product Name",
//   hsnCode: "HSN Code",
//   "RFID-EPC Code": "RFID-EPC Code",
//   dimensions: "Dimensions",
//   quantity: "Quantity",
//   weight: "Weight",
//   packagingType: "Packaging Type",
// };

// const PackageDetails: React.FC = () => {
//   const { values, setFieldValue, errors, touched } = useFormikContext<FormValues>();
//   const [searchKey, setSearchKey] = useState("");
//   const { data: allProducts, isLoading: isAllProductsLoading } =
//     useGetAllProductsQuery({});
//   const { data: filteredProductsData, isFetching: isFilteredLoading } =
//     useGetFilteredProductsQuery(searchKey.length >= 3 ? searchKey : null, {
//       skip: searchKey.length < 3,
//     });

//   const allProductList = allProducts?.products || [];
//   const filteredProducts = filteredProductsData?.results || [];
//   const productOptions = searchKey.length >= 3 ? filteredProducts : allProductList;

//   return (
//     <Grid className="formsBgContainer" sx={{ padding: 2 }}>
//       <Typography variant="h6" sx={{ fontWeight: "bold", marginLeft: "15px" }}>
//         Package Details
//       </Typography>

//       <FieldArray name="packageDetails">
//         {({ push, remove }) => (
//           <>
//             {values.packageDetails.map((item, index) => {
//               const itemErrors = getIn(errors, `packageDetails.${index}`) || {};
//               const itemTouched = getIn(touched, `packageDetails.${index}`) || {};

//               return (
//                 <Grid container spacing={2} sx={{ marginTop: 1 }} key={index}>
//                   <Grid item xs={12} md={2.4}>
//                     <Autocomplete
//                       freeSolo
//                       options={productOptions}
//                       loading={isAllProductsLoading || isFilteredLoading}
//                       value={
//                         allProductList.find(
//                           (p: Product) => p.product_ID === item.productId
//                         ) || null
//                       }
//                       getOptionLabel={(option: Product | string) =>
//                         typeof option === "string"
//                           ? option
//                           : `${option.product_ID} - ${option.product_name}`
//                       }
//                       filterOptions={(options, { inputValue }) =>
//                         options.filter((option) => {
//                           const label =
//                             typeof option === "string"
//                               ? option
//                               : `${option.product_ID} ${option.product_name}`.toLowerCase();
//                           return label.includes(inputValue.toLowerCase());
//                         })
//                       }
//                       renderOption={(props, option) => (
//                         <li
//                           {...props}
//                           key={
//                             typeof option === "string"
//                               ? option
//                               : option.product_ID
//                           }
//                         >
//                           {typeof option === "string"
//                             ? option
//                             : `${option.product_ID} - ${option.product_name}`}
//                         </li>
//                       )}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label="Product ID *"
//                           variant="outlined"
//                           size="small"
//                           onChange={(e) => setSearchKey(e.target.value)}
//                           error={Boolean(
//                             itemTouched.productId && itemErrors.productId
//                           )}
//                           helperText={
//                             itemTouched.productId && itemErrors.productId
//                               ? itemErrors.productId
//                               : ""
//                           }
//                           InputProps={{
//                             ...params.InputProps,
//                             endAdornment: (
//                               <>
//                                 {(isAllProductsLoading || isFilteredLoading) && (
//                                   <CircularProgress color="inherit" size={20} />
//                                 )}
//                                 {params.InputProps.endAdornment}
//                               </>
//                             ),
//                           }}
//                         />
//                       )}
//                       onChange={(e, selectedOption) => {
//                         if (!selectedOption) {
//                           setFieldValue(
//                             `packageDetails.${index}.productId`,
//                             ""
//                           );
//                           setFieldValue(
//                             `packageDetails.${index}.productName`,
//                             ""
//                           );
//                           setFieldValue(
//                             `packageDetails.${index}.hsnCode`,
//                             ""
//                           );
//                           setFieldValue(
//                             `packageDetails.${index}.weight`,
//                             ""
//                           );
//                           setFieldValue(
//                             `packageDetails.${index}.dimensions`,
//                             ""
//                           );
//                           setFieldValue(
//                             `packageDetails.${index}.packagingType`,
//                             ""
//                           );
//                           return;
//                         }
//                         const selected =
//                           typeof selectedOption === "string"
//                             ? allProductList.find(
//                               (p: Product) => p.product_ID === selectedOption
//                             )
//                             : selectedOption;

//                         if (selected) {
//                           setFieldValue(
//                             `packageDetails.${index}.productId`,
//                             selected.product_ID
//                           );
//                           setFieldValue(
//                             `packageDetails.${index}.productName`,
//                             selected.product_name
//                           );
//                           setFieldValue(
//                             `packageDetails.${index}.hsnCode`,
//                             selected.hsn_code
//                           );
//                           setFieldValue(
//                             `packageDetails.${index}.weight`,
//                             `${selected.weight} ${selected.weight_uom}`
//                           );
//                           setFieldValue(
//                             `packageDetails.${index}.dimensions`,
//                             `${selected.volume} ${selected.volume_uom}`
//                           );
//                           setFieldValue(
//                             `packageDetails.${index}.packagingType`,
//                             selected.packaging_type[0]?.pac_ID || ""
//                           );
//                         }
//                       }}
//                     />
//                   </Grid>

//                   {[
//                     "productName",
//                     "hsnCode",
//                     "RFID-EPC Code",
//                     "dimensions",
//                     "quantity",
//                     "weight",
//                     "packagingType",
//                   ].map((fieldName) => {
//                     const key =
//                       fieldName === "RFID-EPC Code" ? "rfid" : fieldName;
//                     const fieldError = itemErrors[key];
//                     const fieldTouched = itemTouched[key];

//                     return (
//                       <Grid item xs={12} md={2.4} key={fieldName}>
//                         <TextField
//                           value={(item as any)[key] || ""}
//                           onChange={(e) =>
//                             setFieldValue(`packageDetails.${index}.${key}`, e.target.value)
//                           }
//                           disabled={fieldName !== "RFID-EPC Code" && fieldName !== "quantity"}
//                           label={fieldLabels[fieldName] || fieldName}
//                           placeholder={fieldLabels[fieldName] || fieldName}
//                           fullWidth
//                           size="small"
//                           type={fieldName === "quantity" ? "number" : "text"}
//                           inputProps={
//                             fieldName === "quantity"
//                               ? {
//                                 min: 1,
//                                 onKeyDown: (e) => {
//                                   if (e.key === "-" || e.key === "e") {
//                                     e.preventDefault();
//                                   }
//                                 },
//                               }
//                               : {}
//                           }
//                           error={Boolean(fieldTouched && fieldError)}
//                           helperText={fieldTouched && fieldError ? fieldError : ""}
//                         />
//                       </Grid>
//                     );
//                   })}

//                   {values.packageDetails.length > 1 && (
//                     <Grid item xs={12}>
//                       <CustomButtonOutlined size="small" onClick={() => remove(index)}>
//                         Remove
//                       </CustomButtonOutlined>
//                     </Grid>
//                   )}
//                 </Grid>
//               );
//             })}

//             <Grid item xs={12} sx={{ mt: 2 }}>
//               <CustomButtonFilled
//                 size="small"
//                 onClick={() =>
//                   push({
//                     productId: "",
//                     productName: "",
//                     hsnCode: "",
//                     rfid: "",
//                     dimensions: "",
//                     quantity: "",
//                     weight: "",
//                     packagingType: "",
//                   })
//                 }
//               >
//                 Add One More
//               </CustomButtonFilled>
//             </Grid>
//           </>
//         )}
//       </FieldArray>
//     </Grid>
//   );
// };

// export default PackageDetails;



import React, { useState } from "react";
import {
  Grid,
  TextField,
  CircularProgress,
  Typography,
  Autocomplete,
} from "@mui/material";
import {
  useGetAllProductsQuery,
  useGetFilteredProductsQuery,
} from "@/api/apiSlice";
import { Product } from "@/app/productmaster/page";
import {
  CustomButtonFilled,
  CustomButtonOutlined,
} from "../ReusableComponents/ButtonsComponent";
import { useFormikContext, FieldArray, getIn } from "formik";

/* ---------------------------------- TYPES --------------------------------- */

interface PackageDetailsItem {
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
  packages: {
    packageDetails: PackageDetailsItem[];
  }[];
}

interface Props {
  index: number; // 👈 PACKAGE INDEX FROM PARENT
}

const fieldLabels: Record<string, string> = {
  productName: "Product Name",
  hsnCode: "HSN Code",
  "RFID-EPC Code": "RFID-EPC Code",
  dimensions: "Dimensions",
  quantity: "Quantity",
  weight: "Weight",
  packagingType: "Packaging Type",
};

/* ------------------------------- COMPONENT -------------------------------- */

const PackageDetails: React.FC<Props> = ({ index }) => {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<FormValues>();

  const [searchKey, setSearchKey] = useState("");

  const { data: allProducts, isLoading: isAllProductsLoading } =
    useGetAllProductsQuery({});

  const { data: filteredProductsData, isFetching: isFilteredLoading } =
    useGetFilteredProductsQuery(searchKey.length >= 3 ? searchKey : null, {
      skip: searchKey.length < 3,
    });

  const allProductList = allProducts?.products || [];
  const filteredProducts = filteredProductsData?.results || [];
  const productOptions =
    searchKey.length >= 3 ? filteredProducts : allProductList;

  const packageDetailsPath = `packages.${index}.packageDetails`;
  const packageDetails = values.packages[index].packageDetails;

  return (
    <Grid className="formsBgContainer" sx={{ padding: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", marginLeft: "15px" }}>
        Package Details
      </Typography>

      <FieldArray name={packageDetailsPath}>
        {({ push, remove }) => (
          <>
            {packageDetails.map((item, itemIndex) => {
              const itemErrors =
                getIn(errors, `${packageDetailsPath}.${itemIndex}`) || {};
              const itemTouched =
                getIn(touched, `${packageDetailsPath}.${itemIndex}`) || {};

              return (
                <Grid container spacing={2} sx={{ marginTop: 1 }} key={itemIndex}>
                  {/* ---------------- PRODUCT SEARCH ---------------- */}
                  <Grid item xs={12} md={2.4}>
                    <Autocomplete
                      freeSolo
                      options={productOptions}
                      loading={isAllProductsLoading || isFilteredLoading}
                      value={
                        allProductList.find(
                          (p: Product) => p.product_ID === item.productId
                        ) || null
                      }
                      getOptionLabel={(option: Product | string) =>
                        typeof option === "string"
                          ? option
                          : `${option.product_ID} - ${option.product_name}`
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Product ID *"
                          size="small"
                          onChange={(e) => setSearchKey(e.target.value)}
                          error={Boolean(
                            itemTouched.productId && itemErrors.productId
                          )}
                          helperText={
                            itemTouched.productId && itemErrors.productId
                              ? itemErrors.productId
                              : ""
                          }
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {(isAllProductsLoading ||
                                  isFilteredLoading) && (
                                    <CircularProgress size={20} />
                                  )}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      onChange={(_, selectedOption) => {
                        const basePath = `${packageDetailsPath}.${itemIndex}`;

                        if (!selectedOption) {
                          [
                            "productId",
                            "productName",
                            "hsnCode",
                            "weight",
                            "dimensions",
                            "packagingType",
                          ].forEach((f) =>
                            setFieldValue(`${basePath}.${f}`, "")
                          );
                          return;
                        }

                        const selected =
                          typeof selectedOption === "string"
                            ? allProductList.find(
                              (p: Product) =>
                                p.product_ID === selectedOption
                            )
                            : selectedOption;

                        if (selected) {
                          setFieldValue(
                            `${basePath}.productId`,
                            selected.product_ID
                          );
                          setFieldValue(
                            `${basePath}.productName`,
                            selected.product_name
                          );
                          setFieldValue(
                            `${basePath}.hsnCode`,
                            selected.hsn_code
                          );
                          setFieldValue(
                            `${basePath}.weight`,
                            `${selected.weight} ${selected.weight_uom}`
                          );
                          setFieldValue(
                            `${basePath}.dimensions`,
                            `${selected.volume} ${selected.volume_uom}`
                          );
                          setFieldValue(
                            `${basePath}.packagingType`,
                            selected.packaging_type?.[0]?.pac_ID || ""
                          );
                        }
                      }}
                    />
                  </Grid>

                  {/* ---------------- OTHER FIELDS ---------------- */}
                  {[
                    "productName",
                    "hsnCode",
                    "RFID-EPC Code",
                    "dimensions",
                    "quantity",
                    "weight",
                    "packagingType",
                  ].map((fieldName) => {
                    const key =
                      fieldName === "RFID-EPC Code" ? "rfid" : fieldName;

                    return (
                      <Grid item xs={12} md={2.4} key={fieldName}>
                        <TextField
                          value={(item as any)[key] || ""}
                          onChange={(e) =>
                            setFieldValue(
                              `${packageDetailsPath}.${itemIndex}.${key}`,
                              e.target.value
                            )
                          }
                          disabled={
                            fieldName !== "RFID-EPC Code" &&
                            fieldName !== "quantity"
                          }
                          label={fieldLabels[fieldName]}
                          fullWidth
                          size="small"
                          type={fieldName === "quantity" ? "number" : "text"}
                          error={Boolean(
                            itemTouched[key] && itemErrors[key]
                          )}
                          helperText={
                            itemTouched[key] && itemErrors[key]
                              ? itemErrors[key]
                              : ""
                          }
                        />
                      </Grid>
                    );
                  })}

                  {packageDetails.length > 1 && (
                    <Grid item xs={12}>
                      <CustomButtonOutlined
                        size="small"
                        onClick={() => remove(itemIndex)}
                      >
                        Remove
                      </CustomButtonOutlined>
                    </Grid>
                  )}
                </Grid>
              );
            })}

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
    </Grid>
  );
};

export default PackageDetails;
