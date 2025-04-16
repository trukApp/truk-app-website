import React  from "react";
import {
  DataGrid,
  GridColDef,
  useGridApiRef,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { CircularProgress  } from "@mui/material";
import { useGetDataCountQuery } from "@/api/apiSlice";
import { useQuery } from '@apollo/client';
import { GET_COUNT_DATA, GET_COUNTS } from "@/api/graphqlApiSlice";
interface DataCounts {
  vehicles: number;
  products: number;
  locations: number;
  lanes: number;
  devices: number;
  drivers: number;
  carriers: number;
  customers: number;
  vendors: number;
  packages: number;
  uoms:number;
}

interface ApiResponse {
  message: string;
  counts: DataCounts;
}
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

interface DataGridNoPaginationProps {
  columns: GridColDef[];
  rows?: { id: number; [key: string]: string | number }[];
  isLoading: boolean;
  pageSizeOptions?: number[];
  initialPageSize?: number;
}

export const DataGridComponent: React.FC<PaginationComponentProps> = ({
  columns,
  rows = [],
  isLoading,
  paginationModel,
  onPaginationModelChange,
  pageSizeOptions = [10, 20, 30],
  activeEntity,
 
}) => {
  const apiRef = useGridApiRef();
  const { data } = useGetDataCountQuery([]) as { data?: ApiResponse }; // Typecast API response properly
  // const { data } = useQuery(GET_COUNT_DATA) ;
  // console.log(data)
  const computedRowCount =  data?.counts?.[activeEntity] ?? 0;



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

export const DataGridNoPagination: React.FC<DataGridNoPaginationProps> = ({
  columns,
  rows = [],
  isLoading,
  pageSizeOptions = [10,20,30],
  initialPageSize = 10,
}) => {
  const safeRows = rows ?? [];

  return (
    <div
      style={{
        height: 500,
        width: "100%",
        fontFamily: "Poppins",
        marginTop: "-30px",
      }}
    >
      <DataGrid
        rows={safeRows}
        columns={columns}
        loading={isLoading}
        initialState={{
          pagination: { paginationModel: { pageSize: initialPageSize } },
        }}
        pageSizeOptions={pageSizeOptions}
        sx={{
          "& .MuiDataGrid-footerContainer": {
            fontFamily: "Poppins",
          },
          "& .MuiTablePagination-select": {
            fontFamily: "Poppins",
          },
          "& .MuiTablePagination-actions": {
            fontFamily: "Poppins",
          },
          "& .MuiTablePagination-displayedRows": {
            fontFamily: "Poppins",
          },
        }}
      />
    </div>
  );
};