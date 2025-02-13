// /* eslint-disable react-hooks/exhaustive-deps */
// 'use client';

// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer, OverlayView } from '@react-google-maps/api';

// const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

// export type PackageID = string;

// export type LocationDetails = {
//     address: string;
//     latitude: number;
//     longitude: number;
// };

// export type LoadArrangement = {
//     location: string;
//     packages: PackageID[];
// };

// export type Allocation = {
//     route: Route[];
//     cost: number;
//     leftoverVolume: number;
//     leftoverWeight: number;
//     loadArrangement: LoadArrangement[];
//     stop: number;
// };

// export type Route = {
//     start: LocationDetails;
//     end: LocationDetails;
//     distance: string;
//     duration: string;
//     loadAfterStop: number;
// };

// export type RootOptimizationType = {
//     id: string;
//     isAllocation: boolean;
//     label: string;
//     totalCost: number;
//     totalVolumeCapacity: number;
//     totalWeightCapacity: number;
//     unallocatedPackages: PackageID[];
//     allocations: Allocation[];
//     route: Route[];
//     vehicle_ID: string;
// };

// interface Routes {
//     start: { latitude: number; longitude: number };
//     end: { latitude: number; longitude: number };
// }

// interface RootOptimizationProps {
//     rootOptimization: RootOptimizationType[];
// }

// const routeColors = ['#FF0000', '#0000FF', '#0096FF', '#00FF00', '#FF00FF', '#FFA500'];

// const RootOptimization: React.FC<RootOptimizationProps> = ({ rootOptimization }) => {
//     console.log('rootOptimization screen', rootOptimization);
//     const { isLoaded } = useLoadScript({ googleMapsApiKey: mapsKey });
//     const [activeMarker, setActiveMarker] = useState<number | null>(null);
//     const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([]);
//     const [routeDetails, setRouteDetails] = useState<{ midpoint: google.maps.LatLngLiteral; distance: string; duration: string }[]>([]);

//     const { startMarkers, endMarkers } = useMemo(() => {
//         const startSet = new Map();
//         const endSet = new Map();

//         rootOptimization.forEach((vehicle, truckIndex) => {
//             if (!vehicle.allocations || vehicle.allocations.length === 0) return;

//             vehicle.allocations.forEach((allocation, allocationIndex) => {
//                 if (!allocation.route || allocation.route.length === 0) return;

//                 allocation.route.forEach((r: Routes, routeIndex: number) => {
//                     if (!r.start || !r.end) return;

//                     const startKey = `${r.start.latitude},${r.start.longitude}`;
//                     const endKey = `${r.end.latitude},${r.end.longitude}`;

//                     if (!startSet.has(startKey)) {
//                         startSet.set(startKey, {
//                             id: truckIndex * 1000 + allocationIndex * 100 + routeIndex * 2 + 1,
//                             name: `Start Location`,
//                             position: { lat: r.start.latitude, lng: r.start.longitude },
//                         });
//                     }

//                     if (!endSet.has(endKey)) {
//                         endSet.set(endKey, {
//                             id: truckIndex * 1000 + allocationIndex * 100 + routeIndex * 2 + 2,
//                             name: `End Location`,
//                             position: { lat: r.end.latitude, lng: r.end.longitude },
//                         });
//                     }
//                 });
//             });
//         });

//         return {
//             startMarkers: Array.from(startSet.values()),
//             endMarkers: Array.from(endSet.values()),
//         };
//     }, [rootOptimization]);

//     console.log('startMarkers', startMarkers);
//     console.log('endMarkers', endMarkers);
//     // const fetchDirections = useCallback(async () => {
//     //     if (!isLoaded || typeof google === 'undefined' || !google.maps) return;

//     //     const directionsService = new google.maps.DirectionsService();
//     //     const newDirectionsResults: google.maps.DirectionsResult[] = [];

//     //     for (const start of startMarkers) {
//     //         for (const end of endMarkers) {
//     //             try {
//     //                 const response = await new Promise<google.maps.DirectionsResult | null>((resolve) => {
//     //                     directionsService.route(
//     //                         {
//     //                             origin: start.position,
//     //                             destination: end.position,
//     //                             travelMode: google.maps.TravelMode.DRIVING,
//     //                             provideRouteAlternatives: true
//     //                         },
//     //                         (result, status) => {
//     //                             if (status === google.maps.DirectionsStatus.OK && result) {
//     //                                 resolve(result);
//     //                             } else {
//     //                                 console.warn('Directions request failed:', status);
//     //                                 resolve(null);
//     //                             }
//     //                         }
//     //                     );
//     //                 });

//     //                 if (response) newDirectionsResults.push(response);
//     //             } catch (error) {
//     //                 console.error('Error fetching directions:', error);
//     //             }
//     //         }
//     //     }
//     //     setDirectionsResults(newDirectionsResults);
//     // }, [isLoaded, startMarkers, endMarkers]);
//     const fetchDirections = useCallback(async () => {
//         if (!isLoaded || typeof google === 'undefined' || !google.maps) return;

//         const directionsService = new google.maps.DirectionsService();
//         const newDirectionsResults: google.maps.DirectionsResult[] = [];
//         const newRouteDetails: { midpoint: google.maps.LatLngLiteral; distance: string; duration: string }[] = [];

//         for (const start of startMarkers) {
//             for (const end of endMarkers) {
//                 try {
//                     const response = await new Promise<google.maps.DirectionsResult | null>((resolve) => {
//                         directionsService.route(
//                             {
//                                 origin: start.position,
//                                 destination: end.position,
//                                 travelMode: google.maps.TravelMode.DRIVING,
//                                 provideRouteAlternatives: true
//                             },
//                             (result, status) => {
//                                 if (status === google.maps.DirectionsStatus.OK && result) {
//                                     resolve(result);
//                                 } else {
//                                     console.warn('Directions request failed:', status);
//                                     resolve(null);
//                                 }
//                             }
//                         );
//                     });

//                     if (response) {
//                         const routeLeg = response.routes[0].legs[0];

//                         const midpoint = {
//                             lat: (start.position.lat + end.position.lat) / 2,
//                             lng: (start.position.lng + end.position.lng) / 2,
//                         };

//                         newDirectionsResults.push(response);
//                         newRouteDetails.push({
//                             midpoint,
//                             distance: routeLeg.distance?.text || '',
//                             duration: routeLeg.duration?.text || '',
//                         });
//                     }
//                 } catch (error) {
//                     console.error('Error fetching directions:', error);
//                 }
//             }
//         }
//         setDirectionsResults(newDirectionsResults);
//         setRouteDetails(newRouteDetails);
//     }, [isLoaded, startMarkers, endMarkers]);

//     useEffect(() => {
//         if (startMarkers.length > 0 && endMarkers.length > 0) {
//             fetchDirections();
//         }
//     }, [fetchDirections]);

//     if (!isLoaded) return <p>Loading Maps...</p>;
//     console.log('routeDetails', routeDetails);
//     return (
//         <div style={{ width: '100%' }}>
//             <GoogleMap
//                 onClick={() => setActiveMarker(null)}
//                 mapContainerStyle={{ width: '100%', height: '30rem' }}
//                 center={startMarkers[0]?.position || { lat: 0, lng: 0 }}
//                 zoom={5}
//             >
//                 {startMarkers.map(({ id, name, position }) => (
//                     <Marker key={id} position={position} onClick={() => setActiveMarker(id)}>
//                         {activeMarker === id && (
//                             <InfoWindow onCloseClick={() => setActiveMarker(null)}>
//                                 <div>{name}</div>
//                             </InfoWindow>
//                         )}
//                     </Marker>
//                 ))}

//                 {endMarkers.map(({ id, name, position }) => (
//                     <Marker key={id} position={position} onClick={() => setActiveMarker(id)}>
//                         {activeMarker === id && (
//                             <InfoWindow onCloseClick={() => setActiveMarker(null)}>
//                                 <div>{name}</div>
//                             </InfoWindow>
//                         )}
//                     </Marker>
//                 ))}

//                 {directionsResults.map((result, index) =>
//                     result.routes.map((route, routeIndex) => {
//                         const routeDetail = routeDetails[index];
//                         return (
//                             <React.Fragment key={`${index}-${routeIndex}`}>
//                                 <DirectionsRenderer
//                                     directions={{ ...result, routes: [route] }}
//                                     options={{
//                                         polylineOptions: {
//                                             strokeColor: routeColors[(index + routeIndex) % routeColors.length],
//                                             strokeWeight: 5,
//                                         },
//                                         suppressMarkers: false,
//                                     }}
//                                 />
//                                 {routeDetail?.distance && routeDetail?.duration && (
//                                     <OverlayView
//                                         position={{
//                                             lat: routeDetail.midpoint.lat,
//                                             lng: routeDetail.midpoint.lng,
//                                         }}
//                                         mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
//                                     >
//                                         <div
//                                             style={{
//                                                 position: 'absolute',
//                                                 top: '50%',
//                                                 left: '50%',
//                                                 transform: 'translate(-50%, -50%)',
//                                                 background: 'white',
//                                                 padding: '5px',
//                                                 borderRadius: '5px',
//                                                 boxShadow: '0 0 5px rgba(0,0,0,0.3)',
//                                                 zIndex: 1000,
//                                                 whiteSpace: 'nowrap',
//                                             }}
//                                         >
//                                             <strong>{routeDetail.distance}</strong> ({routeDetail.duration})
//                                         </div>
//                                     </OverlayView>
//                                 )}
//                             </React.Fragment>
//                         );
//                     })
//                 )}

//             </GoogleMap>
//         </div>
//     );
// };

// export default RootOptimization;

/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export type PackageID = string;

export type LocationDetails = {
    address: string;
    latitude: number;
    longitude: number;
};

export type LoadArrangement = {
    location: string;
    packages: PackageID[];
};

export type Allocation = {
    route: Route[];
    cost: number;
    leftoverVolume: number;
    leftoverWeight: number;
    loadArrangement: LoadArrangement[];
    stop: number;
};

export type Route = {
    start: LocationDetails;
    end: LocationDetails;
    distance: string;
    duration: string;
    loadAfterStop: number;
};

export type RootOptimizationType = {
    id: string;
    isAllocation: boolean;
    label: string;
    totalCost: number;
    totalVolumeCapacity: number;
    totalWeightCapacity: number;
    unallocatedPackages: PackageID[];
    allocations: Allocation[];
    route: Route[];
    vehicle_ID: string;
};
interface Routes {
    start: { latitude: number; longitude: number };
    end: { latitude: number; longitude: number };
}
interface RootOptimizationProps {
    rootOptimization: RootOptimizationType[];
}

const routeColors = ['#FF0000', '#0000FF', '#0096FF', '#00FF00', '#FF00FF', '#FFA500'];

const RootOptimization: React.FC<RootOptimizationProps> = ({ rootOptimization }) => {
    console.log('rootOptimization screen', rootOptimization);
    const { isLoaded } = useLoadScript({ googleMapsApiKey: mapsKey });
    const [activeMarker, setActiveMarker] = useState<number | null>(null);
    const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);

    const { startMarkers, endMarkers } = useMemo(() => {
        const startSet = new Map();
        const endSet = new Map();

        rootOptimization.forEach((vehicle, truckIndex) => {
            if (!vehicle.allocations || vehicle.allocations.length === 0) return;

            vehicle.allocations.forEach((allocation, allocationIndex) => {
                if (!allocation.route || allocation.route.length === 0) return;

                allocation.route.forEach((r: Routes, routeIndex: number) => {
                    if (!r.start || !r.end) return;

                    const startKey = `${r.start.latitude},${r.start.longitude}`;
                    const endKey = `${r.end.latitude},${r.end.longitude}`;

                    if (!startSet.has(startKey)) {
                        startSet.set(startKey, {
                            id: truckIndex * 1000 + allocationIndex * 100 + routeIndex * 2 + 1,
                            name: `Start Location`,
                            position: { lat: r.start.latitude, lng: r.start.longitude },
                        });
                    }

                    if (!endSet.has(endKey)) {
                        endSet.set(endKey, {
                            id: truckIndex * 1000 + allocationIndex * 100 + routeIndex * 2 + 2,
                            name: `End Location`,
                            position: { lat: r.end.latitude, lng: r.end.longitude },
                        });
                    }
                });
            });
        });

        return {
            startMarkers: Array.from(startSet.values()),
            endMarkers: Array.from(endSet.values()),
        };
    }, [rootOptimization]);
    console.log('selectedRouteIndex', selectedRouteIndex);
    console.log('startMarkers', startMarkers);
    console.log('endMarkers', endMarkers);
    const fetchDirections = useCallback(async () => {
        if (!isLoaded || typeof google === 'undefined' || !google.maps) return;

        const directionsService = new google.maps.DirectionsService();
        const newDirectionsResults: google.maps.DirectionsResult[] = [];

        for (const start of startMarkers) {
            for (const end of endMarkers) {
                try {
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
                                    resolve(result);
                                } else {
                                    console.warn('Directions request failed:', status);
                                    resolve(null);
                                }
                            }
                        );
                    });

                    if (response) newDirectionsResults.push(response);
                } catch (error) {
                    console.error('Error fetching directions:', error);
                }
            }
        }
        setDirectionsResults(newDirectionsResults);
    }, [isLoaded, startMarkers, endMarkers]);


    useEffect(() => {
        if (startMarkers.length > 0 && endMarkers.length > 0) {
            fetchDirections();
        }
    }, [fetchDirections]);

    if (!isLoaded) return <p>Loading Maps...</p>;

    const handleRouteSelection = (value: string) => {
        setSelectedRouteIndex(value === 'all' ? null : Number(value));
    };
    // const handleRouteSelection = (value) => {
    //     setSelectedRouteIndex(value === 'all' ? null : Number(value));
    // };
    return (
        <div style={{ width: '100%' }}>
            <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
                <InputLabel>Select Route</InputLabel>
                <Select
                    value={selectedRouteIndex !== null ? selectedRouteIndex.toString() : 'all'}
                    label="Select Route"
                    onChange={(e) => handleRouteSelection(e.target.value)}
                    style={{ backgroundColor: '#f5f5f5' }}
                >
                    <MenuItem value="all">All Routes</MenuItem>
                    {directionsResults.map((result, idx) => {
                        const route = result.routes[0];
                        const leg = route.legs[0];
                        return (
                            <MenuItem
                                key={idx}
                                value={idx}
                                style={{ color: 'blue' }}
                            >
                                Route {idx + 1}: {leg.distance?.text} ({leg.duration?.text})
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
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
                {selectedRouteIndex === null
                    ? directionsResults.map((result, index) =>
                        result.routes.map((route, routeIndex) => (
                            <React.Fragment key={`${index}-${routeIndex}`}>
                                <DirectionsRenderer
                                    directions={{ ...result, routes: [route] }}
                                    options={{
                                        polylineOptions: {
                                            strokeColor: routeColors[(index + routeIndex) % routeColors.length],
                                            strokeWeight: 5,
                                        },
                                        suppressMarkers: false,
                                    }}
                                />
                            </React.Fragment>
                        ))
                    )
                    : <DirectionsRenderer
                        directions={directionsResults[selectedRouteIndex]}
                        options={{
                            polylineOptions: {
                                strokeColor: routeColors[selectedRouteIndex % routeColors.length],
                                strokeWeight: 5,
                            }
                        }}
                    />
                }
                {/* {directionsResults.map((result, index) =>
                    result.routes.map((route, routeIndex) => {
                        return (
                            <React.Fragment key={`${index}-${routeIndex}`}>
                                <DirectionsRenderer
                                    directions={{ ...result, routes: [route] }}
                                    options={{
                                        polylineOptions: {
                                            strokeColor: routeColors[(index + routeIndex) % routeColors.length],
                                            strokeWeight: 5,
                                        },
                                        suppressMarkers: false,
                                    }}
                                />
                            </React.Fragment>
                        );
                    })
                )} */}

            </GoogleMap>
        </div>
    );
};

export default RootOptimization;