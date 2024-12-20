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