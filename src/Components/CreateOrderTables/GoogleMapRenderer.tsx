/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */


import React, { useEffect, useRef, useState } from 'react';
import {
    GoogleMap,
    Marker,
    InfoWindow,
    useJsApiLoader,
    DirectionsRenderer,
} from '@react-google-maps/api';
import axios from 'axios';

export interface GoogleMapRendererProps {
    selectedVehicleData: any;
    matchedRoute?: any;
    directionsResults?: google.maps.DirectionsResult[];
    showReturnRoute?: boolean;
    returnRoute?: google.maps.DirectionsResult | null;
    alternateRoutes?: google.maps.DirectionsResult[];
    selectedRouteIndex?: number | null;
    onRouteSummaryChange?: (summary: {
        totalDistance: string;
        totalDuration: string;
        totalDistanceActual: number;
        totalDistanceReroute: number;
        totalDurationActual: number;
        totalDurationReroute: number;
        distanceTrafficValue?: number;
        durationDiff: number;
        distanceDiff: number;
        showReoptimized: any;
        legs: {
            stop: string;
            distanceText: string;
            durationText: string;
            delayText?: string;
        }[];
    }) => void;
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

const GoogleMapRenderer: React.FC<GoogleMapRendererProps> = ({ selectedVehicleData, onRouteSummaryChange }) => {
    const defaultCenter = {
        lat: selectedVehicleData?.route?.[0]?.start?.latitude || 16.5,
        lng: selectedVehicleData?.route?.[0]?.start?.longitude || 80.6,
    };
    const [suggestedRouteSummary, setSuggestedRouteSummary] = useState<{
        totalDistance: number;
        totalDuration: number;
    } | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const polylinesRef = useRef<google.maps.Polyline[]>([]);
    const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([]);
    const [activeMarker, setActiveMarker] = useState<number | null>(null);
    const [showTraffic, setShowTraffic] = useState(false);
    const [avoidTolls, setAvoidTolls] = useState(false);
    const [avoidHighways, setAvoidHighways] = useState(false);
    const [showReturnRoute, setShowReturnRoute] = useState(false);
    const [summaryByLeg, setSummaryByLeg] = useState<
        { distanceValue: number; durationValue: number; durationTrafficValue?: number }[]
    >([]);

    // 🌤 Weather states
    const [showWeather, setShowWeather] = useState(false);
    const [weatherData, setWeatherData] = useState<any[]>([]);

    const handleMarkerClick = (index: number) => setActiveMarker(index);
    const handleInfoWindowClose = () => setActiveMarker(null);

    const clearPolylines = () => {
        polylinesRef.current.forEach((p) => p.setMap(null));
        polylinesRef.current = [];
    };

    const drawResultAsPolyline = (res: google.maps.DirectionsResult, idxOffset = 0) => {
        if (!mapRef.current) return;
        const route = res.routes[0];
        if (!route) return;

        route.legs.forEach((leg) => {
            const path: google.maps.LatLngLiteral[] = [];
            leg.steps.forEach((step) => {
                step.path.forEach((ll: google.maps.LatLng) => {
                    path.push({ lat: ll.lat(), lng: ll.lng() });
                });
            });

            const base = leg.duration?.value ?? 0;
            const traffic = leg.duration_in_traffic?.value ?? base;
            const ratio = base > 0 ? traffic / base : 1;

            let strokeColor = COLORS[idxOffset % COLORS.length];
            if (showTraffic) {
                if (ratio > 1.5) strokeColor = "#EA4335";
                else if (ratio > 1.2) strokeColor = "#FBBC05";
                else strokeColor = "#34A853";
            }

            const polyline = new window.google.maps.Polyline({
                path,
                strokeColor,
                strokeOpacity: 0.95,
                strokeWeight: 6,
                map: mapRef.current!,
            });
            polylinesRef.current.push(polyline);
        });
    };

    const calculateRoutes = async () => {
        if (!isLoaded || !window.google || !selectedVehicleData?.route?.length) return;
        const directionsService = new window.google.maps.DirectionsService();
        const newResults: google.maps.DirectionsResult[] = [];
        const summaries: {
            distanceTrafficValue: number; distanceValue: number; durationValue: number; durationTrafficValue?: number
        }[] = [];

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
                const leg = result.routes[0]?.legs?.[0];
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
        setSummaryByLeg(summaries);


        // if (onRouteSummaryChange) {
        //     const totalDistanceActual = summaries.reduce((acc, s) => acc + (s.distanceValue ?? 0), 0);
        //     const totalDistanceReroute = summaries.reduce(
        //         (acc, s) => acc + (s.distanceTrafficValue ?? s.distanceValue ?? 0),
        //         0
        //     );
        //     const totalDurationActual = summaries.reduce((acc, s) => acc + (s.durationValue ?? 0), 0);
        //     const totalDurationReroute = summaries.reduce(
        //         (acc, s) => acc + (s.durationTrafficValue ?? s.durationValue ?? 0),
        //         0
        //     );

        //     onRouteSummaryChange({
        //         totalDistanceActual: formatDistance(totalDistanceActual),
        //         totalDistanceReroute: formatDistance(totalDistanceReroute),
        //         totalDurationActual: formatDurationSeconds(totalDurationActual),
        //         totalDurationReroute: formatDurationSeconds(totalDurationReroute),
        //         distanceDiff: totalDistanceReroute - totalDistanceActual,
        //         durationDiff: totalDurationReroute - totalDurationActual,
        //         showReoptimized: avoidHighways || avoidTolls || showTraffic, // show reoptimized only if any condition is active
        //     });
        // }
        // if (onRouteSummaryChange) {
        //     const totalDistanceActual = summaries.reduce((acc, s) => acc + (s.distanceValue ?? 0), 0);
        //     const totalDistanceReroute = summaries.reduce(
        //         (acc, s) => acc + (s.distanceTrafficValue ?? s.distanceValue ?? 0),
        //         0
        //     );
        //     const totalDurationActual = summaries.reduce((acc, s) => acc + (s.durationValue ?? 0), 0);
        //     const totalDurationReroute = summaries.reduce(
        //         (acc, s) => acc + (s.durationTrafficValue ?? s.durationValue ?? 0),
        //         0
        //     );

        //     onRouteSummaryChange({
        //         // send raw values for calculation
        //         totalDistanceActual,
        //         totalDistanceReroute,
        //         totalDurationActual,
        //         totalDurationReroute,
        //         distanceDiff: totalDistanceReroute - totalDistanceActual,
        //         durationDiff: totalDurationReroute - totalDurationActual,
        //         showReoptimized: avoidHighways || avoidTolls || showTraffic,
        //     });
        // }
        if (onRouteSummaryChange && suggestedRouteSummary) {
            const totalDistanceReroute = summaries.reduce(
                (acc, s) => acc + (s.distanceValue ?? 0), // or traffic distance if you want
                0
            );
            const totalDurationReroute = summaries.reduce(
                (acc, s) => acc + (s.durationTrafficValue ?? s.durationValue ?? 0),
                0
            );

            const legs = summaries.map((s, idx) => ({
                stop: selectedVehicleData.route[idx]?.end?.location || `Stop ${idx + 1}`,
                distanceText: formatDistance(s.distanceValue),
                durationText: formatDurationSeconds(s.durationValue),
                delayText: s.durationTrafficValue
                    ? formatDurationSeconds(s.durationTrafficValue - s.durationValue)
                    : undefined,
            }));

            onRouteSummaryChange({
                totalDistanceActual: suggestedRouteSummary.totalDistance,
                totalDistanceReroute: totalDistanceReroute,
                totalDurationActual: suggestedRouteSummary.totalDuration,
                totalDurationReroute: totalDurationReroute,
                distanceDiff: totalDistanceReroute - suggestedRouteSummary.totalDistance,
                durationDiff: totalDurationReroute - suggestedRouteSummary.totalDuration,
                totalDistance: formatDistance(suggestedRouteSummary.totalDistance),
                totalDuration: formatDurationSeconds(suggestedRouteSummary.totalDuration),
                showReoptimized: avoidHighways || avoidTolls || showTraffic,
                legs,
            });
        }


        setTimeout(() => {
            clearPolylines();
            newResults.forEach((r, i) => drawResultAsPolyline(r, i));
        }, 100);


    };

    // 🌦 Fetch weather
    const fetchWeather = async (lat: number, lon: number) => {
        const apiKey = "9a970c97a2e4fb9b5a58541f3003fea3";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const res = await axios.get(url);
        return res.data;
    };

    const fetchWeatherForStops = async () => {
        if (!directionsResults.length || !showWeather) return;
        try {
            const allWeather: any[] = [];
            for (let i = 0; i < directionsResults.length; i++) {
                const leg = directionsResults[i]?.routes?.[0]?.legs?.[0];
                if (leg) {
                    const lat = leg.end_location.lat();
                    const lng = leg.end_location.lng();
                    const weather = await fetchWeather(lat, lng);
                    allWeather.push(weather);
                } else {
                    allWeather.push(null);
                }
            }
            setWeatherData(allWeather);
        } catch (err) {
            console.error('Failed to fetch weather data:', err);
        }
    };

    useEffect(() => {
        if (isLoaded && selectedVehicleData?.route?.length) {
            calculateRoutes();
        }
    }, [isLoaded, selectedVehicleData, avoidTolls, avoidHighways, showTraffic]);

    useEffect(() => {
        if (showWeather) {
            fetchWeatherForStops();
        } else {
            setWeatherData([]);
        }
    }, [showWeather, directionsResults]);

    useEffect(() => () => clearPolylines(), []);

    if (!isLoaded) return <div>Loading Google Maps...</div>;

    const getDelayColor = (seconds: number) => {
        if (seconds > 1800) return 'red';
        if (seconds > 600) return 'orange';
        if (seconds > 0) return 'green';
        return 'gray';
    };

    return (
        <>
            {/* Map Container */}
            <div style={{ position: 'relative', width: '100%', height: '600px' }}>
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={defaultCenter}
                    zoom={8}
                    onLoad={(map) => { mapRef.current = map; }}
                >
                    {/* Your existing markers and DirectionsRenderer code */}
                    {selectedVehicleData?.route?.length > 0 && (
                        <>
                            <Marker position={{
                                lat: selectedVehicleData.route[0].start.latitude,
                                lng: selectedVehicleData.route[0].start.longitude,
                            }} label={{ text: 'S', color: '#000', fontWeight: 'bold', fontSize: '14px' }} />
                            <Marker position={{
                                lat: selectedVehicleData.route[selectedVehicleData.route.length - 1].end.latitude,
                                lng: selectedVehicleData.route[selectedVehicleData.route.length - 1].end.longitude,
                            }} label={{ text: 'E', color: '#000', fontWeight: 'bold', fontSize: '14px' }} />
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
                        const weather = weatherData[index];

                        return (
                            <React.Fragment key={index}>
                                <Marker position={position} icon={createNumberedMarker(color, index + 1, !isLastStop)} onClick={() => setActiveMarker(index)} />
                                {activeMarker === index && (
                                    <InfoWindow position={position} onCloseClick={handleInfoWindowClose}>
                                        <div style={{ minWidth: 200 }}>
                                            <strong>{stop.location}</strong>
                                            <div style={{ marginTop: 6 }}>
                                                <div><strong>Packages:</strong> {stop.packages?.join(', ') ?? '—'}</div>
                                                <div><strong>Distance:</strong> {formatDistance(summary?.distanceValue)}</div>
                                                <div><strong>ETA:</strong> {formatDurationSeconds(summary?.durationValue)}</div>
                                                {showWeather && weather && (
                                                    <div style={{ marginTop: 6, borderTop: '1px solid #ccc', paddingTop: 6 }}>
                                                        <strong>Weather:</strong><br />
                                                        <img
                                                            src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
                                                            alt="icon"
                                                            width={40}
                                                            style={{ verticalAlign: 'middle' }}
                                                        />
                                                        <div>🌡️ {weather.main.temp}°C</div>
                                                        <div>💧 {weather.main.humidity}% humidity</div>
                                                        <div>💨 {weather.wind.speed} m/s wind</div>
                                                        <div>☁️ {weather.weather?.[0]?.description}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </InfoWindow>
                                )}
                                <DirectionsRenderer directions={directionResult} options={{ suppressMarkers: true, polylineOptions: { strokeOpacity: 0 } }} />
                            </React.Fragment>
                        );
                    })}

                    <div
                        style={{
                            position: 'absolute',
                            top: 80,
                            left: 10,
                            zIndex: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}
                    >
                        {[
                            { label: 'Weather', state: showWeather, setter: setShowWeather },
                            // { label: 'Traffic', state: showTraffic, setter: setShowTraffic },
                            { label: 'Avoid Tolls', state: avoidTolls, setter: setAvoidTolls },
                            { label: 'Avoid Highways', state: avoidHighways, setter: setAvoidHighways },
                            // { label: 'Return', state: showReturnRoute, setter: setShowReturnRoute },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: '#fff',
                                    padding: '8px 12px',
                                    width: 170,
                                    borderRadius: 12,
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                }}
                            >
                                <span style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>{item.label}</span>
                                <label style={{ position: 'relative', display: 'inline-block', width: 42, height: 22 }}>
                                    <input
                                        type="checkbox"
                                        checked={item.state}
                                        onChange={() => item.setter((v: boolean) => !v)}
                                        style={{
                                            opacity: 0,
                                            width: 0,
                                            height: 0,
                                        }}
                                    />
                                    <span
                                        style={{
                                            position: 'absolute',
                                            cursor: 'pointer',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: item.state ? '#4CD964' : '#ccc',
                                            transition: '0.4s',
                                            borderRadius: 22,
                                        }}
                                    ></span>
                                    <span
                                        style={{
                                            position: 'absolute',
                                            content: '""',
                                            height: 18,
                                            width: 18,
                                            left: item.state ? 22 : 2,
                                            bottom: 2,
                                            backgroundColor: 'white',
                                            borderRadius: '50%',
                                            transition: '0.4s',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                        }}
                                    ></span>
                                </label>
                            </div>
                        ))}
                    </div>

                </GoogleMap>
            </div>

            {/* 🌤 Weather + Delay Summary Table under map */}
            {showWeather && weatherData.length > 0 && (
                <div style={{
                    marginTop: 20,
                    border: '1px solid #ccc',
                    borderRadius: 8,
                    padding: 16,
                    background: '#fafafa'
                }}>
                    <h3 style={{ marginBottom: 12 }}>Weather & Traffic Summary</h3>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'left'
                    }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ddd' }}>
                                <th>Stop</th>
                                <th>Distance</th>
                                <th>ETA (No Traffic)</th>
                                <th>ETA (With Traffic)</th>
                                <th>Delay</th>
                                <th>Temp</th>
                                <th>Weather</th>
                                <th>Wind</th>
                                <th>Humidity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedVehicleData.loadArrangement.map((stop: any, index: number) => {
                                const summary = summaryByLeg[index];
                                const weather = weatherData[index];
                                if (!summary || !weather) return null;

                                const delaySeconds = (summary.durationTrafficValue ?? summary.durationValue) - summary.durationValue;
                                const color = getDelayColor(delaySeconds);

                                return (
                                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '8px 6px' }}>{stop.location}</td>
                                        <td>{formatDistance(summary.distanceValue)}</td>
                                        <td>{formatDurationSeconds(summary.durationValue)}</td>
                                        <td>{formatDurationSeconds(summary.durationTrafficValue)}</td>
                                        <td style={{ color, fontWeight: 600 }}>
                                            {delaySeconds > 0 ? `+${formatDurationSeconds(delaySeconds)}` : '—'}
                                        </td>
                                        <td>{weather.main.temp}°C</td>
                                        <td>
                                            <img
                                                src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}.png`}
                                                alt=""
                                                width={25}
                                                style={{ verticalAlign: 'middle', marginRight: 4 }}
                                            />
                                            {weather.weather?.[0]?.main}
                                        </td>
                                        <td>{weather.wind.speed} m/s</td>
                                        <td>{weather.main.humidity}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

        </>
    );
};

export default GoogleMapRenderer;
