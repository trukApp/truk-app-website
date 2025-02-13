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


