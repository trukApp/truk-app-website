import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppSelector, useAppDispatch } from '@/store';
import { setSelectedTrucks } from '@/store/authSlice';

interface Truck {
    ownerName: string;
    truckNumber: string;
    height: string;
    width: string;
    length: string;
    volume: string;
    capacity: string;
    usage: string;
    truckName: string;
    id: number;

    allocatedVolume: number;
    vehicle_ID: string;
    allocatedWeight: number;
    leftoverWeight: string;
    leftoverVolume: string;


}

interface TrucksTableProps {
    trucks: Truck[];
    // rootOptimization: []
}

const TrucksTable: React.FC<TrucksTableProps> = ({ trucks }) => {
    console.log("trucks: ", trucks)
    // console.log("rootOptimization: ", rootOptimization)
    const dispatch = useAppDispatch();
    const selectedTrucks = useAppSelector((state) => state.auth.selectedTrucks || []);
    const [selectionModel, setSelectionModel] = useState<number[]>([]);
    useEffect(() => {
        if (selectedTrucks.length > 0) {
            const selectedRowIds = selectedTrucks.map((truck: Truck) =>
                trucks.findIndex((t) => t.vehicle_ID === truck.vehicle_ID)
            );
            setSelectionModel(selectedRowIds);
        }
    }, [selectedTrucks, trucks]);

    const columns: GridColDef[] = [
        { field: 'vehicle_ID', headerName: 'Vechile ID', width: 150 },
        { field: 'allocatedWeight', headerName: 'Allocated Weight', width: 180 },
        { field: 'allocatedVolume', headerName: 'Allocated Volume', width: 150 },
        { field: 'leftoverWeight', headerName: 'Left over Weight', width: 180 },
        { field: 'leftoverVolume', headerName: 'Left over volume', width: 120 },
    ];


    const rows = trucks.map((truck: Truck, index: number) => ({
        ...truck,
        id: index,
    }));


    const handleSelectionChange = (selectionModel: number[]) => {
        const selectedTrucks = selectionModel.map((id: number) => trucks[id]);
        dispatch(setSelectedTrucks(selectedTrucks));
    };

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                // onRowSelectionModelChange={handleSelectionChange}
                onRowSelectionModelChange={(model) =>
                    handleSelectionChange(model as number[])
                }
                rowSelectionModel={selectionModel}
            />
        </div>
    );
};

export default TrucksTable;
