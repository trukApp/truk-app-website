// import React, { useState } from 'react';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import { Box, IconButton, Typography } from '@mui/material';
// import { ExpandMore, ExpandLess } from '@mui/icons-material';

// interface Allocation {
//     vehicle_ID: string;
//     totalWeightCapacity: number;
//     totalVolumeCapacity: number;
//     leftoverWeight: number;
//     leftoverVolume: number;
// }

// interface Truck {
//     label: string;
//     totalCost: number;
//     allocations: Allocation[];
//     unallocatedPackages: string[];
// }

// interface TrucksTableProps {
//     trucks: Truck[];
// }

// const TrucksTable: React.FC<TrucksTableProps> = ({ trucks }) => {
//     const [expandedRow, setExpandedRow] = useState<string | null>(null);

//     const toggleExpandRow = (label: string) => {
//         setExpandedRow(expandedRow === label ? null : label);
//     };

//     const columns: GridColDef[] = [
//         {
//             field: 'label',
//             headerName: 'Label',
//             width: 250,
//             renderCell: (params) => (
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => toggleExpandRow(params.row.label)}>
//                     {/* Show expand/collapse button only for trucks, not for allocations */}
//                     {params.value}
//                     {!params.row.isAllocation && (
//                         <IconButton size="small" >
//                             {expandedRow === params.row.label ? <ExpandLess /> : <ExpandMore />}
//                         </IconButton>
//                     )}
//                 </Box>
//             ),
//         },
//         { field: 'totalCost', headerName: 'Total Cost', width: 180 },
//         {
//             field: 'unallocatedPackages',
//             headerName: 'Unallocated Packages',
//             width: 250,
//             renderCell: (params) => Array.isArray(params.value) ? params.value.join(', ') : params.value || 'N/A',
//         },
//     ];

//     const rows = trucks.flatMap((truck) => [
//         { id: truck.label, ...truck, isAllocation: false }, // Parent row (Truck)
//         ...(expandedRow === truck.label
//             ? truck.allocations.map((allocation) => ({
//                 id: `${truck.label}-${allocation.vehicle_ID}`,
//                 label: `🚛 Vehicle ID: ${allocation.vehicle_ID}`,
//                 totalCost: `Weight: ${allocation.totalWeightCapacity} kg`,
//                 unallocatedPackages: `Volume: ${allocation.totalVolumeCapacity} m³`,
//                 isAllocation: true, // Flag to differentiate rows
//             }))
//             : []),
//     ]);

//     return (
//         <Box sx={{ height: 500, width: '100%' }}>
//             <Typography variant="h6">Suggested Trucks</Typography>
//             <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 getRowId={(row) => row.id}
//                 hideFooter
//                 // disableSelectionOnClick
//                 sx={{
//                     '& .MuiDataGrid-row': {
//                         '&.Mui-selected': { backgroundColor: 'transparent !important' },
//                     },
//                 }}
//                 getRowClassName={(params) => (params.row.isAllocation ? 'child-row' : '')} // Style child rows differently
//             />
//         </Box>
//     );
// };

// export default TrucksTable;



import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, Typography, Checkbox } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useAppDispatch } from "@/store";
import { setSelectedTrucks } from "@/store/authSlice";

interface Allocation {
    vehicle_ID: string;
    totalWeightCapacity: number;
    totalVolumeCapacity: number;
    leftoverWeight: number;
    leftoverVolume: number;
}

interface Truck {
    label: string;
    totalCost: number;
    allocations: Allocation[];
    unallocatedPackages: string[];
}

interface TrucksTableProps {
    trucks: Truck[];
}

const TrucksTable: React.FC<TrucksTableProps> = ({ trucks }) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
    const dispatch = useAppDispatch();

    const toggleExpandRow = (label: string) => {
        setExpandedRow(expandedRow === label ? null : label);
    };

    const handleSelectTruck = (truck: Truck) => {
        const isSelected = selectedTruck?.label === truck.label;
        const newSelectedTruck = isSelected ? null : truck; // Toggle selection

        setSelectedTruck(newSelectedTruck);
        dispatch(setSelectedTrucks(newSelectedTruck ? [newSelectedTruck] : []));
    };

    const columns: GridColDef[] = [
        {
            field: "select",
            headerName: "Select",
            width: 80,
            renderCell: (params) => (
                <Checkbox
                    checked={selectedTruck?.label === params.row.label}
                    onChange={() => handleSelectTruck(params.row)}
                    disabled={params.row.isAllocation} // Disable for allocation rows
                />
            ),
        },
        {
            field: "label",
            headerName: "Label",
            width: 250,
            renderCell: (params) => (
                <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    onClick={() => toggleExpandRow(params.row.label)}
                >
                    {params.value}
                    {!params.row.isAllocation && (
                        <IconButton size="small">
                            {expandedRow === params.row.label ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    )}
                </Box>
            ),
        },
        { field: "totalCost", headerName: "Total Cost", width: 180 },
        {
            field: "unallocatedPackages",
            headerName: "Unallocated Packages",
            width: 250,
            renderCell: (params) =>
                Array.isArray(params.value) ? params.value.join(", ") : params.value || "N/A",
        },
    ];

    const rows = trucks.flatMap((truck) => [
        { id: truck.label, ...truck, isAllocation: false }, // Parent row (Truck)
        ...(expandedRow === truck.label
            ? truck.allocations.map((allocation) => ({
                id: `${truck.label}-${allocation.vehicle_ID}`,
                label: `🚛 Vehicle ID: ${allocation.vehicle_ID}`,
                totalCost: `Weight: ${allocation.totalWeightCapacity} kg`,
                unallocatedPackages: `Volume: ${allocation.totalVolumeCapacity} m³`,
                isAllocation: true, // Flag to differentiate rows
            }))
            : []),
    ]);

    return (
        <Box sx={{ height: 500, width: "100%" }}>
            <Typography variant="h6">Suggested Trucks</Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.id}
                hideFooter
                sx={{
                    "& .MuiDataGrid-row": {
                        "&.Mui-selected": { backgroundColor: "transparent !important" },
                    },
                }}
                getRowClassName={(params) => (params.row.isAllocation ? "child-row" : "")} // Style child rows differently
            />
        </Box>
    );
};

export default TrucksTable;
