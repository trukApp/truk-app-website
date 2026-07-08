// import { Vehicle } from "@/types/vehicle";

// export const mapVehicleData = (
//   data: any[]
// ): Vehicle[] => {
//   return data.map((item, index) => ({
//     id: index,

//     vehicleNumber:
//       item.vehicleId || item.regNo,

//     driverName:
//       item.driverName === "-"
//         ? "Not Assigned"
//         : item.driverName,

//     driverPhone:
//       item.driverMobile === "-"
//         ? ""
//         : item.driverMobile,

//     status:
//       item.speed > 0
//         ? "Moving"
//         : item.ignitionStatus === "ON"
//         ? "Idle"
//         : "Stopped",

//     engineOn:
//       item.ignitionStatus === "ON",

//     speed: item.speed,

//     fuelLevel:
//       Number(item.fuelLitres) || 0,
// idleTime: item.idleTime,

//     todayDistance:
//       item.distanceCovered,

//     location: item.address,

//     latitude: item.lat,

//     longitude: item.lng,

//     vehicleType:
//       item.vehicleType,

//     lastUpdated:
//       item.lastSeen,

//     ignitionStatus:
//       item.ignitionStatus,

//     powerStatus:
//       item.powerStatus,

//     gsmLevel:
//       item.gsmLevel,

//     expiryDate:
//       item.expiryDate,

//     overSpeedLimit:
//       item.overSpeedLimit,
//   }));
// };


import {
  Vehicle,
  VehicleTrackingApiResponse,
} from "@/types/vehicle";

export const mapVehicleData = (
  data: VehicleTrackingApiResponse[]
): Vehicle[] => {
  return data.map((item, index): Vehicle => ({
    id: index,

    vehicleNumber: item.vehicleId || item.regNo,

    driverName:
      item.driverName === "-"
        ? "Not Assigned"
        : item.driverName,

    driverPhone:
      item.driverMobile === "-"
        ? ""
        : item.driverMobile,

    status:
      item.speed > 0
        ? "Moving"
        : item.ignitionStatus === "ON"
        ? "Idle"
        : "Stopped",

    engineOn: item.ignitionStatus === "ON",

    speed: item.speed,

    fuelLevel: Number(item.fuelLitres) || 0,

    idleTime: item.idleTime,

    todayDistance: item.distanceCovered,

    location: item.address,

    latitude: item.lat,

    longitude: item.lng,

    vehicleType: item.vehicleType,

    lastUpdated: item.lastSeen,

    ignitionStatus: item.ignitionStatus,

    powerStatus: item.powerStatus,

    gsmLevel: item.gsmLevel,

    expiryDate: item.expiryDate,

    overSpeedLimit: item.overSpeedLimit,

    // Required by Vehicle
    lastStartedAt: item.lastSeen,
  }));
};