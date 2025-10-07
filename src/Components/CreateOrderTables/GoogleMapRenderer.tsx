// // // import React, { useState } from 'react';
// // // import { GoogleMap, Marker, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';

// // // interface GoogleMapRendererProps {
// // //     selectedVehicleData: any;
// // //     directionsResults: google.maps.DirectionsResult[];
// // //     showReturnRoute: boolean;
// // //     returnRoute: google.maps.DirectionsResult | null;
// // // }

// // // const COLORS = ['#1A73E8', '#F08C24', '#34A853', '#FBBC05', '#EA4335'];

// // // // Helper to create a numbered marker with optional pin
// // // const createNumberedMarker = (color: string, number: number, showPin: boolean = true) => {
// // //     const svg = `
// // //     <svg width="40" height="69" xmlns="http://www.w3.org/2000/svg">
// // //       ${showPin
// // //             ? `<path d="M20 0 C12 0 4 8 4 16 C4 28 20 50 20 50 C20 50 36 28 36 16 C36 8 28 0 20 0 Z" fill="${color}" stroke="black" stroke-width="2"/>`
// // //             : ''
// // //         }
// // //       <circle cx="20" cy="14" r="12" fill="white" stroke="black" stroke-width="2"/>
// // //       <text x="20" y="18" font-size="19" font-weight="bold" text-anchor="middle" fill="black">${number}</text>
// // //     </svg>
// // //   `;
// // //     return {
// // //         url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
// // //         scaledSize: new window.google.maps.Size(30, 50),
// // //         anchor: new window.google.maps.Point(17, showPin ? 38 : 14), // anchor differently if no pin
// // //     };
// // // };

// // // const GoogleMapRenderer: React.FC<GoogleMapRendererProps> = ({
// // //     selectedVehicleData,
// // //     directionsResults,
// // //     showReturnRoute,
// // //     returnRoute,
// // // }) => {
// // //     const defaultCenter = {
// // //         lat: selectedVehicleData?.route?.[0]?.start?.latitude || 16.5,
// // //         lng: selectedVehicleData?.route?.[0]?.start?.longitude || 80.6,
// // //     };

// // //     const [activeMarker, setActiveMarker] = useState<number | null>(null);
// // //     const handleMarkerClick = (index: number) => setActiveMarker(index);
// // //     const handleInfoWindowClose = () => setActiveMarker(null);

// // //     return (
// // //         <GoogleMap mapContainerStyle={{ width: '100%', height: '600px' }} zoom={6} center={defaultCenter}>
// // //             {/* Start & End markers */}
// // //             <Marker
// // //                 position={{
// // //                     lat: selectedVehicleData.route[0].start.latitude,
// // //                     lng: selectedVehicleData.route[0].start.longitude,
// // //                 }}
// // //                 label={{
// // //                     text: 'S',
// // //                     color: '#000',
// // //                     fontWeight: 'bold',
// // //                     fontSize: '14px',
// // //                 }}
// // //             />
// // //             <Marker
// // //                 position={{
// // //                     lat: selectedVehicleData.route[selectedVehicleData.route.length - 1].end.latitude,
// // //                     lng: selectedVehicleData.route[selectedVehicleData.route.length - 1].end.longitude,
// // //                 }}
// // //                 label={{
// // //                     text: 'E',
// // //                     color: '#000',
// // //                     fontWeight: 'bold',
// // //                     fontSize: '14px',
// // //                 }}
// // //             />

// // //             {/* Stop Markers */}
// // //             {/* {selectedVehicleData.loadArrangement.map((stop: any, index: number) => {
// // //                 const leg = directionsResults[index]?.routes[0]?.legs[0];
// // //                 if (!leg) return null;

// // //                 const color = COLORS[index % COLORS.length];
// // //                 const position = { lat: leg.end_location.lat(), lng: leg.end_location.lng() };

// // //                 return (
// // //                     <React.Fragment key={index}>
// // //                         <Marker
// // //                             position={position}
// // //                             icon={createNumberedMarker(color, index + 1)}
// // //                             onClick={() => handleMarkerClick(index)}
// // //                         />
// // //                         {activeMarker === index && (
// // //                             <InfoWindow position={position} onCloseClick={handleInfoWindowClose}>
// // //                                 <div>
// // //                                     <strong>{stop.location}</strong>
// // //                                     <p>Package IDs: {stop.packages.join(', ')}</p>
// // //                                 </div>
// // //                             </InfoWindow>
// // //                         )}
// // //                         {directionsResults[index] && (
// // //                             <DirectionsRenderer
// // //                                 directions={directionsResults[index]}
// // //                                 options={{
// // //                                     polylineOptions: { strokeColor: color, strokeWeight: 5 },
// // //                                     suppressMarkers: true,
// // //                                 }}
// // //                             />
// // //                         )}
// // //                     </React.Fragment>
// // //                 );
// // //             })} */}


// // //             {selectedVehicleData.loadArrangement.map((stop: any, index: number) => {
// // //                 const leg = directionsResults[index]?.routes[0]?.legs[0];
// // //                 if (!leg) return null;

// // //                 const color = COLORS[index % COLORS.length];
// // //                 const position = { lat: leg.end_location.lat(), lng: leg.end_location.lng() };
// // //                 const isLastStop = index === selectedVehicleData.loadArrangement.length - 1;

// // //                 return (
// // //                     <React.Fragment key={index}>
// // //                         <Marker
// // //                             position={position}
// // //                             icon={createNumberedMarker(color, index + 1, !isLastStop)} // last stop: no pin
// // //                             onClick={() => handleMarkerClick(index)}
// // //                         />
// // //                         {activeMarker === index && (
// // //                             <InfoWindow position={position} onCloseClick={handleInfoWindowClose}>
// // //                                 <div>
// // //                                     <strong>{stop.location}</strong>
// // //                                     <p>Package IDs: {stop.packages.join(', ')}</p>
// // //                                 </div>
// // //                             </InfoWindow>
// // //                         )}
// // //                         {directionsResults[index] && (
// // //                             <DirectionsRenderer
// // //                                 directions={directionsResults[index]}
// // //                                 options={{
// // //                                     polylineOptions: { strokeColor: color, strokeWeight: 5 },
// // //                                     suppressMarkers: true,
// // //                                 }}
// // //                             />
// // //                         )}
// // //                     </React.Fragment>
// // //                 );
// // //             })}

// // //             {/* Return Route */}
// // //             {showReturnRoute && returnRoute && (
// // //                 <DirectionsRenderer
// // //                     directions={returnRoute}
// // //                     options={{ polylineOptions: { strokeColor: 'purple', strokeWeight: 5 }, suppressMarkers: true }}
// // //                 />
// // //             )}
// // //         </GoogleMap>
// // //     );
// // // };

// // // export default GoogleMapRenderer;



import React, { useEffect, useRef, useState } from 'react';
import {
    GoogleMap,
    Marker,
    InfoWindow,
    useJsApiLoader,
    DirectionsRenderer,
} from '@react-google-maps/api';

interface GoogleMapRendererProps {
    selectedVehicleData: any;
}

const COLORS = ['#1A73E8', '#F08C24', '#34A853', '#FBBC05', '#EA4335'];

const createNumberedMarker = (color: string, number: number, showPin: boolean = true) => {
    const svg = `
    <svg width="40" height="69" xmlns="http://www.w3.org/2000/svg">
      ${showPin
            ? `<path d="M20 0 C12 0 4 8 4 16 C4 28 20 50 20 50 C20 50 36 28 36 16 C36 8 28 0 20 0 Z" fill="${color}" stroke="black" stroke-width="2"/>`
            : ''
        }
      <circle cx="20" cy="14" r="12" fill="white" stroke="black" stroke-width="2"/>
      <text x="20" y="18" font-size="19" font-weight="bold" text-anchor="middle" fill="black">${number}</text>
    </svg>
  `;
    return {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
        scaledSize: new window.google.maps.Size(30, 50),
        anchor: new window.google.maps.Point(17, showPin ? 38 : 14),
    };
};

const mapContainerStyle = { width: '100%', height: '600px' };

const formatDurationSeconds = (totalSeconds: number | undefined | null): string => {
    if (totalSeconds == null || Number.isNaN(totalSeconds)) return '—';
    let secs = Math.max(0, Math.floor(totalSeconds));
    const days = Math.floor(secs / 86400);
    secs -= days * 86400;
    const hours = Math.floor(secs / 3600);
    secs -= hours * 3600;
    const minutes = Math.round(secs / 60);
    const parts: string[] = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hr`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes} min`);
    return parts.join(' ');
};

const formatDistance = (meters: number | undefined | null): string => {
    if (meters == null || Number.isNaN(meters)) return '—';
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${meters} m`;
};

const GoogleMapRenderer: React.FC<GoogleMapRendererProps> = ({ selectedVehicleData }) => {
    const defaultCenter = {
        lat: selectedVehicleData?.route?.[0]?.start?.latitude || 16.5,
        lng: selectedVehicleData?.route?.[0]?.start?.longitude || 80.6,
    };

    const { isLoaded } = useJsApiLoader({ googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '' });

    const mapRef = useRef<google.maps.Map | null>(null);
    const polylinesRef = useRef<google.maps.Polyline[]>([]);
    const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([]);
    const [returnRoute, setReturnRoute] = useState<google.maps.DirectionsResult | null>(null);
    const [activeMarker, setActiveMarker] = useState<number | null>(null);
    const [showTraffic, setShowTraffic] = useState(false);
    const [avoidTolls, setAvoidTolls] = useState(false);
    const [avoidHighways, setAvoidHighways] = useState(false);
    const [showReturnRoute, setShowReturnRoute] = useState(false);
    const [summaryByLeg, setSummaryByLeg] = useState<
        { distanceValue: number; durationValue: number; durationTrafficValue?: number }[]
    >([]);
    const [totals, setTotals] = useState<{ distanceText: string; durationText: string } | null>(null);

    const handleMarkerClick = (index: number) => setActiveMarker(index);
    const handleInfoWindowClose = () => setActiveMarker(null);

    const clearPolylines = () => {
        polylinesRef.current.forEach((p) => p.setMap(null));
        polylinesRef.current = [];
    };

    // draw a directions result as a polyline with traffic-aware coloring
    const drawResultAsPolyline = (res: google.maps.DirectionsResult, idxOffset = 0) => {
        if (!mapRef.current) return;
        const route = res.routes[0];
        if (!route) return;

        // build full path
        const path: google.maps.LatLngLiteral[] = [];
        route.legs.forEach((leg) => {
            leg.steps.forEach((step) => {
                if (Array.isArray(step.path)) {
                    // step.path is LatLng[]
                    step.path.forEach((ll: google.maps.LatLng) => {
                        path.push({ lat: ll.lat(), lng: ll.lng() });
                    });
                } else if (step.path && typeof (step.path as google.maps.MVCArray<google.maps.LatLng>).forEach === 'function') {
                    // step.path is MVCArray<LatLng>
                    (step.path as google.maps.MVCArray<google.maps.LatLng>).forEach((ll: google.maps.LatLng) => {
                        path.push({ lat: ll.lat(), lng: ll.lng() });
                    });
                }
            });
        });

        const leg = route.legs[0];
        const duration = leg?.duration?.value ?? 0;
        const durationTraffic = leg?.duration_in_traffic?.value ?? leg?.duration?.value ?? 0;
        const congested = duration > 0 ? durationTraffic / duration > 1.15 : false;
        const strokeColor = congested && showTraffic ? '#FF0000' : COLORS[idxOffset % COLORS.length];

        const polyline = new window.google.maps.Polyline({
            path: path.length ? path : route.overview_path.map((p) => ({ lat: p.lat(), lng: p.lng() })),
            strokeColor,
            strokeOpacity: 0.95,
            strokeWeight: 6,
            map: mapRef.current,
        });

        polylinesRef.current.push(polyline);
    };

    const drawPolylinesForRoutes = (results: google.maps.DirectionsResult[], returnRes: google.maps.DirectionsResult | null) => {
        if (!mapRef.current) return;
        clearPolylines();
        results.forEach((r, i) => drawResultAsPolyline(r, i));
        if (returnRes) {
            // draw return route using next color index (or use purple)
            const idxOffset = results.length;
            // prefer purple for return route for clarity
            const route = returnRes.routes[0];
            if (!route) return;
            const path: google.maps.LatLngLiteral[] = [];
            route.legs.forEach((leg) => {
                leg.steps.forEach((step) => {
                    if (Array.isArray(step.path)) {
                        // step.path is LatLng[]
                        step.path.forEach((ll: google.maps.LatLng) => {
                            path.push({ lat: ll.lat(), lng: ll.lng() });
                        });
                    } else if (step.path && typeof (step.path as google.maps.MVCArray<google.maps.LatLng>).forEach === 'function') {
                        // step.path is MVCArray<LatLng>
                        (step.path as google.maps.MVCArray<google.maps.LatLng>).forEach((ll: google.maps.LatLng) => {
                            path.push({ lat: ll.lat(), lng: ll.lng() });
                        });
                    }
                });
            });
            const leg = route.legs[0];
            const duration = leg?.duration?.value ?? 0;
            const durationTraffic = leg?.duration_in_traffic?.value ?? leg?.duration?.value ?? 0;
            const congested = duration > 0 ? durationTraffic / duration > 1.15 : false;
            const strokeColor = congested && showTraffic ? '#FF00AA' : 'purple';
            const polyline = new window.google.maps.Polyline({
                path: path.length ? path : route.overview_path.map((p) => ({ lat: p.lat(), lng: p.lng() })),
                strokeColor,
                strokeOpacity: 0.95,
                strokeWeight: 6,
                map: mapRef.current,
            });
            polylinesRef.current.push(polyline);
        }
    };

    const calculateRoutes = async () => {
        if (!isLoaded || !window.google || !selectedVehicleData?.route?.length) return;
        const directionsService = new window.google.maps.DirectionsService();
        const newResults: google.maps.DirectionsResult[] = [];
        const summaries: { distanceValue: number; durationValue: number; durationTrafficValue?: number }[] = [];

        for (let i = 0; i < selectedVehicleData.route.length; i++) {
            const segment = selectedVehicleData.route[i];
            try {
                const result = await directionsService.route({
                    origin: { lat: segment.start.latitude, lng: segment.start.longitude },
                    destination: { lat: segment.end.latitude, lng: segment.end.longitude },
                    travelMode: window.google.maps.TravelMode.DRIVING,
                    drivingOptions: {
                        departureTime: new Date(),
                        trafficModel: window.google.maps.TrafficModel.BEST_GUESS,
                    },
                    avoidTolls,
                    avoidHighways,
                });

                newResults.push(result);
                const route = result.routes[0];
                const leg = route?.legs?.[0];
                summaries.push({
                    distanceValue: leg?.distance?.value ?? 0,
                    durationValue: leg?.duration?.value ?? 0,
                    durationTrafficValue: leg?.duration_in_traffic?.value,
                });
            } catch (err) {
                console.error('Directions request failed for segment', i, err);
                summaries.push({ distanceValue: 0, durationValue: 0 });
            }
        }

        setDirectionsResults(newResults);

        // calculate return route and optionally include in totals
        let returnRes: google.maps.DirectionsResult | null = null;
        if (showReturnRoute && selectedVehicleData.route.length > 0) {
            try {
                const lastSegment = selectedVehicleData.route[selectedVehicleData.route.length - 1];
                const r = await directionsService.route({
                    origin: { lat: lastSegment.end.latitude, lng: lastSegment.end.longitude },
                    destination: { lat: selectedVehicleData.route[0].start.latitude, lng: selectedVehicleData.route[0].start.longitude },
                    travelMode: window.google.maps.TravelMode.DRIVING,
                    drivingOptions: {
                        departureTime: new Date(),
                        trafficModel: window.google.maps.TrafficModel.BEST_GUESS,
                    },
                    avoidTolls,
                    avoidHighways,
                });
                returnRes = r;
                setReturnRoute(r);

                // add return summary to totals
                const leg = r.routes[0]?.legs?.[0];
                summaries.push({
                    distanceValue: leg?.distance?.value ?? 0,
                    durationValue: leg?.duration?.value ?? 0,
                    durationTrafficValue: leg?.duration_in_traffic?.value,
                });
            } catch (err) {
                console.error('Return route request failed', err);
                setReturnRoute(null);
            }
        } else {
            setReturnRoute(null);
        }

        setSummaryByLeg(summaries);

        // totals: use duration_in_traffic when available
        let totalDistance = 0;
        let totalDuration = 0;
        summaries.forEach((s) => {
            totalDistance += s.distanceValue;
            totalDuration += s.durationTrafficValue ?? s.durationValue;
        });

        setTotals({
            distanceText: totalDistance >= 1000 ? `${(totalDistance / 1000).toFixed(1)} km` : `${totalDistance} m`,
            durationText: formatDurationSeconds(totalDuration),
        });

        // draw polylines including return route
        setTimeout(() => drawPolylinesForRoutes(newResults, returnRes), 100);
    };

    useEffect(() => {
        if (isLoaded && selectedVehicleData?.route?.length) {
            calculateRoutes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, selectedVehicleData, avoidTolls, avoidHighways, showReturnRoute, showTraffic]);

    useEffect(() => {
        return () => clearPolylines();
    }, []);

    if (!isLoaded) return <div>Loading Google Maps...</div>;

    return (
        <div>
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <label><input type="checkbox" checked={showTraffic} onChange={() => setShowTraffic((v) => !v)} /> Show route traffic (red when congested)</label>
                <label><input type="checkbox" checked={avoidTolls} onChange={() => setAvoidTolls((v) => !v)} /> Avoid Tolls</label>
                <label><input type="checkbox" checked={avoidHighways} onChange={() => setAvoidHighways((v) => !v)} /> Avoid Highways</label>
                <label><input type="checkbox" checked={showReturnRoute} onChange={() => setShowReturnRoute((v) => !v)} /> Show Return Route</label>

                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div><strong>Total distance:</strong> {totals?.distanceText ?? '—'}</div>
                    <div><strong>Estimated travel time (current):</strong> {totals?.durationText ?? '—'}</div>
                </div>
            </div>

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={8}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
                onUnmount={() => {
                    mapRef.current = null;
                }}
            >
                {selectedVehicleData?.route?.length > 0 && (
                    <>
                        <Marker
                            position={{
                                lat: selectedVehicleData.route[0].start.latitude,
                                lng: selectedVehicleData.route[0].start.longitude,
                            }}
                            label={{ text: 'S', color: '#000', fontWeight: 'bold', fontSize: '14px' }}
                        />
                        <Marker
                            position={{
                                lat: selectedVehicleData.route[selectedVehicleData.route.length - 1].end.latitude,
                                lng: selectedVehicleData.route[selectedVehicleData.route.length - 1].end.longitude,
                            }}
                            label={{ text: 'E', color: '#000', fontWeight: 'bold', fontSize: '14px' }}
                        />
                    </>
                )}

                {selectedVehicleData?.loadArrangement?.map((stop: any, index: number) => {
                    const directionResult = directionsResults[index];
                    const leg = directionResult?.routes?.[0]?.legs?.[0];
                    if (!leg) return null;

                    const color = COLORS[index % COLORS.length];
                    const position = { lat: leg.end_location.lat(), lng: leg.end_location.lng() };
                    const isLastStop = index === selectedVehicleData.loadArrangement.length - 1;
                    const summary = summaryByLeg[index];

                    return (
                        <React.Fragment key={index}>
                            <Marker
                                position={position}
                                icon={createNumberedMarker(color, index + 1, !isLastStop)}
                                onClick={() => handleMarkerClick(index)}
                            />
                            {activeMarker === index && (
                                <InfoWindow position={position} onCloseClick={handleInfoWindowClose}>
                                    <div style={{ minWidth: 180 }}>
                                        <strong>{stop.location}</strong>
                                        <div style={{ marginTop: 6 }}>
                                            <div><strong>Package IDs:</strong> {stop.packages?.join(', ') ?? '—'}</div>
                                            <div><strong>Distance:</strong> {formatDistance(summary?.distanceValue)}</div>
                                            <div><strong>ETA (no traffic):</strong> {formatDurationSeconds(summary?.durationValue)}</div>
                                            <div><strong>ETA (current):</strong> {formatDurationSeconds(summary?.durationTrafficValue ?? summary?.durationValue)}</div>
                                            <div><strong>Toll Fee:</strong> ₹-- (not provided by Google)</div>
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}

                            <DirectionsRenderer
                                directions={directionResult}
                                options={{ suppressMarkers: true, polylineOptions: { strokeOpacity: 0 } }}
                            />
                        </React.Fragment>
                    );
                })}

                {showReturnRoute && returnRoute && (
                    <DirectionsRenderer
                        directions={returnRoute}
                        options={{ suppressMarkers: true, polylineOptions: { strokeOpacity: 0 } }}
                    />
                )}
            </GoogleMap>
        </div>
    );
};

export default GoogleMapRenderer;
