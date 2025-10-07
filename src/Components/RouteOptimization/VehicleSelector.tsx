import React from 'react';
import { Box, Button } from '@mui/material';

interface VehicleSelectorProps {
    vehicles: { vehicle_ID: string; route: any[] }[];
    selectedVehicle: { vehicle_ID: string; startAddress: string; endAddress: string } | null;
    onSelect: (vehicle_ID: string, startAddress: string, endAddress: string) => void;
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({ vehicles, selectedVehicle, onSelect }) => {
    return (
        <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
            {vehicles.map((vehicle, index) => (
                <Button
                    key={`${vehicle.vehicle_ID}_${index}`}
                    variant={
                        selectedVehicle?.vehicle_ID === vehicle.vehicle_ID &&
                            selectedVehicle?.startAddress === vehicle?.route?.[0]?.start?.address &&
                            selectedVehicle?.endAddress === vehicle?.route?.[0]?.end?.address
                            ? 'contained'
                            : 'outlined'
                    }
                    onClick={() =>
                        onSelect(
                            vehicle.vehicle_ID,
                            vehicle?.route?.[0]?.start?.address,
                            vehicle?.route?.[0]?.end?.address
                        )
                    }
                >
                    {vehicle?.vehicle_ID}
                </Button>
            ))}
        </Box>
    );
};

export default VehicleSelector;
