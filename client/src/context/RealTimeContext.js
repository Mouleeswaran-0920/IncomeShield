"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const RealTimeContext = createContext();

export const RealTimeProvider = ({ children }) => {
    const [city, setCity] = useState('Delhi');
    const [envData, setEnvData] = useState({
        rain: 0,
        temp: 0,
        aqi: 0,
        condition: 'Clear',
        source: 'LIVE'
    });
    const [riskData, setRiskData] = useState({ score: 0, timestamp: null, factors: {} });
    const [payoutStatus, setPayoutStatus] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '') + '/api';

    const fetchData = useCallback(async () => {
        try {
            // 1. Fetch Weather
            const weatherRes = await axios.get(`${API_BASE}/data/weather?city=${city}`);
            const weather = weatherRes.data;

            // 2. Fetch AQI
            const aqiRes = await axios.get(`${API_BASE}/data/aqi?city=${city}`);
            const aqi = aqiRes.data;

            // Update Env Data
            const newEnv = {
                rain: weather.rain,
                temp: weather.temp,
                aqi: aqi.index,
                condition: weather.condition,
                source: 'OPENWEATHER_LIVE'
            };
            setEnvData(newEnv);

            // 3. Fetch Risk Score
            const riskRes = await axios.post(`${API_BASE}/ai/risk-score`, {
                rain: weather.rain,
                aqi: aqi.index,
                traffic: 70 // Simulated traffic for now
            });
            setRiskData(riskRes.data);

            // 4. Check for Alerts
            if (riskRes.data.riskScore > 0.6) {
                const newAlert = {
                    id: Date.now(),
                    type: 'HIGH_RISK',
                    message: `Critical disruption risk in ${city} detected.`,
                    timestamp: new Date()
                };
                setAlerts(prev => [newAlert, ...prev].slice(0, 5));
            }

            // 5. Process Payout Simulation
            const payoutRes = await axios.post(`${API_BASE}/payments/process-payout`, {
                userId: 1, // Mock User
                environmentalData: {
                    rain: weather.rain,
                    aqi: aqi.index,
                    traffic: 70
                }
            });
            
            if (payoutRes.data.payoutTriggered) {
                setPayoutStatus(payoutRes.data);
            }

            setLoading(false);
        } catch (error) {
            console.error('RealTime Data Fetch Error:', error);
        }
    }, [city, API_BASE]);

    useEffect(() => {
        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 5000); // Step 4: 5s interval
        return () => clearInterval(interval);
    }, [fetchData]);

    return (
        <RealTimeContext.Provider value={{ 
            city, 
            setCity, 
            envData, 
            riskData, 
            alerts, 
            payoutStatus, 
            loading 
        }}>
            {children}
        </RealTimeContext.Provider>
    );
};

export const useRealTime = () => useContext(RealTimeContext);
