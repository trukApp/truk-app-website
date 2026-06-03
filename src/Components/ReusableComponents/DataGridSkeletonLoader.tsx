// import { Skeleton, Box } from "@mui/material";
// import {
//   DataGrid,
//   GridColDef,
//   GridRowsProp,
//   GridPaginationModel,
// } from "@mui/x-data-grid";

// interface SkeletonLoaderProps {
//   columns: GridColDef[];
//   rowCount?: number;
// }

// const DataGridSkeletonLoader: React.FC<SkeletonLoaderProps> = ({
//   columns,
//   rowCount = 10,
// }) => {
//   const skeletonRows: GridRowsProp = Array.from({ length: rowCount }).map(
//     (_, index) => ({
//       id: index,
//     }),
//   );

//   // const skeletonColumns = columns.map((col) => ({
//   //   ...col,
//   //   renderCell: () => <Skeleton variant="text" width="80%" />,
//   //   sortable: false,
//   //   filterable: false,
//   // }));

//   const skeletonColumns: GridColDef[] = columns.map(
//     (col): GridColDef => ({
//       field: col.field,
//       headerName: col.headerName,
//       width: col.width || 150,
//       renderCell: () => <Skeleton variant="text" width="80%" />,
//       sortable: false,
//       filterable: false,
//     }),
//   );
//   const rowHeight = 60;

//   const paginationModel: GridPaginationModel = {
//     pageSize: rowCount || 10,
//     page: 0,
//   };

//   return (
//     // <Box sx={{ height: rowHeight * rowCount, width: "100%" }}>
//     <Box
//       style={{
//         height: rowHeight * rowCount,
//         width: "100%",
//       }}
//     >
//       <DataGrid
//         columns={skeletonColumns}
//         rows={skeletonRows}
//         disableColumnMenu
//         hideFooter
//         pagination
//         paginationModel={paginationModel}
//         autoHeight
//       />
//     </Box>
//   );
// };

// export default DataGridSkeletonLoader;

import { Skeleton } from "@mui/material";
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
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid columns={skeletonColumns} rows={skeletonRows} hideFooter />
    </div>
  );
};

export default DataGridSkeletonLoader;
