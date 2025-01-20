
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
} from '@/api/apiSlice';
import {Location} from '../MasterDataComponents/Locations';
import { VehicleDetails } from '../MasterDataComponents/Vehicles';
// import { Lane } from '../MasterDataComponents/Lanes';
import {locationColumnNames, vehicleColumnNames } from './CSVColumnNames';

export interface PostResponse {
  count: number;
  message?: string;
  result?: {
    data: string;
  };
  error?: string;
}
interface ColumnMapping {
  displayName: string;
  key: string;
}
interface MassUploadProps {
  arrayKey: 'locations' | 'vehicles' ;
}

const MassUpload = ({ arrayKey }: MassUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const theme = useTheme();
  const [postLocationMaster] = usePostLocationMasterMutation();
  const [postVehicleMaster] = usePostVehicleMasterMutation();

  const parseCSV = <T,>(file: File): Promise<T[]> => {
    return new Promise<T[]>((resolve, reject) => {
      Papa.parse<T>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.errors.length > 0) {
            reject(new Error(result.errors[0].message));
          } else {
            resolve(result.data);
          }
        },
        error: (error) => reject(error),
      });
    });
  };

const handleDownloadTemplate = () => {
  let columnMappings;

  switch (arrayKey) {
    case 'locations':
      columnMappings = locationColumnNames;
      break;
    case 'vehicles':
      columnMappings = vehicleColumnNames;
      break;
    default:
      return;
  }

  const displayNames = columnMappings.map((mapping) => mapping.displayName);
  const csvContent = `data:text/csv;charset=utf-8,${displayNames.join(',')}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${arrayKey}_template.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const mapDisplayNamesToKeys = <T extends Record<string, string | number>>(
  data: T[],
  columnMappings: ColumnMapping[]
): Record<string, string | number>[] => {
  const keyMap: Record<string, string> = Object.fromEntries(
    columnMappings.map(({ displayName, key }) => [displayName, key])
  );

  return data.map((row) => {
    const transformedRow: Record<string, string | number> = {};
    Object.entries(row).forEach(([displayName, value]) => {
      const key = keyMap[displayName];
      if (key) {
        transformedRow[key] = value;
      }
    });
    return transformedRow;
  });
};

const handleUpload = async (): Promise<void> => {
  if (!file) {
    setMessage('Please select a file.');
    return;
  }

  setIsUploading(true);

  try {
    let parsedData: Location[] | VehicleDetails[] | undefined;
    let columnMappings: ColumnMapping[];

    switch (arrayKey) {
      case 'locations':
        columnMappings = locationColumnNames.map((name) => ({
          displayName: name.displayName,
          key: name.key,
        }));
        parsedData = await parseCSV<Location>(file);
        break;
      case 'vehicles':
        columnMappings = vehicleColumnNames.map((name) => ({
          displayName: name.displayName,
          key: name.key,
        }));
        parsedData = await parseCSV<VehicleDetails>(file);
        break;
      default:
        throw new Error(`No type defined for ${arrayKey}`);
    }

    if (!parsedData || parsedData.length === 0) {
      throw new Error('The uploaded file is empty or invalid.');
    }

    const records = parsedData.map((item) => {
      const record: Record<string, string | number> = {};
      Object.entries(item).forEach(([key, value]) => {
        record[key] = value as string | number;
      });
      return record;
    });

    // Map display names to keys
    const transformedData = mapDisplayNamesToKeys(records, columnMappings);

    const body = { [arrayKey]: transformedData };

    let response: PostResponse;
    switch (arrayKey) {
      case 'locations':
        response = await postLocationMaster(body).unwrap();
        break;
      case 'vehicles':
        response = await postVehicleMaster(body).unwrap();
        break;
      default:
        throw new Error(`No mutation defined for ${arrayKey}`);
    }

    setMessage(`Upload successful! ${response.count} items created.`);
  } catch (error) {
    if (error instanceof Error) {
      setMessage(error.message || 'An error occurred during upload.');
    } else {
      setMessage('An unknown error occurred.');
    }
  } finally {
    setIsUploading(false);
  }
};



  const handleCancel = () => {
    setFile(null);
    setMessage(null);
  };
  return (
    <Box>
      <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
        Upload CSV
      </Button>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width:{xs:'90%', md:'30%'},
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Mass Upload
          </Typography>

          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}
          >
          Step 1: Download the template 👇
          </Typography>

    <Link
      component="button"
      onClick={handleDownloadTemplate}
      sx={{
        textDecoration: 'underline',
        color: 'primary.main',
        cursor: 'pointer',
        marginBottom: 2, // Matches the MUI spacing system
        display: 'inline-block',
      }}
    >
      Download CSV Template
    </Link>

          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ marginBottom: 2 }}
          >
            Step 2: Upload the filled CSV file below.
          </Typography>

          <DropzoneArea
            acceptedFiles={[".csv"]}
            filesLimit={1} fileObjects={[]} 
            showAlerts={false}
            onChange={(files) => {
              if (files.length > 0) {
                setFile(files[0]);
                setMessage(null);
              } else {
                setFile(null);
              }
            }} 
            dropzoneText="Drag and drop a CSV file here or click"
          />

          {file && (
            <Typography sx={{ marginTop: 2 }}>Selected File: {file.name}</Typography>
          )}

          {file && (
          <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              sx={{ width: '100%' }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={isUploading}
              sx={{ width: '100%' }}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </Box>
          )}

          {message && (
            <Typography
              variant="body2"
              color={message.includes('successful') ? 'green' : 'red'}
              sx={{ marginTop: 2 }}
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
