import { Skeleton, Box } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp, GridPaginationModel } from "@mui/x-data-grid";

interface SkeletonLoaderProps {
  columns: GridColDef[];
  rowCount?: number;
}

const DataGridSkeletonLoader: React.FC<SkeletonLoaderProps> = ({ columns, rowCount = 10 }) => {
  const skeletonRows: GridRowsProp = Array.from({ length: rowCount }).map((_, index) => ({
    id: index,
  }));

  const skeletonColumns = columns.map((col) => ({
    ...col,
    renderCell: () => <Skeleton variant="text" width="80%" />,
    sortable: false,
    filterable: false,
  }));

  const rowHeight = 60;

  const paginationModel: GridPaginationModel = {
    pageSize: rowCount || 10,
    page: 0,
  };

  return (
    <Box sx={{ height: rowHeight * rowCount, width: "100%" }}>
      <DataGrid
        columns={skeletonColumns}
        rows={skeletonRows}
        disableColumnMenu
        hideFooter
        pagination
        paginationModel={paginationModel}
        autoHeight
      />
    </Box>
  );
};

export default DataGridSkeletonLoader;
