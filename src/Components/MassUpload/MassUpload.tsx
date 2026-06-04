/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Papa from "papaparse";
import {
  Backdrop,
  // Box,
  Button,
  CircularProgress,
  Link,
  Modal,
  Typography,
  useTheme,
  Grid,
} from "@mui/material";
import { DropzoneArea } from "mui-file-dropzone";
import {
  usePostLocationMasterMutation,
  usePostVehicleMasterMutation,
  usePostLaneMasterMutation,
  usePostDeviceMasterMutation,
  usePostPackageMasterMutation,
  usePostCarrierMasterMutation,
  useCustomerRegistrationMutation,
  useVendorRegistrationMutation,
  useCreateProductMutation,
  useCreatePackageForOrderMutation,
} from "@/api/apiSlice";
import {
  locationColumnNames,
  vehicleColumnNames,
  laneColumnNames,
  deviceColumnNames,
  packageColumnNames,
  carrierColumnNames,
  customerColumnNames,
  vendorColumnNames,
  productColumnNames,
  createPackageOrderColumnNames,
} from "./CSVColumnNames";
import SnackbarAlert from "../ReusableComponents/SnackbarAlerts";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
type EntityKey =
  | "locations"
  | "vehicles"
  | "lanes"
  | "devices"
  | "packages"
  | "carriers"
  | "partners"
  | "products"
  | "createPackageOrders";

interface ColumnMapping {
  displayName: string;
  key: string;
  nestedKey?: string;
}

interface MassUploadProps {
  arrayKey: EntityKey;
  partnerType?: "vendor" | "customer";
}

interface ParsedRow {
  [key: string]: string | number | boolean | Date | undefined;
}
interface ApiResponse {
  data: {
    created_records: string[];
    message: string;
  };
}

const MassUpload: React.FC<MassUploadProps> = ({ arrayKey, partnerType }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  const theme = useTheme();

  // API mutations
  const [postLocationMaster, { isLoading: locationLoading }] =
    usePostLocationMasterMutation();
  const [postVehicleMaster, { isLoading: vehicleLoading }] =
    usePostVehicleMasterMutation();
  const [postLaneMaster, { isLoading: laneLoading }] =
    usePostLaneMasterMutation();
  const [postDeviceMaster, { isLoading: deviceLoading }] =
    usePostDeviceMasterMutation();
  const [postPackageMaster, { isLoading: packageLoading }] =
    usePostPackageMasterMutation();
  const [postCarrierMaster, { isLoading: carrierLoading }] =
    usePostCarrierMasterMutation();
  const [postCustomerMaster, { isLoading: customerLoading }] =
    useCustomerRegistrationMutation();
  const [postVendorMaster, { isLoading: vendorLoading }] =
    useVendorRegistrationMutation();
  const [postProductMaster, { isLoading: productLoading }] =
    useCreateProductMutation();
  const [postCreatePackageOrder, { isLoading: createPackageOrderLoading }] =
    useCreatePackageForOrderMutation();

  // Column mappings for CSV files
  const getColumnMappings = (): ColumnMapping[] => {
    switch (arrayKey) {
      case "locations":
        return locationColumnNames;
      case "vehicles":
        return vehicleColumnNames;
      case "lanes":
        return laneColumnNames;
      case "devices":
        return deviceColumnNames;
      case "packages":
        return packageColumnNames;
      case "carriers":
        return carrierColumnNames;
      case "partners":
        if (!partnerType)
          throw new Error("Partner type is required for partners.");
        return partnerType === "vendor"
          ? vendorColumnNames
          : customerColumnNames;
      case "products":
        return productColumnNames;
      case "createPackageOrders":
        return createPackageOrderColumnNames;
      default:
        throw new Error(`Unsupported arrayKey: ${arrayKey}`);
    }
  };

  // Post mapping for API calls
  const postMapping: Record<EntityKey, (data: object) => Promise<unknown>> = {
    locations: postLocationMaster,
    vehicles: postVehicleMaster,
    lanes: postLaneMaster,
    devices: postDeviceMaster,
    packages: postPackageMaster,
    carriers: postCarrierMaster,
    partners: (data) => {
      if (!partnerType)
        return Promise.reject(
          new Error("Partner type is required for partners."),
        );
      return partnerType === "vendor"
        ? postVendorMaster(data)
        : postCustomerMaster(data);
    },
    products: postProductMaster,
    createPackageOrders: postCreatePackageOrder,
  };

  const mapCsvToPayload = (
    data: ParsedRow[],
    columnMappings: ColumnMapping[],
  ): Record<string, unknown>[] => {
    return data.map((row) => {
      const transformedRow: Record<string, unknown> = {};

      // columnMappings.forEach(({ displayName, key, nestedKey }) => {
      columnMappings.forEach(({ displayName, key, nestedKey }) => {
        const rawValue = row[displayName];

        let value: string | string[] | undefined;

        if (rawValue !== undefined && rawValue !== null) {
          value = String(rawValue).trim();
        }
        // let value: string | string[] | undefined = row[displayName]?.trim();
        // let value = row[displayName];

        if (value !== undefined && value !== null) {
          value = String(value).trim();
        }
        const arrayFields: string[] = [
          "carrier_loc_of_operation",
          "carrier_lanes",
          "vehicle_types_handling",
        ];

        if (arrayFields.includes(key) && value) {
          value = value.split(",").map((item) => item.trim());
        }

        const dateFields: string[] = [
          "validity_from",
          "validity_to",
          "downtime_starts_from",
          "downtime_ends_from",
          "start_time",
          "end_time",
          "expiry_date",
          "expiration",
          "best_before",
        ];
        if (dateFields.includes(key) && typeof value === "string") {
          const [day, month, year] = value.split("-");
          value = `${year}-${month}-${day}`;
        }

        if (nestedKey) {
          if (
            typeof transformedRow[nestedKey] !== "object" ||
            transformedRow[nestedKey] === null
          ) {
            transformedRow[nestedKey] = {};
          }
          // (transformedRow[nestedKey] as Record<string, string | string[]>| undefined)[
          //   key
          // ] = value;
          (
            transformedRow[nestedKey] as Record<
              string,
              string | string[] | undefined
            >
          )[key] = value;
        } else {
          transformedRow[key] = value;
        }
      });

      return transformedRow;
    });
  };
  const excelDateToJSDate = (excelDate: number) => {
    const date = new Date((excelDate - 25569) * 86400 * 1000);

    return date.toISOString().slice(0, 16);
  };
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    setIsUploading(true);

    try {
      const columnMappings = getColumnMappings();
      let parsedData: ParsedRow[] = [];
      if (file.name.endsWith(".csv")) {
        parsedData = await new Promise<ParsedRow[]>((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              if (result.errors.length) {
                reject(new Error(result.errors[0].message));
              } else {
                resolve(result.data as ParsedRow[]);
              }
            },
            error: reject,
          });
        });
      } else {
        const data = await file.arrayBuffer();

        const workbook = XLSX.read(data, {
          type: "array",
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        parsedData = XLSX.utils.sheet_to_json(worksheet) as ParsedRow[];
      }
      const transformedData = mapCsvToPayload(parsedData, columnMappings);
      let finalData: any[] = transformedData;
      if (arrayKey === "createPackageOrders") {
        finalData = transformedData.map((item: any) => {
          const productIds =
            item.prod_IDs?.split(",").map((id: string) => id.trim()) || [];
          const quantities =
            item.quantities?.split(",").map((qty: string) => qty.trim()) || [];
          const packageInfos =
            item.package_infos?.split(",").map((pkg: string) => pkg.trim()) ||
            [];
          const product_ID = productIds.map(
            (prod_ID: string, index: number) => ({
              prod_ID,
              quantity: Number(quantities[index] || 0),
              package_info: packageInfos[index] || item.package_info || "",
            }),
          );
          return {
            ship_from: item.ship_from,
            ship_to: item.ship_to,
            bill_to: item.bill_to,
            destination_radius: `${item.geo_fencing_radius || ""}${item.geo_fencing_unit || ""}`,
            product_ID,
            package_info: item.package_info,
            return_label: Number(item.return_label || 0),
            additional_info: {
              ...item.additional_info,
              return_label: Boolean(Number(item.return_label || 0)),
            },
            pickup_date_time:
              item.pickup_date_time && !isNaN(Number(item.pickup_date_time))
                ? excelDateToJSDate(Number(item.pickup_date_time))
                : item.pickup_date_time,
            dropoff_date_time:
              item.dropoff_date_time && !isNaN(Number(item.dropoff_date_time))
                ? excelDateToJSDate(Number(item.dropoff_date_time))
                : item.dropoff_date_time,
            tax_info: item.tax_info || {},
          };
        });
      }

      if (arrayKey === "partners" && partnerType) {
        finalData = transformedData.map((item: any) => ({
          ...item,
          partner_type: partnerType,
        }));
      }

      const body = {
        [arrayKey === "createPackageOrders" ? "packages" : arrayKey]: finalData,
      };
      const response = (await postMapping[arrayKey](body)) as ApiResponse;
      const uploadedRecords = response?.data?.created_records?.length || 0;
      if (uploadedRecords) {
        setSnackbarMessage(`${uploadedRecords} records uploaded successfully!`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setIsModalOpen(false);
        setFile(null);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setSnackbarMessage(`Something went wrong! Please try again.`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsModalOpen(false);
    } finally {
      setIsUploading(false);
    }
  };
  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Package Orders");
    const columnMappings = getColumnMappings();
    // Headers
    const headers = columnMappings.map((col) => col.displayName);
    worksheet.addRow(headers);
    // Header Styling
    const headerRow = worksheet.getRow(1);
    for (let col = 1; col <= headers.length; col++) {
      const cell = headerRow.getCell(col) as ExcelJS.Cell;
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FFF08C24", // note the FF prefix
        },
      };

      cell.font = {
        bold: true,
        color: {
          argb: "FF000000",
        },
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      };
    }

    for (let col = 1; col <= headers.length; col++) {
      worksheet.getColumn(col).width = 30;
    }
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${arrayKey}_template.xlsx`);
  };

  const isLoading: boolean =
    locationLoading ||
    vehicleLoading ||
    laneLoading ||
    deviceLoading ||
    packageLoading ||
    customerLoading ||
    vendorLoading ||
    carrierLoading ||
    productLoading ||
    createPackageOrderLoading;

  return (
    <Grid>
      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
      <Backdrop
        sx={{
          color: "#ffffff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Button
        variant="contained"
        onClick={() => setIsModalOpen(true)}
        sx={
          {
            backgroundColor: "#F08C24",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#F08C24",
            },
          } as const
        }
      >
        Upload File
      </Button>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Grid
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "400px",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <Typography variant="h6">Mass Upload</Typography>
          <Typography sx={{ mt: 2 }}>
            Step 1: Download the template 👇
          </Typography>
          <Link component="button" onClick={handleDownloadTemplate}>
            Download Excel Template
          </Link>

          <Typography sx={{ mt: 2 }}>
            Step 2: Upload your filled CSV file.
          </Typography>
          <DropzoneArea
            fileObjects={[]}
            // acceptedFiles={[".csv"]}
            acceptedFiles={[".csv", ".xlsx", ".xls"]}
            filesLimit={1}
            onChange={(files) => setFile(files[0] || null)}
            showAlerts={false}
            // dropzoneText="Drag and drop a CSV file here or click"
            dropzoneText="Drag and drop a CSV or Excel file here or click"
          />
          {file && (
            <Typography sx={{ mt: 2 }}>
              Selected file:{" "}
              <span style={{ color: "#4766ff", fontWeight: "bold" }}>
                {file.name}
              </span>
            </Typography>
          )}
          <Grid sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setFile(null);
                setIsModalOpen(false);
              }}
              fullWidth
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={isUploading}
              fullWidth
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </Grid>

          {message && (
            <Typography
              sx={{
                mt: 2,
                color: message.includes("successful") ? "green" : "red",
              }}
            >
              {message}
            </Typography>
          )}
        </Grid>
      </Modal>
    </Grid>
  );
};

export default MassUpload;
