'use client';
import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from "@mui/material";

const mapContainerStyle = {
    width: "100%",
    height: "500px",
};

interface Vehicle {
    regNo: string;
    status: string;
    speed: number;
    lastSeen: string;
    latitude: string;
    longitude: string;
    vehicleId: string;
    vehicleType: string;
    deviceId: string;
}

const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const liveUrl: string = process.env.NEXT_PUBLIC_LIVE_TRACK_URL ?? '';

const LiveTracking: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const vehicleId = "TS08JB3663";
    const deviceId = "867232055767934";

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [vehiclePath, setVehiclePath] = useState<{ [key: string]: { lat: number, lng: number }[] }>({});
    const [trackedPath, setTrackedPath] = useState<{ lat: number; lng: number }[]>([]);
    const [isTracking, setIsTracking] = useState(false);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

    const selectedVehicleRef = useRef<Vehicle | null>(null);
    const { isLoaded } = useJsApiLoader({ googleMapsApiKey: mapsKey });

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(liveUrl);
                const data: Vehicle[] = await response.json();
                console.log('data', data);
                if (Array.isArray(data)) {
                    const validVehicles = data.filter(vehicle => vehicle.latitude && vehicle.longitude);
                    setVehicles(validVehicles);

                    validVehicles.forEach(vehicle => {
                        const newPoint = { lat: parseFloat(vehicle.latitude), lng: parseFloat(vehicle.longitude) };

                        // setVehiclePath(prevPath => ({
                        //     ...prevPath,
                        //     [vehicle.deviceId]: [...(prevPath[vehicle.deviceId] || []), newPoint].slice(-50),
                        // }));
                        setVehiclePath(prevPath => ({
                            ...prevPath,
                            [vehicle.deviceId]: [...(prevPath[vehicle.deviceId] || []), newPoint]
                        }));

                    });

                    const dynamicVehicle = validVehicles.find(v => v.deviceId === deviceId);
                    if (dynamicVehicle) {
                        setSelectedVehicle(dynamicVehicle);
                        if (!mapCenter) {
                            setMapCenter({
                                lat: parseFloat(dynamicVehicle.latitude),
                                lng: parseFloat(dynamicVehicle.longitude),
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }
        };

        fetchVehicles();
        const interval = setInterval(fetchVehicles, 5000);
        return () => clearInterval(interval);
    }, [deviceId, mapCenter]);

    useEffect(() => {
        selectedVehicleRef.current = selectedVehicle;
    }, [selectedVehicle]);

    useEffect(() => {
        selectedVehicleRef.current = selectedVehicle;

        if (selectedVehicle) {
            if (selectedVehicle.status === "moving" && !isTracking) {
                setIsTracking(true);

                // Store lat/lng every 5 minutes
                const trackingInterval = setInterval(() => {
                    setTrackedPath(prevPath => [
                        ...prevPath,
                        { lat: parseFloat(selectedVehicle.latitude), lng: parseFloat(selectedVehicle.longitude) },
                    ]);
                }, 5 * 60 * 1000);

                return () => clearInterval(trackingInterval);
            }

            if (selectedVehicle.status === "stopped" && isTracking) {
                setIsTracking(false);
            }
        }
    }, [selectedVehicle]);


    const getVehicleIcon = (vehicleType: string) => {
        switch (vehicleType.toLowerCase()) {
            case "car":
                return "https://maps.google.com/mapfiles/kml/shapes/cabs.png";
            case "truck":
                return "https://maps.google.com/mapfiles/kml/shapes/truck.png";
            default:
                return "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
        }
    };

    if (!isLoaded) return <p>Loading Maps...</p>;
    if (!mapCenter) return <p>Loading vehicle data...</p>;

    const handleViewRouteDetails = () => {
        router.push('/route-details');
    };

    return (
        <div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={14}
                center={selectedVehicle ? { lat: parseFloat(selectedVehicle.latitude), lng: parseFloat(selectedVehicle.longitude) } : mapCenter}
            >
                {vehicles.map((vehicle) => (
                    <Marker
                        key={vehicle.deviceId}
                        position={{
                            lat: parseFloat(vehicle.latitude),
                            lng: parseFloat(vehicle.longitude),
                        }}
                        icon={{
                            url: getVehicleIcon(vehicle.vehicleType),
                            scaledSize: new window.google.maps.Size(20, 20),
                        }}
                    />
                ))}

                {selectedVehicle && vehiclePath[selectedVehicle.deviceId] && (
                    <Polyline
                        path={vehiclePath[selectedVehicle.deviceId]}
                        options={{
                            strokeColor: "#0000FF",
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                        }}
                    />
                )}

                {trackedPath.length > 1 && (
                    <Polyline
                        path={trackedPath}
                        options={{
                            strokeColor: "#FF0000",
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                        }}
                    />
                )}

            </GoogleMap>

            {selectedVehicle && (
                <div>
                    <h3>Vehicle Details</h3>
                    <p><strong>Registration:</strong> {selectedVehicle.regNo}</p>
                    <p><strong>Status:</strong> {selectedVehicle.status}</p>
                    <p><strong>Speed:</strong> {selectedVehicle.speed} km/h</p>
                    <p><strong>Last Seen:</strong> {selectedVehicle.lastSeen}</p>
                    <p><strong>Vehicle ID:</strong> {selectedVehicle.vehicleId}</p>
                </div>
            )}
            {trackedPath.length > 0 && (
                <div>
                    <h3>Tracked Route (5-min intervals)</h3>
                    <ul>
                        {trackedPath.map((point, index) => (
                            <li key={index}>
                                Lat: {point.lat}, Lng: {point.lng}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleViewRouteDetails}
            >
                View Route Details
            </Button>
        </div>
    );
};

export default LiveTracking;



// ###################################################### static values ##############################################################
// 'use client';
// import React, { useEffect, useState } from "react";
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";

// const mapContainerStyle = {
//     width: "100%",
//     height: "500px",
// };

// const center = {
//     lat: 17.3850,
//     lng: 78.4867,
// };

// const hyderabadLocations = [
//     { lat: 17.3850, lng: 78.4867 },
//     { lat: 17.4484, lng: 78.3915 },
//     { lat: 17.4399, lng: 78.4983 },
//     { lat: 17.3606, lng: 78.4744 },
//     { lat: 17.4156, lng: 78.4347 },
// ];

// const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

// const LiveTracking: React.FC = () => {
//     const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(0);
//     const [vehiclePosition, setVehiclePosition] = useState<{ lat: number; lng: number }>(hyderabadLocations[0]);
//     const [completedRoutes, setCompletedRoutes] = useState<boolean[]>(new Array(hyderabadLocations.length - 1).fill(false));
//     const [isMoving, setIsMoving] = useState<boolean>(false);
//     const [isDeviation, setIsDeviation] = useState<boolean>(false);

//     const { isLoaded } = useJsApiLoader({
//         googleMapsApiKey: mapsKey,
//     });

//     const interpolate = (start: { lat: number; lng: number }, end: { lat: number; lng: number }, fraction: number) => {
//         return {
//             lat: start.lat + (end.lat - start.lat) * fraction,
//             lng: start.lng + (end.lng - start.lng) * fraction,
//         };
//     };

//     // Function to calculate distance between two lat/lng points using Haversine formula
//     const getDistance = (pos1: { lat: number; lng: number }, pos2: { lat: number; lng: number }) => {
//         const R = 6371e3; // Radius of the Earth in meters
//         const lat1 = (pos1.lat * Math.PI) / 180;
//         const lat2 = (pos2.lat * Math.PI) / 180;
//         const deltaLat = ((pos2.lat - pos1.lat) * Math.PI) / 180;
//         const deltaLng = ((pos2.lng - pos1.lng) * Math.PI) / 180;

//         const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
//                   Math.cos(lat1) * Math.cos(lat2) *
//                   Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         return R * c; // Distance in meters
//     };

//     useEffect(() => {
//         let animationFrameId: number;

//         const moveVehicle = () => {
//             if (currentLocationIndex < hyderabadLocations.length - 1) {
//                 const start = hyderabadLocations[currentLocationIndex];
//                 const end = hyderabadLocations[currentLocationIndex + 1];
//                 const duration = 5000;
//                 const startTime = Date.now();

//                 const animate = () => {
//                     const now = Date.now();
//                     const elapsed = now - startTime;
//                     const fraction = elapsed / duration;

//                     if (fraction < 1) {
//                         const newPosition = interpolate(start, end, fraction);
//                         setVehiclePosition(newPosition);

//                         // Check for route deviation
//                         const expectedDistance = getDistance(start, end);
//                         const actualDistance = getDistance(newPosition, end);
//                         if (actualDistance > expectedDistance * 1.2) { // Allow 20% buffer
//                             if (!isDeviation) {
//                                 setIsDeviation(true);
//                                 alert("Route deviation detected! Please get back on track.");
//                             }
//                         } else {
//                             setIsDeviation(false);
//                         }

//                         animationFrameId = requestAnimationFrame(animate);
//                     } else {
//                         setVehiclePosition(end);
//                         setCompletedRoutes(prevRoutes => {
//                             const updatedRoutes = [...prevRoutes];
//                             updatedRoutes[currentLocationIndex] = true;
//                             return updatedRoutes;
//                         });
//                         setTimeout(() => {
//                             setCurrentLocationIndex(prevIndex => prevIndex + 1);
//                         }, 1000);
//                     }
//                 };

//                 animate();
//             } else {
//                 setIsMoving(false);
//             }
//         };

//         if (isMoving) {
//             moveVehicle();
//         }

//         return () => {
//             if (animationFrameId) {
//                 cancelAnimationFrame(animationFrameId);
//             }
//         };
//     }, [currentLocationIndex, isMoving]);

//     const handleStartTracking = () => {
//         setCurrentLocationIndex(0);
//         setVehiclePosition(hyderabadLocations[0]);
//         setCompletedRoutes(new Array(hyderabadLocations.length - 1).fill(false));
//         setIsMoving(true);
//         setIsDeviation(false);
//     };

//     if (!isLoaded) return <p>Loading Maps...</p>;

//     return (
//         <div>
//             <h2>Vehicle Live Tracking</h2>

//             <button
//                 onClick={handleStartTracking}
//                 disabled={isMoving}
//                 style={{
//                     marginBottom: "10px",
//                     padding: "10px",
//                     backgroundColor: isMoving ? "gray" : "blue",
//                     color: "white",
//                     border: "none",
//                     cursor: isMoving ? "not-allowed" : "pointer",
//                 }}
//             >
//                 {isMoving ? "Tracking in Progress..." : "Start Tracking"}
//             </button>

//             <GoogleMap
//                 mapContainerStyle={mapContainerStyle}
//                 zoom={14}
//                 center={vehiclePosition}
//             >
//                 {/* Markers for all locations */}
//                 {hyderabadLocations.map((location, index) => (
//                     <Marker
//                         key={index}
//                         position={location}
//                         icon={{
//                             url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
//                             scaledSize: new window.google.maps.Size(20, 20),
//                         }}
//                     />
//                 ))}

//                 {/* Moving Vehicle Marker */}
//                 <Marker
//                     position={vehiclePosition}
//                     icon={{
//                         url: isDeviation
//                             ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
//                             : "https://maps.google.com/mapfiles/kml/shapes/cabs.png",
//                         scaledSize: new window.google.maps.Size(30, 30),
//                     }}
//                 />

//                 {/* Draw all routes including the first one initially */}
//                 {hyderabadLocations.map((location, index) => {
//                     if (index < hyderabadLocations.length - 1) {
//                         const isCurrentSegment = index === currentLocationIndex;
//                         const isSegmentCompleted = completedRoutes[index];

//                         return (
//                             <Polyline
//                                 key={index}
//                                 path={[
//                                     hyderabadLocations[index],
//                                     index === 0 && !isMoving
//                                         ? hyderabadLocations[index + 1]
//                                         : isCurrentSegment
//                                         ? vehiclePosition
//                                         : hyderabadLocations[index + 1]
//                                 ]}
//                                 options={{
//                                     strokeColor: isSegmentCompleted || isCurrentSegment ? "#FF0000" : "#0000FF",
//                                     strokeOpacity: 0.8,
//                                     strokeWeight: 4,
//                                 }}
//                             />
//                         );
//                     }
//                     return null;
//                 })}
//             </GoogleMap>
//         </div>
//     );
// };

// export default LiveTracking;
