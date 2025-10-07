import React from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

interface GoogleMapRendererProps {
    matchedRoute: any;
    selectedVehicleData: any;
    directionsResults: any[];
    returnRoute: any;
    showReturnRoute: boolean;
    selectedRouteIndex: number | null;
    alternateRoutes: any[];
}

const GoogleMapRenderer: React.FC<GoogleMapRendererProps> = ({
    matchedRoute,
    selectedVehicleData,
    directionsResults,
    returnRoute,
    showReturnRoute,
    selectedRouteIndex,
    alternateRoutes,
}) => {
    const defaultCenter = {
        lat: matchedRoute?.start?.latitude || selectedVehicleData?.route?.[0]?.start?.latitude || 16.5,
        lng: matchedRoute?.start?.longitude || selectedVehicleData?.route?.[0]?.start?.longitude || 80.6,
    };

    return (
        <GoogleMap mapContainerStyle={{ width: '100%', height: '600px' }} zoom={6} center={defaultCenter}>
            {/* Return Route */}
            {showReturnRoute && returnRoute && (
                <>
                    <Marker
                        position={{
                            lat: selectedVehicleData?.route[selectedVehicleData?.route.length - 1]?.end.latitude || 0,
                            lng: selectedVehicleData?.route[selectedVehicleData?.route.length - 1]?.end.longitude || 0,
                        }}
                        icon={{ url: '/start.svg', scaledSize: new window.google.maps.Size(40, 40) }}
                    />
                    <Marker
                        position={{
                            lat: selectedVehicleData?.route[0]?.start.latitude || 0,
                            lng: selectedVehicleData?.route[0]?.start.longitude || 0,
                        }}
                        icon={{ url: '/drop.svg', scaledSize: new window.google.maps.Size(40, 40) }}
                    />
                    <DirectionsRenderer
                        directions={returnRoute}
                        options={{ polylineOptions: { strokeColor: 'purple', strokeWeight: 5 }, suppressMarkers: true }}
                    />
                </>
            )}

            {/* Alternate Routes */}
            {alternateRoutes.length > 0 && selectedRouteIndex === null &&
                alternateRoutes.map((routeResult, index) => {
                    const firstLeg = routeResult?.routes?.[0]?.legs?.[0];
                    const isShortest = index === 0;
                    return (
                        <React.Fragment key={index}>
                            <Marker
                                position={{
                                    lat: firstLeg?.start_location?.lat() || 0,
                                    lng: firstLeg?.start_location?.lng() || 0,
                                }}
                                icon={{ url: '/start.svg', scaledSize: new window.google.maps.Size(40, 40) }}
                            />
                            <Marker
                                position={{
                                    lat: firstLeg?.end_location?.lat() || 0,
                                    lng: firstLeg?.end_location?.lng() || 0,
                                }}
                                icon={{ url: '/drop.svg', scaledSize: new window.google.maps.Size(40, 40) }}
                            />
                            <DirectionsRenderer
                                directions={routeResult}
                                options={{
                                    polylineOptions: { strokeColor: isShortest ? 'blue' : '#1A73E8', strokeWeight: isShortest ? 6 : 4 },
                                    suppressMarkers: true,
                                }}
                            />
                        </React.Fragment>
                    );
                })
            }

            {/* Selected Alternate Route */}
            {selectedRouteIndex !== null && alternateRoutes[selectedRouteIndex] && (
                <>
                    <DirectionsRenderer
                        directions={alternateRoutes[selectedRouteIndex]}
                        options={{ polylineOptions: { strokeColor: '#1A73E8', strokeWeight: 6 }, suppressMarkers: true }}
                    />
                </>
            )}

            {/* Matched Route */}
            {matchedRoute && directionsResults.length > 0 && (
                <>
                    <DirectionsRenderer
                        directions={directionsResults[0]} // ensure this matches the matched route
                        options={{ polylineOptions: { strokeColor: 'blue', strokeWeight: 5 }, suppressMarkers: true }}
                    />
                </>
            )}

            {/* Start/End Markers for selectedVehicleData if no alternate/matched */}
            {!matchedRoute && !showReturnRoute && directionsResults.length === 0 && selectedVehicleData?.route?.length > 0 && (
                <>
                    <Marker
                        position={{
                            lat: selectedVehicleData.route[0].start.latitude,
                            lng: selectedVehicleData.route[0].start.longitude,
                        }}
                        icon={{ url: '/start.svg', scaledSize: new window.google.maps.Size(40, 40) }}
                    />
                    <Marker
                        position={{
                            lat: selectedVehicleData.route[selectedVehicleData.route.length - 1].end.latitude,
                            lng: selectedVehicleData.route[selectedVehicleData.route.length - 1].end.longitude,
                        }}
                        icon={{ url: '/drop.svg', scaledSize: new window.google.maps.Size(40, 40) }}
                    />
                    {directionsResults.map((result, idx) => (
                        <DirectionsRenderer
                            key={idx}
                            directions={result}
                            options={{ polylineOptions: { strokeColor: 'blue', strokeWeight: 5 }, suppressMarkers: true }}
                        />
                    ))}
                </>
            )}
        </GoogleMap>
    );
};

export default GoogleMapRenderer;
