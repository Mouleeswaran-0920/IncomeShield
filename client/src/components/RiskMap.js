"use client";
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "your_mock_token";

const RiskMap = ({ center = [77.209, 28.613], riskZones = [] }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (map.current) return; // Initialize once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: center,
            zoom: 12
        });

        map.current.on('load', () => {
            // Add mock risk data layers
            map.current.addSource('risk-zones', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: riskZones.map(zone => ({
                        type: 'Feature',
                        geometry: { type: 'Point', coordinates: zone.coordinates },
                        properties: { intensity: zone.intensity }
                    }))
                }
            });

            map.current.addLayer({
                id: 'risk-heat',
                type: 'heatmap',
                source: 'risk-zones',
                paint: {
                    'heatmap-weight': ['get', 'intensity'],
                    'heatmap-intensity': 1,
                    'heatmap-color': [
                        'interpolate', ['linear'], ['heatmap-density'],
                        0, 'rgba(37, 99, 235, 0)',
                        0.2, 'rgba(37, 99, 235, 0.4)',
                        0.6, 'rgba(239, 68, 68, 0.6)',
                        1, 'rgba(239, 68, 68, 0.8)'
                    ],
                    'heatmap-radius': 50,
                    'heatmap-opacity': 0.6
                }
            });
        });
    }, [center, riskZones]);

    const isMock = !process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN === "your_mock_token";

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative bg-gray-50">
            {isMock ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
                    {/* Dark Modern Map Background Mock */}
                    <div className="absolute inset-0 opacity-[0.15] bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/77.209,28.613,11/800x400?access_token=your_mock_token')] bg-cover" />

                    {/* Scanning Beam */}
                    <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent z-10 pointer-events-none"
                    />

                    {/* Artificial Heatmap Clusters */}
                    <div className="absolute top-[20%] left-[30%] w-40 h-40 bg-red-600/30 rounded-full blur-[60px] animate-pulse" />
                    <div className="absolute top-[50%] left-[60%] w-32 h-32 bg-red-500/40 rounded-full blur-[50px] animate-pulse duration-700" />
                    <div className="absolute bottom-[20%] left-[40%] w-56 h-56 bg-blue-600/20 rounded-full blur-[80px]" />
                    <div className="absolute top-[40%] right-[20%] w-24 h-24 bg-red-400/50 rounded-full blur-[40px] animate-ping duration-[3s]" />

                    {/* Ping Indicators */}
                    <div className="absolute top-[25%] left-[32%] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]" />
                    <div className="absolute top-[52%] left-[62%] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]" />
                    <div className="absolute top-[42%] right-[22%] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]" />

                    {/* Grid Components */}
                    <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#4a90e2 1px, transparent 1px), linear-gradient(90deg, #4a90e2 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                    <div className="text-center z-20 px-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/90 backdrop-blur-md rounded-xl border border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)] mb-4">
                            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Simulation</span>
                        </div>
                        <h4 className="text-lg font-black text-white/50 uppercase tracking-[0.4em]">Risk Intelligence Layer</h4>
                    </div>
                </div>
            ) : (
                <div ref={mapContainer} className="h-full w-full" />
            )}

            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 z-10 scale-90 md:scale-100 origin-top-right">
                <h4 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Risk Intelligence</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]" />
                        <span className="text-xs font-bold text-gray-700">Extreme Threat</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.2)]" />
                        <span className="text-xs font-bold text-gray-700">Secure Operation</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskMap;
