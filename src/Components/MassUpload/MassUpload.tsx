import React, { useState } from 'react';
import Papa from 'papaparse';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Link,
  Modal,
  Typography,
  useTheme,
} from '@mui/material';
import { DropzoneArea } from 'mui-file-dropzone';
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
} from '@/api/apiSlice';
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
} from './CSVColumnNames';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';

type EntityKey = 'locations' | 'vehicles' | 'lanes' | 'devices' | 'packages' | 'carriers' | 'partners' | 'products';

interface ColumnMapping {
  displayName: string;
  key: string;
  nestedKey?: string;
}

interface MassUploadProps {
  arrayKey: EntityKey;
  partnerType?: 'vendor' | 'customer';
}

interface ParsedRow {
  [key: string]: string;
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
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");

  const theme = useTheme();

  // API mutations
  const [postLocationMaster, { isLoading: locationLoading }] = usePostLocationMasterMutation();
  const [postVehicleMaster, { isLoading: vehicleLoading }] = usePostVehicleMasterMutation();
  const [postLaneMaster, { isLoading: laneLoading }] = usePostLaneMasterMutation();
  const [postDeviceMaster, { isLoading: deviceLoading }] = usePostDeviceMasterMutation();
  const [postPackageMaster, { isLoading: packageLoading }] = usePostPackageMasterMutation();
  const [postCarrierMaster, { isLoading: carrierLoading }] = usePostCarrierMasterMutation();
  const [postCustomerMaster, { isLoading: customerLoading }] = useCustomerRegistrationMutation();
  const [postVendorMaster, { isLoading: vendorLoading }] = useVendorRegistrationMutation();
  const [postProductMaster, { isLoading: productLoading }] = useCreateProductMutation();

  // Column mappings for CSV files
  const getColumnMappings = (): ColumnMapping[] => {
    switch (arrayKey) {
      case 'locations':
        return locationColumnNames;
      case 'vehicles':
        return vehicleColumnNames;
      case 'lanes':
        return laneColumnNames;
      case 'devices':
        return deviceColumnNames;
      case 'packages':
        return packageColumnNames;
      case 'carriers':
        return carrierColumnNames;
      case 'partners':
        if (!partnerType) throw new Error('Partner type is required for partners.');
        return partnerType === 'vendor' ? vendorColumnNames : customerColumnNames;
      case 'products':
        return productColumnNames;
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
      if (!partnerType) return Promise.reject(new Error('Partner type is required for partners.'));
      return partnerType === 'vendor' ? postVendorMaster(data) : postCustomerMaster(data);
    },
    products: postProductMaster,

  };
 
  const mapCsvToPayload = (
    data: ParsedRow[],
    columnMappings: ColumnMapping[]
  ): Record<string, unknown>[] => {
    return data.map((row) => {
      const transformedRow: Record<string, unknown> = {};

      columnMappings.forEach(({ displayName, key, nestedKey }) => {
        let value: string | string[] | undefined = row[displayName]?.trim();
        const arrayFields: string[] = ['carrier_loc_of_operation', 'carrier_lanes', 'vehicle_types_handling'];
        
        if (arrayFields.includes(key) && value) {
          value = value.split(',').map((item) => item.trim());
        }

        const dateFields: string[] = ['validity_from', 'validity_to','downtime_starts_from','downtime_ends_from','start_time','end_time','expiry_date','expiration','best_before'];
        if (dateFields.includes(key) && typeof value === 'string') {
            const [day, month, year] = value.split('-');
            value = `${year}-${month}-${day}`;
        }

        if (nestedKey) {
          if (typeof transformedRow[nestedKey] !== 'object' || transformedRow[nestedKey] === null) {
            transformedRow[nestedKey] = {};
          }
          (transformedRow[nestedKey] as Record<string, string | string[]>)[key] = value;
        } else {
          transformedRow[key] = value;
        }
      });

      return transformedRow;
    });
  };
  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    setIsUploading(true);

    try {
      const columnMappings = getColumnMappings();

      const parsedData = await new Promise<ParsedRow[]>((resolve, reject) => {
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

      const transformedData = mapCsvToPayload(parsedData, columnMappings);
      const body = {
        [arrayKey]: transformedData.map((item: object) => {
          if (arrayKey === 'partners' && partnerType) {
            return { ...item, partner_type: partnerType };
          }

          return item;
        }),
      };
      console.log("body for mass :", body)
      const response = (await postMapping[arrayKey](body)) as ApiResponse;
      const uploadedRecords = response.data.created_records.length;
      if (uploadedRecords) {
        setSnackbarMessage(`${uploadedRecords} records uploaded successfully!`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setIsModalOpen(false);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSnackbarMessage(`Something went wrong! Please try again, ${error}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsModalOpen(false)
    } finally {
      setIsUploading(false);
    }
  };

  // const handleDownloadTemplate = () => {
  //   const columnMappings = getColumnMappings();
  //   const csvContent = `data:text/csv;charset=utf-8,${columnMappings
  //     .map((col) => col.displayName)
  //     .join(',')}`;
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement('a');
  //   link.setAttribute('href', encodedUri);
  //   link.setAttribute('download', `${arrayKey}_template.csv`);
  //   link.click();
  // };

const handleDownloadTemplate = () => {
  const columnMappings = getColumnMappings();
  
  const headers = columnMappings.map(col => `"${col.displayName.padEnd(20, ' ')}"`).join(",");

  const csvContent = `data:text/csv;charset=utf-8,${headers}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${arrayKey}_template.csv`);
  link.click();
};


  return (
    <Box>
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
        open={locationLoading || vehicleLoading || laneLoading || deviceLoading || packageLoading || customerLoading || vendorLoading || carrierLoading || productLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* <Button variant="contained" onClick={() => setIsModalOpen(true)}>
        Upload CSV
      </Button> */}
<Button
  variant="contained"
  onClick={() => setIsModalOpen(true)}
  sx={{
    backgroundColor: "#83214F", // Custom background color for normal state
    color: "#fff",  
    "&:hover": {
      backgroundColor: '#fff',  
      color: "#83214F" 
    }
  }}
>
  Upload CSV
</Button>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '400px',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <Typography variant="h6">Mass Upload</Typography>
          <Typography sx={{ mt: 2 }}>Step 1: Download the template 👇</Typography>
          <Link component="button" onClick={handleDownloadTemplate}>
            Download CSV Template
          </Link>

          <Typography sx={{ mt: 2 }}>Step 2: Upload your filled CSV file.</Typography>
          <DropzoneArea fileObjects={[]}
            acceptedFiles={['.csv']}
            filesLimit={1}
            onChange={(files) => setFile(files[0] || null)}
            showAlerts={false}
            dropzoneText="Drag and drop a CSV file here or click"
          />
          {file && (
            <Typography sx={{ mt: 2 }}>
              Selected file: <span style={{ color: '#4766ff', fontWeight: 'bold' }}>{file.name}</span>
            </Typography>
          )}
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
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
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </Box>

          {message && (
            <Typography
              sx={{ mt: 2, color: message.includes('successful') ? 'green' : 'red' }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default MassUpload;
