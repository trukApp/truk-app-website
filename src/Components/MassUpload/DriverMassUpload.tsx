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
  useDriverRegistrationMutation, useGetLocationMasterQuery
} from '@/api/apiSlice';
import {
  driversColumnNames
} from './CSVColumnNames'; 

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
interface DriverPayload {
  [key: string]: string | undefined; // Other keys from the CSV
  address?: string; // Resolved address field
}

const DriverMassUpload: React.FC<MassUploadProps> = ({ arrayKey }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data } = useGetLocationMasterQuery([]);
  const locationMasterData = data?.locations

  const theme = useTheme();

  const [postDriverMaster] = useDriverRegistrationMutation()

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

    const transformedData = mapCsvToPayload<DriverPayload>(parsedData, columnMappings);

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

    console.log('Payload body:', body);
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

export default DriverMassUpload;
