'use client';

import React from 'react';

const routeData = {
  message: "Route deviation detected",
  order_ID: "ORD000005",
  vehicle_ID: "VEH000010",
  expected_distance: "305.00 km",
  actual_distance: "450.00 km",
  start_deviation_km: "267.31",
  end_deviation_km: "525.70",
  deviation_detected: true,
  deviation_reasons: [
    "Start location deviated by 267.31 km.",
    "End location deviated by 525.70 km.",
    "Expected distance: 305.00 km, but driver traveled 450.00 km.",
    "Driver had 2 off-route points"
  ],
  driverPointDeviations: [
    {
      lat: 17.392,
      lng: 78.488,
      time: "2024-02-27T10:00:00Z",
      deviationDistanceKM: "267.83",
      reason: "Driver >5km from route"
    },
    {
      lat: 17.4,
      lng: 78.49,
      time: "2024-02-27T10:05:00Z",
      deviationDistanceKM: "268.40",
      reason: "Driver >5km from route"
    }
  ]
};

const RouteDetails = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Route Details</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <p><strong>Order ID:</strong> {routeData.order_ID}</p>
        <p><strong>Vehicle ID:</strong> {routeData.vehicle_ID}</p>
        <p><strong>Expected Distance:</strong> {routeData.expected_distance}</p>
        <p><strong>Actual Distance:</strong> {routeData.actual_distance}</p>
      </div>

      <div className="bg-red-100 p-4 rounded-lg shadow mb-4">
        <p className="text-red-700 font-semibold">{routeData.message}</p>
        <p><strong>Start Deviation:</strong> {routeData.start_deviation_km} km</p>
        <p><strong>End Deviation:</strong> {routeData.end_deviation_km} km</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-bold mb-2">Deviation Reasons</h2>
        <ul className="list-disc pl-6">
          {routeData.deviation_reasons.map((reason, index) => (
            <li key={index} className="text-gray-700">{reason}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-2">Off-Route Points</h2>
        {routeData.driverPointDeviations.map((point, index) => (
          <div key={index} className="p-3 mb-2 bg-gray-50 rounded">
            <p><strong>Location:</strong> ({point.lat}, {point.lng})</p>
            <p><strong>Time:</strong> {new Date(point.time).toLocaleString()}</p>
            <p><strong>Deviation:</strong> {point.deviationDistanceKM} km</p>
            <p className="text-red-600 font-semibold">{point.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteDetails;
