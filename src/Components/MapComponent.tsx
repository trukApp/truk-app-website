import { GoogleMaps } from "./GoogleMaps";
import { GoogleMapsWrapper } from "./GoogleMapsWrapper";


export const LOCATIONS = [
    { lat: 28.4595, lng: 77.0266 },
    { lat: 28.7041, lng: 77.1025 },
];

export const MapComponent = () => (
    <GoogleMapsWrapper>
        <GoogleMaps locations={LOCATIONS} />
    </GoogleMapsWrapper>
);


// import React from 'react';
// import { GoogleMapsWrapper } from './GoogleMapsWrapper';
// import { GoogleMaps } from './GoogleMaps';

// interface Route {
//     vehicle_ID: string;
//     route: Array<{
//         start: string;
//         end: string;
//         distance: string;
//         duration: string;
//         loadAfterStop: number;
//         startLat: number;
//         startLng: number;
//         endLat: number;
//         endLng: number;
//     }>;
// }

// interface MapComponentProps {
//     routes: Route[];
// }


// export const MapComponent: React.FC<MapComponentProps> = ({ routes }) => {
//     console.log("routes: ", routes)
//     const locations = routes.map((route) => {
//         console.log("route from map function: ", route)
//         return [
//             { lat: route.route[0].startLat, lng: route.route[0].startLng },
//             { lat: route.route[route.route.length - 1].endLat, lng: route.route[route.route.length - 1].endLng }
//         ];
//     }).flat();
//     console.log("locations from map component: ", locations)
//     return (
//         <GoogleMapsWrapper>
//             <GoogleMaps locations={locations} />
//         </GoogleMapsWrapper>
//     );
// };


// // import React, { useEffect, useState } from 'react';
// // import { GoogleMapsWrapper } from './GoogleMapsWrapper';
// // import { GoogleMaps } from './GoogleMaps';

// // interface Route {
// //     vehicle_ID: string;
// //     route: Array<{
// //         start: string;
// //         end: string;
// //         distance: string;
// //         duration: string;
// //         loadAfterStop: number;
// //         startLat: number;
// //         startLng: number;
// //         endLat: number;
// //         endLng: number;
// //     }>;
// // }

// // interface MapComponentProps {
// //     routes: Route[];
// // }

// // const geocodeAddress = async (address: string) => {
// //     const geocoder = new window.google.maps.Geocoder();
// //     return new Promise<google.maps.LatLng>((resolve, reject) => {
// //         geocoder.geocode({ address }, (results, status) => {
// //             if (status === window.google.maps.GeocoderStatus.OK) {
// //                 resolve(results[0].geometry.location);
// //             } else {
// //                 reject(new Error('Geocode failed: ' + status));
// //             }
// //         });
// //     });
// // };

// // export const MapComponent: React.FC<MapComponentProps> = ({ routes }) => {
// //     const [locations, setLocations] = useState<google.maps.LatLngLiteral[]>([]);

// //     useEffect(() => {
// //         const fetchLocations = async () => {
// //             const newLocations: google.maps.LatLngLiteral[] = [];

// //             for (const route of routes) {
// //                 try {
// //                     // Geocode start and end addresses
// //                     const startLocation = await geocodeAddress(route.route[0].start);
// //                     const endLocation = await geocodeAddress(route.route[0].end);

// //                     newLocations.push({ lat: startLocation.lat(), lng: startLocation.lng() });
// //                     newLocations.push({ lat: endLocation.lat(), lng: endLocation.lng() });
// //                 } catch (error) {
// //                     console.error("Error geocoding address:", error);
// //                 }
// //             }

// //             setLocations(newLocations);
// //         };

// //         fetchLocations();
// //     }, [routes]);

// //     return (
// //         <GoogleMapsWrapper>
// //             <GoogleMaps locations={locations} />
// //         </GoogleMapsWrapper>
// //     );
// // };
