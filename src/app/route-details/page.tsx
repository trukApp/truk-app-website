'use client';

import React from 'react';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
// import { Typography, Paper, TablePagination } from "@mui/material";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow
// } from "@mui/material";

// const routeData = {
//   message: "Route deviation detected",
//   order_ID: "ORD000005",
//   vehicle_ID: "VEH000010",
//   expected_distance: "305.00 km",
//   actual_distance: "450.00 km",
//   start_deviation_km: "267.31",
//   end_deviation_km: "525.70",
//   deviation_detected: true,
//   deviation_reasons: [
//     "Start location deviated by 267.31 km.",
//     "End location deviated by 525.70 km.",
//     "Expected distance: 305.00 km, but driver traveled 450.00 km.",
//     "Driver had 2 off-route points"
//   ],
//   driverPointDeviations: [
//     {
//       lat: 17.392,
//       lng: 78.488,
//       time: "2024-02-27T10:00:00Z",
//       deviationDistanceKM: "267.83",
//       reason: "Driver >5km from route"
//     },
//     {
//       lat: 17.4,
//       lng: 78.49,
//       time: "2024-02-27T10:05:00Z",
//       deviationDistanceKM: "268.40",
//       reason: "Driver >5km from route"
//     }
//   ]
// };

const RouteDetails = () => {
  const deviationData = useSelector((state: RootState) => state.auth.deviationData);
  // console.log('deviationData:;', deviationData);
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  if (!deviationData) {
    return <p className="text-center text-gray-600">No route deviation data available.</p>;
  }


  // const handleChangePage = (_: unknown, newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  // const paginatedData = deviationData.driverPointDeviations?.slice(
  //   page * rowsPerPage,
  //   page * rowsPerPage + rowsPerPage
  // );
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4" style={{ color: '#83214F', textDecorationLine: 'underline' }}>
        Route Details
      </h1>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <p><strong>Order ID:</strong> {deviationData.order_ID}</p>
        <p><strong>Vehicle ID:</strong> {deviationData.vehicle_ID}</p>
        <p><strong>Expected Distance:</strong> {deviationData.expected_distance}</p>
        <p><strong>Actual Distance:</strong> {deviationData.actual_distance}</p>
      </div>

      {deviationData.deviation_detected && (
        <div className="bg-red-100 p-4 rounded-lg shadow mb-4">
          <h2 className="text-red-700 font-semibold" style={{ color: '#83214F', textDecorationLine: 'underline' }}>{deviationData.message}</h2>
          <p><strong>Start Deviation:</strong> {deviationData.start_deviation_km} km</p>
          <p><strong>End Deviation:</strong> {deviationData.end_deviation_km} km</p>
        </div>
      )}

      {deviationData.deviation_reasons?.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-bold mb-2" style={{ color: '#83214F', textDecorationLine: 'underline' }}>Deviation Reasons</h2>
          <ul className="list-disc pl-6">
            {deviationData.deviation_reasons.map((reason: string, index: number) => (
              <li key={index} className="text-gray-700">{reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" p={2}>
          Off-Route Points
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Deviation (km)</strong></TableCell>
              <TableCell><strong>Reason</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData?.map((point, index) => (
              <TableRow key={index}>
                <TableCell>(Lat: {point.lat}, Lang: {point.lng})</TableCell>
                <TableCell>{point.deviationDistanceKM}</TableCell>
                <TableCell>
                  <Typography color="error" fontWeight="bold">
                    {point.reason}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={deviationData.driverPointDeviations?.length || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer> */}

    </div>
  );
};

export default RouteDetails;
