import React, { useState } from 'react';
import Papa from 'papaparse';
import { Box, Button, TextField, Typography } from '@mui/material';
import {
  usePostLocationMasterMutation,
  usePostVehicleMasterMutation
} from '@/api/apiSlice';

import { Location } from './MasterDataComponents/Locations';
import { VehicleFormValues } from './MasterDataComponents/Vehicles';


export interface PostResponse {
  count: number;
  message?: string;
  result?: {
    data: string;
  };
  error?: string;
}

interface MassUploadProps {
  arrayKey: 'locations' | 'vehicles' ;
}

const MassUpload = ({ arrayKey }: MassUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [postLocationMaster] = usePostLocationMasterMutation();
  const [postVehicleMaster] = usePostVehicleMasterMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setMessage(null);
    }
  };

  // Helper function to parse CSV with a generic type
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

  const handleUpload = async (): Promise<void> => {
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    setIsUploading(true);

    try {
      let parsedData: Location[] | VehicleFormValues[] ;

      // Parse the CSV data based on arrayKey
      switch (arrayKey) {
        case 'locations':
          parsedData = await parseCSV<Location>(file);
          break;
        case 'vehicles':
          parsedData = await parseCSV<VehicleFormValues>(file);
          break;
        default:
          throw new Error(`No type defined for ${arrayKey}`);
      }

      if (parsedData.length === 0) {
        throw new Error('The uploaded file is empty or invalid.');
      }

      const body = { [arrayKey]: parsedData };

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

      if (response?.result?.data) {
        console.log('Data:', response.result.data);
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

  return (
    <Box>
      <Typography gutterBottom>Mass Upload (.csv file only)</Typography>
      <TextField
        fullWidth
        type="file"
        size="small"
        inputProps={{ accept: '.csv' }}
        onChange={handleFileChange}
        disabled={isUploading}
        sx={{ marginBottom: 2 }}
      />
      {file && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={isUploading}
          sx={{ marginBottom: 2 }}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      )}
      {message && (
        <Typography variant="body1" color={message.includes('successful') ? 'green' : 'red'}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default MassUpload;
