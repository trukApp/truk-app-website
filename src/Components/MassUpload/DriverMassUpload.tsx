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
  useDriverRegistrationMutation, useGetLocationMasterQuery
} from '@/api/apiSlice';
import {
  driversColumnNames
} from './CSVColumnNames';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';

type EntityKey = 'drivers';

interface ColumnMapping {
  displayName: string;
  key: string;
  nestedKey?: string;
}

interface MassUploadProps {
  arrayKey: EntityKey;
}

interface ParsedRow {
  [key: string]: string;
}
interface Location {
  loc_ID: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  country: string;
}
// interface DriverPayload {
//   [key: string]: string | undefined; // Other keys from the CSV
//   address?: string; // Resolved address field
// }

interface DriverRegistrationResponse {
  data: {
    created_records: string[];
    message: string;
  };
}
const DriverMassUpload: React.FC<MassUploadProps> = ({ arrayKey }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data } = useGetLocationMasterQuery([]);
  const locationMasterData = data?.locations;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");

  const theme = useTheme();

  const [postDriverMaster, { isLoading: driverLoading }] = useDriverRegistrationMutation()

  // Column mappings for CSV files
  const getColumnMappings = (): ColumnMapping[] => {
    switch (arrayKey) {
      case 'drivers':
        return driversColumnNames;
      default:
        throw new Error(`Unsupported arrayKey: ${arrayKey}`);
    }
  };

  // Post mapping for API calls
  const postMapping: Record<EntityKey, (data: object) => Promise<unknown>> = {
    drivers: postDriverMaster,
  };


  const mapCsvToPayload = (
    data: ParsedRow[],
    columnMappings: ColumnMapping[]
  ): Record<string, unknown>[] => {
    return data.map((row) => {
      const transformedRow: Record<string, unknown> = {};

      columnMappings.forEach(({ displayName, key, nestedKey }) => {
        let value: string | string[] | undefined = row[displayName]?.trim();

        // Convert specific fields into arrays
        const arrayFields: string[] = ['vehicle_types'];
        if (arrayFields.includes(key) && value) {
          value = value.split(',').map((item) => item.trim());
        }
        
        const dateFields: string[] = ['expiry_date'];
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


  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    setIsUploading(true);

    try {
      const columnMappings = getColumnMappings();

      // Fetch locations using the query


      if (!locationMasterData || !Array.isArray(locationMasterData)) {
        throw new Error('Failed to fetch or invalid location master data.');
      }

      // Parse the CSV data
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

      // Map CSV data to payload with address resolution for drivers
      const body = {
        [arrayKey]: transformedData.map((item) => {
          if (arrayKey === 'drivers') {
            const locationId = item['locations'];
            const matchingLocation = locationMasterData.find(
              (location: Location) => location.loc_ID === locationId
            );

            const addressParts = [
              matchingLocation.address_1,
              matchingLocation.address_2,
              matchingLocation.city,
              matchingLocation.state,
              matchingLocation.country,
            ].filter(Boolean);

            const address = addressParts.length > 0
              ? addressParts.join(', ')
              : '';

            return {
              ...item,
              locations: [locationId],
              address,
            };
          }

          return item;
        }),
      };

      const response = (await postMapping[arrayKey](body)) as DriverRegistrationResponse;
      if (response.data.created_records) {
        setSnackbarMessage(`${response?.data?.created_records?.length} records uploaded successfully!`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setIsModalOpen(false)
      }

    } catch (error) {
      setSnackbarMessage("Something went wrong! Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsModalOpen(false)
      console.log(error)
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Backdrop
        sx={{
          color: "#ffffff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={driverLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
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
            acceptedFiles={['.csv']} showAlerts={false}
            filesLimit={1}
            onChange={(files) => setFile(files[0] || null)}
            dropzoneText="Drag and drop a CSV file here or click"
          />

          {file && (
            <Typography sx={{ mt: 2 }}>
              Selected file: <span style={{ color: '#4766ff', fontWeight: 'bold' }}>{file.name}</span>
            </Typography>
          )}

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

export default DriverMassUpload;
