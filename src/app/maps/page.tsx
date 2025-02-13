// 'use client';

// import React, { useState, useEffect } from 'react';
// import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

// const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

// type MarkerType = {
//     id: number;
//     name: string;
//     position: { lat: number; lng: number };
// };

// const markers: MarkerType[] = [
//     { id: 1, name: "Hyderabad", position: { lat: 17.385044, lng: 78.486671 } },
//     { id: 2, name: "Bangalore", position: { lat: 12.971599, lng: 77.594566 } },
//     { id: 3, name: "Mumbai", position: { lat: 19.076090, lng: 72.877426 } },
//     { id: 4, name: "New Delhi", position: { lat: 28.613939, lng: 77.209023 } },
//     { id: 5, name: "Kolkata", position: { lat: 22.572645, lng: 88.363892 } }
// ];

// const GoogleMapComponent: React.FC = () => {
//     const { isLoaded } = useLoadScript({ googleMapsApiKey: mapsKey });
//     const [activeMarker, setActiveMarker] = useState<number | null>(null);
//     const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

//     const handleActiveMarker = (markerId: number) => {
//         setActiveMarker((prev) => (prev === markerId ? null : markerId));
//     };

//     useEffect(() => {
//         if (!isLoaded || typeof google === 'undefined') return;

//         const directionsService = new google.maps.DirectionsService();

//         directionsService.route(
//             {
//                 origin: markers[0].position,
//                 destination: markers[markers.length - 1].position,
//                 travelMode: google.maps.TravelMode.DRIVING,
//                 waypoints: markers.slice(1, markers.length - 1).map((marker) => ({
//                     location: marker.position,
//                     stopover: true
//                 }))
//             },
//             (response, status) => {
//                 if (status === google.maps.DirectionsStatus.OK && response) {
//                     setDirections(response);
//                 } else {
//                     console.error('Directions request failed:', status);
//                 }
//             }
//         );
//     }, [isLoaded]);

//     if (!isLoaded) return <p>Loading Maps...</p>;

//     return (
//         <GoogleMap
//             onClick={() => setActiveMarker(null)}
//             mapContainerStyle={{ width: '100%', height: '100vh' }}
//             center={markers[0].position}
//             zoom={5}
//         >
//             {markers.map(({ id, name, position }) => (
//                 <Marker key={id} position={position} onClick={() => handleActiveMarker(id)}>
//                     {activeMarker === id && (
//                         <InfoWindow onCloseClick={() => setActiveMarker(null)}>
//                             <div>{name}</div>
//                         </InfoWindow>
//                     )}
//                 </Marker>
//             ))}

//             {directions && <DirectionsRenderer directions={directions} />}
//         </GoogleMap>
//     );
// };

// export default GoogleMapComponent;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

// const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

// type MarkerType = {
//     id: number;
//     name: string;
//     position: { lat: number; lng: number };
// };

// const markers: MarkerType[] = [
//     { id: 1, name: "Hyderabad", position: { lat: 17.385044, lng: 78.486671 } },
//     { id: 2, name: "Bangalore", position: { lat: 12.971599, lng: 77.594566 } },
//     { id: 3, name: "Mumbai", position: { lat: 19.076090, lng: 72.877426 } },
//     { id: 4, name: "New Delhi", position: { lat: 28.613939, lng: 77.209023 } },
//     { id: 5, name: "Kolkata", position: { lat: 22.572645, lng: 88.363892 } }
// ];

// const routeColors = ['#FF0000', '#0000FF', '#008000', '#FFA500'];

// const GoogleMapComponent: React.FC = () => {
//     const { isLoaded } = useLoadScript({ googleMapsApiKey: mapsKey });
//     const [activeMarker, setActiveMarker] = useState<number | null>(null);
//     const [routes, setRoutes] = useState<{ result: google.maps.DirectionsResult; color: string }[]>([]);

//     const handleActiveMarker = (markerId: number) => {
//         setActiveMarker((prev) => (prev === markerId ? null : markerId));
//     };

//     useEffect(() => {
//         if (!isLoaded || typeof google === 'undefined' || !google.maps) return;

//         const directionsService = new google.maps.DirectionsService();
//         const newRoutes: { result: google.maps.DirectionsResult; color: string }[] = [];

//         const routePairs = [
//             { from: 1, to: 2 }, // Hyderabad → Bangalore
//             { from: 2, to: 3 }, // Bangalore → Mumbai
//             { from: 3, to: 4 }, // Mumbai → New Delhi
//             { from: 4, to: 5 }, // New Delhi → Kolkata
//         ];

//         routePairs.forEach(({ from, to }, index) => {
//             directionsService.route(
//                 {
//                     origin: markers.find(m => m.id === from)!.position,
//                     destination: markers.find(m => m.id === to)!.position,
//                     travelMode: google.maps.TravelMode.DRIVING,
//                     provideRouteAlternatives: true
//                 },
//                 (response, status) => {
//                     if (status === google.maps.DirectionsStatus.OK && response) {
//                         newRoutes.push({ result: response, color: routeColors[index % routeColors.length] });
//                         if (newRoutes.length === routePairs.length) setRoutes(newRoutes);
//                     } else {
//                         console.error(`Directions request failed for ${from} → ${to}:`, status);
//                     }
//                 }
//             );
//         });

//     }, [isLoaded]);

//     if (!isLoaded) return <p>Loading Maps...</p>;

//     return (
//         <GoogleMap
//             onClick={() => setActiveMarker(null)}
//             mapContainerStyle={{ width: '100%', height: '100vh' }}
//             center={markers[0].position}
//             zoom={5}
//         >
//             {/* Markers */}
//             {markers.map(({ id, name, position }) => (
//                 <Marker key={id} position={position} onClick={() => handleActiveMarker(id)}>
//                     {activeMarker === id && (
//                         <InfoWindow onCloseClick={() => setActiveMarker(null)}>
//                             <div>{name}</div>
//                         </InfoWindow>
//                     )}
//                 </Marker>
//             ))}

//             {/* Routes */}
//             {routes.map(({ result, color }, index) =>
//                 result.routes.map((route, routeIndex) => (
//                     <DirectionsRenderer
//                         key={`${index}-${routeIndex}`}
//                         directions={{ ...result, routes: [route] }}
//                         options={{
//                             polylineOptions: {
//                                 strokeColor: color,
//                                 strokeWeight: 5,
//                             },
//                         }}
//                     />
//                 ))
//             )}
//         </GoogleMap>
//     );
// };

// export default GoogleMapComponent;

'use client';

import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

type MarkerType = {
    id: number;
    name: string;
    position: { lat: number; lng: number };
};

const markers: MarkerType[] = [
    { id: 1, name: "Hyderabad", position: { lat: 17.385044, lng: 78.486671 } },
    { id: 2, name: "Bangalore", position: { lat: 12.971599, lng: 77.594566 } },
    { id: 3, name: "Mumbai", position: { lat: 19.076090, lng: 72.877426 } },
    { id: 4, name: "New Delhi", position: { lat: 28.613939, lng: 77.209023 } },
    { id: 5, name: "Kolkata", position: { lat: 22.572645, lng: 88.363892 } },
    { id: 6, name: "Visakhapatnam ", position: { lat: 17.686816, lng: 83.218482 } },
    { id: 7, name: "Narasannapeta", position: { lat: 18.414801, lng: 84.044737 } },
    { id: 8, name: "Bhubaneswar", position: { lat: 20.296059, lng: 85.824539 } }
];

const routeColors = ['#FF0000', '#0000FF', '#0096FF'];

const GoogleMapComponent: React.FC = () => {
    const { isLoaded } = useLoadScript({ googleMapsApiKey: mapsKey });
    const [activeMarker, setActiveMarker] = useState<number | null>(null);
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | null>(null);

    const handleActiveMarker = (markerId: number) => {
        setActiveMarker((prev) => (prev === markerId ? null : markerId));
    };

    useEffect(() => {
        if (!isLoaded || typeof google === 'undefined' || !google.maps) return;

        const directionsService = new google.maps.DirectionsService();

        directionsService.route(
            {
                origin: markers[0].position,
                destination: markers[1].position,
                travelMode: google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: true
            },
            (response, status) => {
                if (status === google.maps.DirectionsStatus.OK && response) {
                    console.log('Routes:', response.routes);
                    setRoutes(response.routes);
                    setDirectionsResult(response);
                } else {
                    console.error('Directions request failed:', status);
                }
            }
        );
    }, [isLoaded]);

    if (!isLoaded) return <p>Loading Maps...</p>;

    return (
        <div style={{ width: '100%' }}>
            <GoogleMap
                onClick={() => setActiveMarker(null)}
                mapContainerStyle={{ width: '100%', height: '30rem' }}
                center={markers[0].position}
                zoom={5}
            >
                {markers.map(({ id, name, position }) => (
                    <Marker key={id} position={position} onClick={() => handleActiveMarker(id)}>
                        {activeMarker === id && (
                            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                <div>{name}</div>
                            </InfoWindow>
                        )}
                    </Marker>
                ))}
                {directionsResult && directionsResult.routes.map((route, index) => (
                    <DirectionsRenderer
                        key={index}
                        directions={{
                            ...directionsResult,
                            routes: [route],
                        }}
                        options={{
                            polylineOptions: {
                                strokeColor: routeColors[index % routeColors.length],
                                strokeWeight: 5,
                            },
                        }}
                    />
                ))}
            </GoogleMap>
        </div>
    );
};

export default GoogleMapComponent;

// ##################        select location and show the directions   ###################################

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

// const mapsKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

// type MarkerType = {
//     id: number;
//     name: string;
//     position: { lat: number; lng: number };
// };

// const markers: MarkerType[] = [
//     { id: 1, name: "Hyderabad", position: { lat: 17.385044, lng: 78.486671 } },
//     { id: 2, name: "Bangalore", position: { lat: 12.971599, lng: 77.594566 } },
//     { id: 3, name: "Mumbai", position: { lat: 19.076090, lng: 72.877426 } },
//     { id: 4, name: "New Delhi", position: { lat: 28.613939, lng: 77.209023 } },
//     { id: 5, name: "Kolkata", position: { lat: 22.572645, lng: 88.363892 } }
// ];

// const GoogleMapComponent: React.FC = () => {
//     const { isLoaded } = useLoadScript({ googleMapsApiKey: mapsKey });
//     const [selectedMarkers, setSelectedMarkers] = useState<MarkerType[]>([]);
//     const [routes, setRoutes] = useState<google.maps.DirectionsResult[]>([]);

//     // Handle marker selection
//     const handleMarkerClick = (marker: MarkerType) => {
//         setSelectedMarkers((prev) => {
//             if (prev.some(m => m.id === marker.id)) {
//                 return prev.filter(m => m.id !== marker.id); // Deselect marker
//             }
//             return [...prev, marker]; // Add new selection
//         });
//     };

//     // Calculate multiple routes
//     useEffect(() => {
//         if (selectedMarkers.length > 1 && isLoaded && google.maps) {
//             const directionsService = new google.maps.DirectionsService();
//             const routePromises: Promise<google.maps.DirectionsResult>[] = [];

//             selectedMarkers.forEach((start, i) => {
//                 selectedMarkers.forEach((end, j) => {
//                     if (i < j) {
//                         const routePromise = new Promise<google.maps.DirectionsResult>((resolve, reject) => {
//                             directionsService.route(
//                                 {
//                                     origin: start.position,
//                                     destination: end.position,
//                                     travelMode: google.maps.TravelMode.DRIVING,
//                                     provideRouteAlternatives: true, // Request alternate routes
//                                 },
//                                 (response, status) => {
//                                     if (status === google.maps.DirectionsStatus.OK && response) {
//                                         resolve(response);
//                                     } else {
//                                         reject(status);
//                                     }
//                                 }
//                             );
//                         });
//                         routePromises.push(routePromise);
//                     }
//                 });
//             });

//             // Wait for all routes to resolve before updating state
//             Promise.all(routePromises)
//                 .then((results) => setRoutes(results))
//                 .catch((error) => console.error('Error fetching directions:', error));
//         } else {
//             setRoutes([]); // Clear routes if less than 2 markers selected
//         }
//     }, [selectedMarkers, isLoaded]);

//     if (!isLoaded) return <p>Loading Maps...</p>;
//     console.log('routes', routes);
//     return (
//         <div style={{ width: '100%' }}>
//             <GoogleMap
//                 onClick={() => setSelectedMarkers([])}
//                 mapContainerStyle={{ width: '100%', height: '30rem' }}
//                 center={markers[0].position}
//                 zoom={5}
//             >
//                 {markers.map((marker) => (
//                     <Marker
//                         key={marker.id}
//                         position={marker.position}
//                         onClick={() => handleMarkerClick(marker)}
//                         icon={{
//                             url: selectedMarkers.some(m => m.id === marker.id)
//                                 ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // Selected marker
//                                 : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"  // Default marker
//                         }}
//                     />
//                 ))}

//                 {routes.map((routeResult, index) => (
//                     routeResult.routes.map((route, routeIndex) => (
//                         <DirectionsRenderer
//                             key={`${index}-${routeIndex}`}
//                             directions={{ ...routeResult, routes: [route] }}
//                             options={{
//                                 polylineOptions: {
//                                     strokeColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
//                                     strokeWeight: 5,
//                                 },
//                             }}
//                         />
//                     ))
//                 ))}
//             </GoogleMap>
//         </div>
//     );
// };

// export default GoogleMapComponent;

