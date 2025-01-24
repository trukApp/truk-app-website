import React, { useState } from 'react';
import Papa from 'papaparse';
import {
  Box,
  Button,
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
  useDriverRegistrationMutation,
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
  driversColumnNames
} from './CSVColumnNames'; 

type EntityKey = 'locations' | 'vehicles' | 'lanes' | 'devices' | 'packages' | 'carriers' | 'partners' | 'drivers';

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

const MassUpload: React.FC<MassUploadProps> = ({ arrayKey, partnerType }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const theme = useTheme();

  // API mutations
  const [postLocationMaster] = usePostLocationMasterMutation();
  const [postVehicleMaster] = usePostVehicleMasterMutation();
  const [postLaneMaster] = usePostLaneMasterMutation();
  const [postDeviceMaster] = usePostDeviceMasterMutation();
  const [postPackageMaster] = usePostPackageMasterMutation();
  const [postCarrierMaster] = usePostCarrierMasterMutation();
  const [postCustomerMaster] = useCustomerRegistrationMutation();
  const [postVendorMaster] = useVendorRegistrationMutation();
  const [postDriverMaster] = useDriverRegistrationMutation()

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
      case 'drivers':
        return driversColumnNames;
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
    drivers:postDriverMaster,
  };

type NestedRecord = Record<string, string>;

const mapCsvToPayload = <T extends object>(
  data: ParsedRow[],
  columnMappings: ColumnMapping[]
): T[] => {
  return data.map((row) => {
    return columnMappings.reduce<T>((acc, { displayName, key, nestedKey }) => {
      const value = row[displayName]?.trim();

      if (nestedKey) {
        // Ensure the nested structure exists before assigning values
        const nestedAcc = acc as Record<string, NestedRecord>;
        if (!nestedAcc[nestedKey]) {
          nestedAcc[nestedKey] = {} as NestedRecord;
        }
        nestedAcc[nestedKey][key] = value;
      } else {
        (acc as Record<string, string>)[key] = value;
      }

      return acc;
    }, {} as T);
  });
};


  // Handle template download
  const handleDownloadTemplate = () => {
    const columnMappings = getColumnMappings();
    const csvContent = `data:text/csv;charset=utf-8,${columnMappings
      .map((col) => col.displayName)
      .join(',')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${arrayKey}_template.csv`);
    link.click();
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
     console.log("payload body :", body)
      await postMapping[arrayKey](body);
      setMessage('Upload successful!');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => setIsModalOpen(true)}>
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

          <Typography sx={{ mt: 2 }}>Step 2: Upload your CSV file.</Typography>
          <DropzoneArea fileObjects={[]}
            acceptedFiles={['.csv']}
            filesLimit={1}
            onChange={(files) => setFile(files[0] || null)}
            dropzoneText="Drag and drop a CSV file here or click"
          />

          {file && <Typography sx={{ mt: 2 }}>Selected file: {file.name}</Typography>}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => setFile(null)} fullWidth>
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
