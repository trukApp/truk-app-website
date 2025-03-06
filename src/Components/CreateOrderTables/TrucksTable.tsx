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
    label: string;
    totalCost: number;
    allocations: Allocation[];
    unallocatedPackages: string[];
}

interface TrucksTableProps {
    trucks: Truck[];
}

const TrucksTable: React.FC<TrucksTableProps> = ({trucks} ) => {
    // const [expandedRow, setExpandedRow] = useState<string | null>(null);
    // const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
    // const dispatch = useAppDispatch();
    // const selectedTrucks = useAppSelector((state) => state.auth.selectedTrucks || []);
    // const toggleExpandRow = (label: string) => {
    //     setExpandedRow(expandedRow === label ? null : label);
    // };
    // console.log("trucks: ", trucks)

    // const handleSelectTruck = (truck: Truck) => {
    //     const isSelected = selectedTruck?.label === truck.label;
    //     const newSelectedTruck = isSelected ? null : truck;
    //     setSelectedTruck(newSelectedTruck);
    //     dispatch(setSelectedTrucks(newSelectedTruck ? [newSelectedTruck] : []));
    // };

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


    const rows = trucks.flatMap((truck, index) => [
        {
            id: index + 1,
            ...truck
        },
    ]);


    return (
        <Box sx={{ height: 500, width: "100%" }}>
            <Typography variant="h5" sx={{textAlign:'center', fontWeight:500,marginTop:3, }}>Suggested Trucks</Typography>
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
