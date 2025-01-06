import React
  // { useState }
  from "react";
import {
  DataGrid, GridColDef
  // , GridRowSelectionModel
} from "@mui/x-data-grid";

interface DataGridComponentProps {
  columns: GridColDef[];
  rows: [];
  isLoading: boolean;
  pageSizeOptions?: number[];
  initialPageSize?: number;
}

export const DataGridComponent: React.FC<DataGridComponentProps> = ({
  columns,
  rows = [],
  isLoading,
  pageSizeOptions = [10, 20, 50],
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
        // checkboxSelection
        // onRowSelectionModelChange={handleSelectionChange}
        // rowSelectionModel={selectionModel}
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
