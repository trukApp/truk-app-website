// import { GoogleMaps } from "./GoogleMaps";
// import { GoogleMapsWrapper } from "./GoogleMapsWrapper";


// export const LOCATIONS = [
//     { lat: 28.4595, lng: 77.0266 },
//     { lat: 28.7041, lng: 77.1025 },
// ];

// export const MapComponent = () => (
//     <GoogleMapsWrapper>
//         <GoogleMaps locations={LOCATIONS} />
//     </GoogleMapsWrapper>
// );


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


import React from "react";
import { GoogleMapsWrapper } from "./GoogleMapsWrapper";
import { GoogleMaps } from "./GoogleMaps";

interface Latitude {
    latitude: number;
    longitude: number;
}
interface Route {
    vehicle_ID: string;
    route: Array<{
        startLat: number;
        startLng: number;
        endLat: number;
        endLng: number;
        start: Latitude;
        end: Latitude
    }>;
}

interface MapComponentProps {
    routes: Route[];
}

export const MapComponent: React.FC<MapComponentProps> = ({ routes }) => {
    console.log("Received routes:", JSON.stringify(routes, null, 2)); // Log the full routes data

    if (!routes || routes.length === 0) {
        console.warn("No routes data provided.");
        return null; // Prevent rendering if no data
    }

    const locations = routes
        .flatMap((route) =>
            route.route?.flatMap((segment) =>
                segment.start && segment.end
                    ? [
                        { lat: segment.start.latitude, lng: segment.start.longitude },
                        { lat: segment.end.latitude, lng: segment.end.longitude },
                    ]
                    : []
            )
        )
        .filter((location) => location.lat && location.lng);

    console.log("Extracted locations:", locations); // Debug locations

    if (locations.length === 0) {
        console.warn("No valid locations found.");
        return null;
    }

    return (
        <GoogleMapsWrapper>
            <GoogleMaps locations={locations} />
        </GoogleMapsWrapper>
    );
};


