import React from "react";
import {
  DataGrid,
  GridColDef,
  useGridApiRef,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { CircularProgress} from "@mui/material";

interface PaginationComponentProps {
  columns: GridColDef[];
  rows?: { id: number; [key: string]: string | number }[];
  isLoading: boolean;
  paginationModel: GridPaginationModel;
  rowCount: number;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  pageSizeOptions?: number[];
}

export const DataGridComponent: React.FC<PaginationComponentProps> = ({
  columns,
  rows = [],
  isLoading,
  paginationModel,
  rowCount,
  onPaginationModelChange,
  pageSizeOptions = [2,10, 20, 30],
}) => {
  const apiRef = useGridApiRef();

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
        rowCount={rowCount}
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
