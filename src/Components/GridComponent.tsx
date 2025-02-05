// import React from "react";
// import {
//   DataGrid,
//   GridColDef,
//   useGridApiRef,
//   GridPaginationModel,
// } from "@mui/x-data-grid";
// import { CircularProgress } from "@mui/material";
// import { useGetDataCountQuery } from "@/api/apiSlice";

// interface PaginationComponentProps {
//   columns: GridColDef[];
//   rows?: { id: number; [key: string]: string | number }[];
//   isLoading: boolean;
//   paginationModel: GridPaginationModel;
//   rowCount: number;
//   onPaginationModelChange: (model: GridPaginationModel) => void;
//   pageSizeOptions?: number[];
// }

// export const DataGridComponent: React.FC<PaginationComponentProps> = ({
//   columns,
//   rows = [],
//   isLoading,
//   paginationModel,
//   rowCount,
//   onPaginationModelChange,
//   pageSizeOptions = [2,10, 20, 30],
// }) => {
//   const apiRef = useGridApiRef();
//   const { data } = useGetDataCountQuery([])
//   console.log("data cont :", data.counts)

//   return (
//     <div style={{ height: 500, width: "100%", fontFamily: "Poppins", marginTop: "-30px" }}>
//       <DataGrid
//         apiRef={apiRef}
//         rows={rows}
//         columns={columns}
//         paginationMode="server"
//         loading={isLoading}
//         pageSizeOptions={pageSizeOptions}
//         paginationModel={paginationModel}
//         rowCount={rowCount}
//         onPaginationModelChange={onPaginationModelChange}
//         initialState={{ pagination: { rowCount: -1 } }}
//         sx={{
//           "& .MuiDataGrid-footerContainer": { fontFamily: "Poppins" },
//           "& .MuiTablePagination-select": { fontFamily: "Poppins" },
//           "& .MuiTablePagination-actions": { fontFamily: "Poppins" },
//           "& .MuiTablePagination-displayedRows": { fontFamily: "Poppins" },
//         }}
//       />
//       {isLoading && <CircularProgress style={{ position: "absolute", top: "50%", left: "50%" }} />}
//     </div>
//   );
// };


import React from "react";
import {
  DataGrid,
  GridColDef,
  useGridApiRef,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { CircularProgress } from "@mui/material";
import { useGetDataCountQuery } from "@/api/apiSlice";

// Define the structure of the API response counts
interface DataCounts {
  vehicles: number;
  products: number;
  locations: number;
  lanes: number;
  devices: number;
  drivers: number;
  carriers: number;
}

// Define the expected API response type
interface ApiResponse {
  message: string;
  counts: DataCounts;
}

// Props for the DataGridComponent
interface PaginationComponentProps {
  columns: GridColDef[];
  rows?: { id: number; [key: string]: string | number }[];
  isLoading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  pageSizeOptions?: number[];
  activeEntity: keyof DataCounts; 
  rowCount?: number;
}

export const DataGridComponent: React.FC<PaginationComponentProps> = ({
  columns,
  rows = [],
  isLoading,
  paginationModel,
  onPaginationModelChange,
  pageSizeOptions = [2, 10, 20, 30],
  activeEntity,
  rowCount,
}) => {
  const apiRef = useGridApiRef();
  const { data } = useGetDataCountQuery([]) as { data?: ApiResponse }; // Typecast API response properly

  // Use rowCount prop if provided; otherwise, fallback to API count
  const computedRowCount = rowCount ?? data?.counts?.[activeEntity] ?? 0;

  return (
    <div style={{ height: 500, width: "100%", fontFamily: "Poppins", marginTop: "-30px" }}>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        paginationMode="server"
        loading={isLoading}
        pageSizeOptions={pageSizeOptions}
        paginationModel={paginationModel}
        rowCount={computedRowCount}
        onPaginationModelChange={onPaginationModelChange}
        initialState={{ pagination: { rowCount: -1 } }}
        sx={{
          "& .MuiDataGrid-footerContainer": { fontFamily: "Poppins" },
          "& .MuiTablePagination-select": { fontFamily: "Poppins" },
          "& .MuiTablePagination-actions": { fontFamily: "Poppins" },
          "& .MuiTablePagination-displayedRows": { fontFamily: "Poppins" },
        }}
      />
      {isLoading && <CircularProgress style={{ position: "absolute", top: "50%", left: "50%" }} />}
    </div>
  );
};
