import { Skeleton, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

interface SkeletonLoaderProps {
  columns: GridColDef[];
  rowCount?: number;
}

const DataGridSkeletonLoader = ({ rowCount = 10 }: SkeletonLoaderProps) => {
  const skeletonRows: GridRowsProp = Array.from(
    { length: rowCount },
    (_, index) => ({
      id: index,
      loading: "",
    }),
  );

  const skeletonColumns: GridColDef[] = [
    {
      field: "loading",
      headerName: "Loading",
      width: 200,
      renderCell: () => <Skeleton variant="text" width="80%" />,
    },
  ];

  return (
    <Grid style={{ height: 500, width: "100%" }}>
      <DataGrid columns={skeletonColumns} rows={skeletonRows} hideFooter />
    </Grid>
  );
};

export default DataGridSkeletonLoader;
