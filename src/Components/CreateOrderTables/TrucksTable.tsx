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
}

interface TrucksTableProps {
    trucks: Truck[];
    // onSelectionChange: (selected: Truck[]) => void;
}

const TrucksTable: React.FC<TrucksTableProps> = ({ trucks }) => {
    const dispatch = useAppDispatch();
    const selectedTrucks = useAppSelector((state: any) => state.auth.selectedTrucks);
    const [selectionModel, setSelectionModel] = useState<number[]>([]);

    useEffect(() => {
        // When trucks are available in Redux, set the selectionModel
        if (selectedTrucks.length > 0) {
            const selectedRowIds = selectedTrucks.map((truck: any) =>
                trucks.findIndex((t) => t.truckName === truck.truckName)
            );
            setSelectionModel(selectedRowIds);
        }
    }, [selectedTrucks, trucks]);

    const columns: GridColDef[] = [
        { field: 'truckName', headerName: 'Truck Name', width: 150 },
        { field: 'capacity', headerName: 'Capacity', width: 150 },
        { field: 'ownerName', headerName: 'Owner Name', width: 180 },
        { field: 'truckNumber', headerName: 'Truck Number', width: 180 },
        { field: 'height', headerName: 'Height', width: 120 },
        { field: 'width', headerName: 'Width', width: 120 },
        { field: 'length', headerName: 'Length', width: 120 },
        { field: 'volume', headerName: 'Volume', width: 120 },
        { field: 'usage', headerName: 'Usage', width: 120 },
        { field: 'id', headerName: 'ID', width: 100 },
    ];

    const rows = trucks.map((truck: any, index: any) => ({
        id: index,
        ...truck,
    }));

    const handleSelectionChange = (selectionModel: any) => {
        // Ensure selectionModel is an array of selected row ids
        const selectedTrucks = selectionModel.map((id: any) => trucks[id]);
        dispatch(setSelectedTrucks(selectedTrucks)); // Dispatch the selected trucks to Redux
    };

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                onRowSelectionModelChange={handleSelectionChange}
                rowSelectionModel={selectionModel} // Pre-select rows based on the Redux store
            />
        </div>
    );
};

export default TrucksTable;
