
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

// const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

// type MarkerType = {
//     id: number;
//     name: string;
//     position: { lat: number; lng: number };
// };

// type Product = {
//     pack_ID: string;
//     product_ID: string;
//     quantity: number;
// };

// type LoadArrangement = {
//     location: string;
//     products: Product[];
//     stop: number;
// };

// type Route = {
//     distance: string;
//     duration: string;
//     start: {
//         address: string;
//         latitude: number;
//         longitude: number;
//     };
//     end: {
//         address: string;
//         latitude: number;
//         longitude: number;
//     };
//     loadAfterStop: number;
// };

// type VehicleData = {
//     vehicle_ID: string;
//     cost: number;
//     totalVolumeCapacity: number;
//     totalWeightCapacity: number;
//     leftoverVolume: number;
//     leftoverWeight: number;
//     loadArrangement: LoadArrangement[];
//     route: Route[];
// };

// interface RootOptimizationProps {
//     rootOptimization: VehicleData[];
// }

// const routeColors = ['#FF0000', '#0000FF', '#0096FF'];

// const RootOptimization: React.FC<RootOptimizationProps> = ({ rootOptimization }) => {
//     console.log('rootOptimization screen', rootOptimization)
//     const { isLoaded } = useLoadScript({ googleMapsApiKey: mapsKey });
//     const [activeMarker, setActiveMarker] = useState<number | null>(null);
//     const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
//     const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | null>(null);

//     const getAllRouteMarkers = (vehicles: VehicleData[]): MarkerType[] => {
//         return vehicles.flatMap((vehicle, truckIndex) =>
//             vehicle.route.flatMap((r, routeIndex) => [
//                 {
//                     id: truckIndex * 100 + routeIndex * 2 + 1, // Unique ID for each marker
//                     name: `Truck ${vehicle.vehicle_ID} Start`,
//                     position: { lat: r.start.latitude, lng: r.start.longitude },
//                 },
//                 {
//                     id: truckIndex * 100 + routeIndex * 2 + 2,
//                     name: `Truck ${vehicle.vehicle_ID} End`,
//                     position: { lat: r.end.latitude, lng: r.end.longitude },
//                 },
//             ])
//         );
//     };

//     // Get markers
//     const dynamicMarkers: MarkerType[] = getAllRouteMarkers(rootOptimization);

//     // Log markers
//     console.log('dynamicMarkers', dynamicMarkers);

//     const handleActiveMarker = (markerId: number) => {
//         setActiveMarker((prev) => (prev === markerId ? null : markerId));
//     };

//     useEffect(() => {
//         if (!isLoaded || typeof google === 'undefined' || !google.maps) return;

//         const directionsService = new google.maps.DirectionsService();

//         directionsService.route(
//             {
//                 origin: dynamicMarkers[0].position,
//                 destination: dynamicMarkers[1].position,
//                 travelMode: google.maps.TravelMode.DRIVING,
//                 provideRouteAlternatives: true
//             },
//             (response, status) => {
//                 if (status === google.maps.DirectionsStatus.OK && response) {
//                     console.log('Routes:', response.routes);
//                     setRoutes(response.routes);
//                     setDirectionsResult(response);
//                 } else {
//                     console.error('Directions request failed:', status);
//                 }
//             }
//         );
//     }, [isLoaded]);

//     if (!isLoaded) return <p>Loading Maps...</p>;

//     return (
//         <div style={{ width: '100%' }}>
//             <GoogleMap
//                 onClick={() => setActiveMarker(null)}
//                 mapContainerStyle={{ width: '100%', height: '30rem' }}
//                 center={dynamicMarkers[0].position}
//                 zoom={5}
//             >
//                 {dynamicMarkers.map(({ id, name, position }) => (
//                     <Marker key={id} position={position} onClick={() => handleActiveMarker(id)}>
//                         {activeMarker === id && (
//                             <InfoWindow onCloseClick={() => setActiveMarker(null)}>
//                                 <div>{name}</div>
//                             </InfoWindow>
//                         )}
//                     </Marker>
//                 ))}
//                 {directionsResult && directionsResult.routes.map((route, index) => (
//                     <DirectionsRenderer
//                         key={index}
//                         directions={{
//                             ...directionsResult,
//                             routes: [route],
//                         }}
//                         options={{
//                             polylineOptions: {
//                                 strokeColor: routeColors[index % routeColors.length],
//                                 strokeWeight: 5,
//                             },
//                         }}
//                     />
//                 ))}
//             </GoogleMap>
//         </div>
//     );
// };

// export default RootOptimization;
// ################################################################################################################

'use client';

import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

type MarkerType = {
    id: number;
    name: string;
    position: { lat: number; lng: number };
};

type Route = {
    distance: string;
    duration: string;
    start: {
        address: string;
        latitude: number;
        longitude: number;
    };
    end: {
        address: string;
        latitude: number;
        longitude: number;
    };
};

type VehicleData = {
    vehicle_ID: string;
    route: Route[];
};

interface RootOptimizationProps {
    rootOptimization: VehicleData[];
}

const routeColors = ['#FF0000', '#0000FF', '#0096FF', '#00FF00', '#FF00FF', '#FFA500'];

const RootOptimization: React.FC<RootOptimizationProps> = ({ rootOptimization }) => {
    const { isLoaded } = useLoadScript({ googleMapsApiKey: mapsKey });
    const [activeMarker, setActiveMarker] = useState<number | null>(null);
    const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([]);

    const getUniqueMarkers = (vehicles: VehicleData[]): { startMarkers: MarkerType[], endMarkers: MarkerType[] } => {
        const startSet = new Map();
        const endSet = new Map();

        vehicles.forEach((vehicle, truckIndex) => {
            vehicle.route.forEach((r, routeIndex) => {
                const startKey = `${r.start.latitude},${r.start.longitude}`;
                const endKey = `${r.end.latitude},${r.end.longitude}`;

                if (!startSet.has(startKey)) {
                    startSet.set(startKey, {
                        id: truckIndex * 100 + routeIndex * 2 + 1,
                        name: `Start Location`,
                        position: { lat: r.start.latitude, lng: r.start.longitude },
                    });
                }

                if (!endSet.has(endKey)) {
                    endSet.set(endKey, {
                        id: truckIndex * 100 + routeIndex * 2 + 2,
                        name: `End Location`,
                        position: { lat: r.end.latitude, lng: r.end.longitude },
                    });
                }
            });
        });

        return {
            startMarkers: Array.from(startSet.values()),
            endMarkers: Array.from(endSet.values()),
        };
    };

    const { startMarkers, endMarkers } = getUniqueMarkers(rootOptimization);
    console.log('startMarkers', startMarkers);
    console.log('endMarkers', endMarkers);
    useEffect(() => {
        if (!isLoaded || typeof google === 'undefined' || !google.maps) return;
        const directionsService = new google.maps.DirectionsService();
        const newDirectionsResults: google.maps.DirectionsResult[] = [];

        const fetchDirections = async () => {
            for (const start of startMarkers) {
                for (const end of endMarkers) {
                    const response = await new Promise<google.maps.DirectionsResult | null>((resolve) => {
                        directionsService.route(
                            {
                                origin: start.position,
                                destination: end.position,
                                travelMode: google.maps.TravelMode.DRIVING,
                                provideRouteAlternatives: true
                            },
                            (result, status) => {
                                if (status === google.maps.DirectionsStatus.OK && result) {
                                    console.log('result:', result)
                                    resolve(result);
                                } else {
                                    resolve(null);
                                }
                            }
                        );
                    });
                    if (response) newDirectionsResults.push(response);
                }
            }
            setDirectionsResults(newDirectionsResults);
        };

        fetchDirections();
    }, [isLoaded]);

    if (!isLoaded) return <p>Loading Maps...</p>;

    return (
        <div style={{ width: '100%' }}>
            <GoogleMap
                onClick={() => setActiveMarker(null)}
                mapContainerStyle={{ width: '100%', height: '30rem' }}
                center={startMarkers[0]?.position || { lat: 0, lng: 0 }}
                zoom={5}
            >
                {startMarkers.map(({ id, name, position }) => (
                    <Marker key={id} position={position} onClick={() => setActiveMarker(id)}>
                        {activeMarker === id && (
                            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                <div>{name}</div>
                            </InfoWindow>
                        )}
                    </Marker>
                ))}

                {endMarkers.map(({ id, name, position }) => (
                    <Marker key={id} position={position} onClick={() => setActiveMarker(id)}>
                        {activeMarker === id && (
                            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                <div>{name}</div>
                            </InfoWindow>
                        )}
                    </Marker>
                ))}

                {directionsResults.map((result, index) =>
                    result.routes.map((route, routeIndex) => (
                        <DirectionsRenderer
                            key={`${index}-${routeIndex}`}
                            directions={{ ...result, routes: [route] }}
                            options={{
                                polylineOptions: {
                                    strokeColor: routeColors[(index + routeIndex) % routeColors.length],
                                    strokeWeight: 5,
                                },
                                suppressMarkers: false,
                            }}
                        />
                    ))
                )}

            </GoogleMap>
        </div>
    );
};

export default RootOptimization;
