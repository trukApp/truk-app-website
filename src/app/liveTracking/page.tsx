// 'use client'
// import { useParams } from "react-router-dom";
// import { Typography, Box } from "@mui/material";
// import { useSearchParams } from 'next/navigation';

// const LiveTracking = () => {
//     const searchParams = useSearchParams();
//         const orderId = searchParams.get('vehicle_ID') || '';
//         console.log(orderId)

//     return (
//         <Box>
//             <Typography variant="h4">Live Tracking</Typography>
//             <Typography variant="h6">Tracking Vehicle ID: {orderId}</Typography>
//         </Box>
//     );
// };

// export default LiveTracking;
// ############################################ with markers moving #################################################################
// 'use client';
// import React, { useEffect, useState } from "react";
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";

// const mapContainerStyle = {
//     width: "100%",
//     height: "500px",
// };

// const center = {
//     lat: 17.48948444,
//     lng: 78.37861333,
// };

// interface Vehicle {
//     regNo: string;
//     status: string;
//     speed: number;
//     lastSeen: string;
//     latitude: string;
//     longitude: string;
//     vehicleId: string;
// }

// const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

// const LiveTracking: React.FC = () => {
//     const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//     const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
//     const [vehiclePath, setVehiclePath] = useState<{ [key: string]: { lat: number, lng: number }[] }>({});

//     const { isLoaded } = useJsApiLoader({
//         googleMapsApiKey: mapsKey,
//     });

//     useEffect(() => {
//         const fetchVehicles = async () => {
//             try {
//                 const response = await fetch(
//                     "https://api.vamosys.com/mobile/getGrpDataForTrustedClients?providerName=9640881718&fcode=VAMTO"
//                 );
//                 const data = await response.json();
//                 console.log('data', data);
//                 if (Array.isArray(data)) {
//                     const validVehicles = data.filter(vehicle =>
//                         vehicle.latitude && vehicle.longitude
//                     );
//                     setVehicles(validVehicles);

//                     validVehicles.forEach(vehicle => {
//                         const newPoint = { lat: parseFloat(vehicle.latitude), lng: parseFloat(vehicle.longitude) };

//                         setVehiclePath(prevPath => ({
//                             ...prevPath,
//                             [vehicle.vehicleId]: [...(prevPath[vehicle.vehicleId] || []), newPoint].slice(-50) // Keep last 50 points
//                         }));
//                     });
//                 }
//             } catch (error) {
//                 console.error("Error fetching vehicles:", error);
//             }
//         };

//         fetchVehicles();
//         const interval = setInterval(fetchVehicles, 5000);
//         return () => clearInterval(interval);
//     }, []);

//     const handleVehicleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const vehicleId = event.target.value;
//         const vehicle = vehicles.find(v => v.vehicleId === vehicleId);
//         setSelectedVehicle(vehicle || null);
//     };

//     if (!isLoaded) return <p>Loading Maps...</p>;

//     return (
//         <div>
//             <h2>Vehicle Live Tracking</h2>

//             <label htmlFor="vehicle-select"><strong>Select Vehicle:</strong></label>
//             <select id="vehicle-select" onChange={handleVehicleChange} value={selectedVehicle?.vehicleId || ""}>
//                 <option value="">Select a Vehicle</option>
//                 {vehicles.map((vehicle) => (
//                     <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
//                         {vehicle.vehicleId}
//                     </option>
//                 ))}
//             </select>

//             <GoogleMap
//                 mapContainerStyle={mapContainerStyle}
//                 zoom={14}
//                 center={selectedVehicle ? { lat: parseFloat(selectedVehicle.latitude), lng: parseFloat(selectedVehicle.longitude) } : center}
//             >
//                 {vehicles.map((vehicle) => (
//                     <Marker
//                         key={vehicle.vehicleId}
//                         position={{
//                             lat: parseFloat(vehicle.latitude),
//                             lng: parseFloat(vehicle.longitude),
//                         }}
//                         icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
//                     />
//                 ))}

//                 {selectedVehicle && vehiclePath[selectedVehicle.vehicleId] && (
//                     <Polyline
//                         path={vehiclePath[selectedVehicle.vehicleId]}
//                         options={{
//                             strokeColor: "#0000FF",
//                             strokeOpacity: 0.8,
//                             strokeWeight: 4,
//                         }}
//                     />
//                 )}
//             </GoogleMap>

//             {selectedVehicle && (
//                 <div>
//                     <h3>Vehicle Details</h3>
//                     <p><strong>Registration:</strong> {selectedVehicle.regNo}</p>
//                     <p><strong>Status:</strong> {selectedVehicle.status}</p>
//                     <p><strong>Speed:</strong> {selectedVehicle.speed} km/h</p>
//                     <p><strong>Last Seen:</strong> {selectedVehicle.lastSeen}</p>
//                     <p><strong>Vehicle ID:</strong> {selectedVehicle.vehicleId}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LiveTracking;

// ##############car icons ############################################################################
// 'use client';
// import React, { useEffect, useState } from "react";
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";

// const mapContainerStyle = {
//     width: "100%",
//     height: "500px",
// };

// const center = {
//     lat: 17.48948444,
//     lng: 78.37861333,
// };

// interface Vehicle {
//     regNo: string;
//     status: string;
//     speed: number;
//     lastSeen: string;
//     latitude: string;
//     longitude: string;
//     vehicleId: string;
//     vehicleType: string;
// }

// const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
// const LiveTracking: React.FC = () => {
//     const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//     const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
//     const [vehiclePath, setVehiclePath] = useState<{ [key: string]: { lat: number, lng: number }[] }>({});

//     const { isLoaded } = useJsApiLoader({
//         googleMapsApiKey: mapsKey,
//     });

//     useEffect(() => {
//         const fetchVehicles = async () => {
//             try {
//                 const response = await fetch(
//                     "https://api.vamosys.com/mobile/getGrpDataForTrustedClients?providerName=9640881718&fcode=VAMTO"
//                 );
//                 const data = await response.json();
//                 console.log('data', data);
//                 if (Array.isArray(data)) {
//                     const validVehicles = data.filter(vehicle =>
//                         vehicle.latitude && vehicle.longitude
//                     );
//                     setVehicles(validVehicles);

//                     validVehicles.forEach(vehicle => {
//                         const newPoint = { lat: parseFloat(vehicle.latitude), lng: parseFloat(vehicle.longitude) };

//                         setVehiclePath(prevPath => ({
//                             ...prevPath,
//                             [vehicle.vehicleId]: [...(prevPath[vehicle.vehicleId] || []), newPoint].slice(-50) // Keep last 50 points
//                         }));
//                     });
//                     if (selectedVehicle) {
//                         const updatedVehicle = validVehicles.find(v => v.vehicleId === selectedVehicle.vehicleId);
//                         if (updatedVehicle) {
//                             setSelectedVehicle(updatedVehicle);
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error fetching vehicles:", error);
//             }
//         };

//         fetchVehicles();
//         const interval = setInterval(fetchVehicles, 5000);
//         return () => clearInterval(interval);
//     }, []);

//     const getVehicleIcon = (vehicleType: string) => {
//         switch (vehicleType.toLowerCase()) {
//             case "car":
//                 return "https://maps.google.com/mapfiles/kml/shapes/cabs.png"; // Car icon
//             case "truck":
//                 return "https://maps.google.com/mapfiles/kml/shapes/truck.png"; // Truck icon
//             default:
//                 return "https://maps.google.com/mapfiles/ms/icons/red-dot.png"; // Default icon
//         }
//     };

//     const handleVehicleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const vehicleId = event.target.value;
//         const vehicle = vehicles.find(v => v.vehicleId === vehicleId);
//         setSelectedVehicle(vehicle || null);
//     };

//     if (!isLoaded) return <p>Loading Maps...</p>;

//     return (
//         <div>
//             <h2>Vehicle Live Tracking</h2>

//             <label htmlFor="vehicle-select"><strong>Select Vehicle:</strong></label>
//             <select id="vehicle-select" onChange={handleVehicleChange} value={selectedVehicle?.vehicleId || ""}>
//                 <option value="">Select a Vehicle</option>
//                 {vehicles.map((vehicle) => (
//                     <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
//                         {vehicle.vehicleId}
//                     </option>
//                 ))}
//             </select>

//             <GoogleMap
//                 mapContainerStyle={mapContainerStyle}
//                 zoom={14}
//                 center={selectedVehicle ? { lat: parseFloat(selectedVehicle.latitude), lng: parseFloat(selectedVehicle.longitude) } : center}
//             >
//                 {vehicles.map((vehicle) => (
//                     <Marker
//                         key={vehicle.vehicleId}
//                         position={{
//                             lat: parseFloat(vehicle.latitude),
//                             lng: parseFloat(vehicle.longitude),
//                         }}
//                         icon={{ url: getVehicleIcon(vehicle.vehicleType),
//                             scaledSize: new window.google.maps.Size(20, 20),
//                          }}
//                     />
//                 ))}

//                 {selectedVehicle && vehiclePath[selectedVehicle.vehicleId] && (
//                     <Polyline
//                         path={vehiclePath[selectedVehicle.vehicleId]}
//                         options={{
//                             strokeColor: "#0000FF",
//                             strokeOpacity: 0.8,
//                             strokeWeight: 4,
//                         }}
//                     />
//                 )}
//             </GoogleMap>

//             {selectedVehicle && (
//                 <div>
//                     <h3>Vehicle Details</h3>
//                     <p><strong>Registration:</strong> {selectedVehicle.regNo}</p>
//                     <p><strong>Status:</strong> {selectedVehicle.status}</p>
//                     <p><strong>Speed:</strong> {selectedVehicle.speed} km/h</p>
//                     <p><strong>Last Seen:</strong> {selectedVehicle.lastSeen}</p>
//                     <p><strong>Vehicle ID:</strong> {selectedVehicle.vehicleId}</p>
//                 </div>
//             )}
//         </div>
//     );
// };
// export default LiveTracking;

// ###################################################### static values ##############################################################
'use client';
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
    width: "100%",
    height: "500px",
};

const center = {
    lat: 17.3850,
    lng: 78.4867,
};

const hyderabadLocations = [
    { lat: 17.3850, lng: 78.4867 },
    { lat: 17.4484, lng: 78.3915 },
    { lat: 17.4399, lng: 78.4983 },
    { lat: 17.3606, lng: 78.4744 },
    { lat: 17.4156, lng: 78.4347 },
];

const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

const LiveTracking: React.FC = () => {
    const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(0);
    const [vehiclePosition, setVehiclePosition] = useState<{ lat: number; lng: number }>(hyderabadLocations[0]);
    const [completedRoutes, setCompletedRoutes] = useState<boolean[]>(new Array(hyderabadLocations.length - 1).fill(false));
    const [isMoving, setIsMoving] = useState<boolean>(false);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: mapsKey,
    });

    const interpolate = (start: { lat: number; lng: number }, end: { lat: number; lng: number }, fraction: number) => {
        return {
            lat: start.lat + (end.lat - start.lat) * fraction,
            lng: start.lng + (end.lng - start.lng) * fraction,
        };
    };

    useEffect(() => {
        let animationFrameId: number;

        const moveVehicle = () => {
            if (currentLocationIndex < hyderabadLocations.length - 1) {
                const start = hyderabadLocations[currentLocationIndex];
                const end = hyderabadLocations[currentLocationIndex + 1];
                const duration = 5000;
                const startTime = Date.now();

                const animate = () => {
                    const now = Date.now();
                    const elapsed = now - startTime;
                    const fraction = elapsed / duration;

                    if (fraction < 1) {
                        setVehiclePosition(interpolate(start, end, fraction));
                        animationFrameId = requestAnimationFrame(animate);
                    } else {
                        setVehiclePosition(end);
                        setCompletedRoutes(prevRoutes => {
                            const updatedRoutes = [...prevRoutes];
                            updatedRoutes[currentLocationIndex] = true;
                            return updatedRoutes;
                        });
                        setTimeout(() => {
                            setCurrentLocationIndex(prevIndex => prevIndex + 1);
                        }, 1000);
                    }
                };

                animate();
            } else {
                setIsMoving(false);
            }
        };

        if (isMoving) {
            moveVehicle();
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [currentLocationIndex, isMoving]);

    const handleStartTracking = () => {
        setCurrentLocationIndex(0);
        setVehiclePosition(hyderabadLocations[0]);
        setCompletedRoutes(new Array(hyderabadLocations.length - 1).fill(false));
        setIsMoving(true);
    };

    if (!isLoaded) return <p>Loading Maps...</p>;

    return (
        <div>
            <h2>Vehicle Live Tracking</h2>

            <button
                onClick={handleStartTracking}
                disabled={isMoving}
                style={{
                    marginBottom: "10px",
                    padding: "10px",
                    backgroundColor: isMoving ? "gray" : "blue",
                    color: "white",
                    border: "none",
                    cursor: isMoving ? "not-allowed" : "pointer",
                }}
            >
                {isMoving ? "Tracking in Progress..." : "Start Tracking"}
            </button>

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={14}
                center={vehiclePosition}
            >
                {/* Markers for all locations */}
                {hyderabadLocations.map((location, index) => (
                    <Marker
                        key={index}
                        position={location}
                        icon={{
                            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            scaledSize: new window.google.maps.Size(20, 20),
                        }}
                    />
                ))}
                
                {/* Moving Vehicle Marker */}
                <Marker
                    position={vehiclePosition}
                    icon={{
                        url: "https://maps.google.com/mapfiles/kml/shapes/cabs.png",
                        scaledSize: new window.google.maps.Size(30, 30),
                    }}
                />
                {hyderabadLocations.map((location, index) => {
                    if (index < hyderabadLocations.length - 1) {
                        const isCurrentSegment = index === currentLocationIndex;
                        const isSegmentCompleted = completedRoutes[index];

                        return (
                            <Polyline
                                key={index}
                                path={[
                                    hyderabadLocations[index],
                                    index === 0 && !isMoving
                                        ? hyderabadLocations[index + 1]
                                        : isCurrentSegment
                                        ? vehiclePosition
                                        : hyderabadLocations[index + 1]
                                ]}
                                options={{
                                    strokeColor: isSegmentCompleted || isCurrentSegment ? "#FF0000" : "#0000FF",
                                    strokeOpacity: 0.8,
                                    strokeWeight: 4,
                                }}
                            />
                        );
                    }
                    return null;
                })}
            </GoogleMap>
        </div>
    );
};

export default LiveTracking;


