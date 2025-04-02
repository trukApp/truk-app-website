'use client';

import React from 'react';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { DriverPointDeviation } from '@/store/authSlice';
import { Box, Typography, Grid, Paper } from "@mui/material";

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
  console.log('deviationData:;', deviationData);
  if (!deviationData) {
    return <p className="text-center text-gray-600">No route deviation data available.</p>;
  }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Route Details</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <p><strong>Order ID:</strong> {deviationData.order_ID}</p>
        <p><strong>Vehicle ID:</strong> {deviationData.vehicle_ID}</p>
        <p><strong>Expected Distance:</strong> {deviationData.expected_distance}</p>
        <p><strong>Actual Distance:</strong> {deviationData.actual_distance}</p>
      </div>

      {deviationData.deviation_detected && (
        <div className="bg-red-100 p-4 rounded-lg shadow mb-4">
          <p className="text-red-700 font-semibold">{deviationData.message}</p>
          <p><strong>Start Deviation:</strong> {deviationData.start_deviation_km} km</p>
          <p><strong>End Deviation:</strong> {deviationData.end_deviation_km} km</p>
        </div>
      )}

      {deviationData.deviation_reasons?.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-bold mb-2">Deviation Reasons</h2>
          <ul className="list-disc pl-6">
            {deviationData.deviation_reasons.map((reason: string, index: number) => (
              <li key={index} className="text-gray-700">{reason}</li>
            ))}
          </ul>
        </div>
      )}

      <Box sx={{ bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Off-Route Points
        </Typography>

        <Grid container spacing={2}>
          {deviationData.driverPointDeviations?.map((point: DriverPointDeviation, index: number) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Paper elevation={3} sx={{ p: 2, bgcolor: "white", borderRadius: 2 }}>
                <Typography>
                  <strong>Location:</strong> ({point.lat}, {point.lng})
                </Typography>
                <Typography>
                  <strong>Deviation:</strong> {point.deviationDistanceKM} km
                </Typography>
                <Typography color="error" fontWeight="bold">
                  {point.reason}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>


    </div>
  );
};

export default RouteDetails;
