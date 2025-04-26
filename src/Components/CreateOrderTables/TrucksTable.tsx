import React
    // ,{ useState }

    from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    Box,
    // IconButton,
    Typography
} from "@mui/material";
// import { ExpandMore, ExpandLess } from "@mui/icons-material";
// import { useAppDispatch, useAppSelector } from "@/store";
// import { setSelectedTrucks } from "@/store/authSlice";

export interface Allocation {
    vehicle_ID: string;
    totalWeightCapacity: number;
    totalVolumeCapacity: number;
    leftoverWeight: number;
    leftoverVolume: number;
    cost: number
}

export interface Truck {
    occupiedVolume: number;
    occupiedWeight: number;
    label: string;
    totalCost: number;
    allocations: Allocation[];
    unallocatedPackages: string[];
    vehicle_ID: string;
    totalWeightCapacity: number;
    leftoverWeight: string;
    totalVolumeCapacity: number;
    leftoverVolume: number;
    cost: number;
    loadArrangement: []
}

interface TrucksTableProps {
    trucks: Truck[];
    unAllocatedPackages: []
}

const TrucksTable: React.FC<TrucksTableProps> = ({ trucks, unAllocatedPackages }) => {
    const columns: GridColDef[] = [
        { field: "vehicle_ID", headerName: "Vehicle ID", width: 180 },
        { field: "cost", headerName: "Total cost", width: 180 },
        { field: "totalWeightCapacity", headerName: "Total weight capacity", width: 180 },
        { field: "occupiedWeight", headerName: "Occupied weight", width: 180 },
        { field: "totalVolumeCapacity", headerName: "Total volume capacity", width: 180 },
        { field: "occupiedVolume", headerName: "Occupied volume", width: 180 },
        { field: "leftoverWeight", headerName: "Left over weight", width: 180 },
        { field: "leftoverVolume", headerName: "Left over volume", width: 180 },
        { field: "unallocatedPackages", headerName: "Unallocated Packages", width: 180 },
    ];
    console.log("trucss :", trucks)
    console.log("unAllocatedPackages: ", unAllocatedPackages)
    const rows = trucks.flatMap((truck, index) => [
        {
            id: index + 1,
            ...truck,
            cost: truck.cost?.toFixed(2),
            totalWeightCapacity: truck?.totalWeightCapacity?.toFixed(2),
            occupiedWeight: truck?.occupiedWeight?.toFixed(2),
            totalVolumeCapacity: truck?.totalVolumeCapacity?.toFixed(2),
            occupiedVolume: truck?.occupiedVolume?.toFixed(2),
            leftoverWeight: parseFloat(truck?.leftoverWeight)?.toFixed(2),
            leftoverVolume: truck?.leftoverVolume.toFixed(2),

        },
    ]);

    return (
        <Box sx={{ height: 500, width: "100%" }}>
            {unAllocatedPackages.length > 0 && (
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6" color="error" fontWeight={600}>
                        Unallocated Packages: {unAllocatedPackages.join(", ")}
                    </Typography>
                </Box>
            )}

            <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 500, marginTop: 3, }}>Suggested Trucks</Typography>
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
                getRowClassName={(params) => (params.row.isAllocation ? "child-row" : "")}
            />
        </Box>
    );
};

export default TrucksTable;
