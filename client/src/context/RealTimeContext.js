"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const RealTimeContext = createContext();

export const RealTimeProvider = ({ children }) => {
    const [envData, setEnvData] = useState({
        rain: 0,
        aqi: 0,
        traffic: 0,
        alert: "NONE",
        source: "INITIALIZING"
    });
    const [riskData, setRiskData] = useState({ score: 0, timestamp: null });
    const [alerts, setAlerts] = useState([]);
    const [lastPayout, setLastPayout] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const newSocket = io(backendUrl);
        setSocket(newSocket);

        newSocket.on('environment_update', (data) => {
            setEnvData(data);
        });

        newSocket.on('risk:update', (data) => {
            setRiskData(data);
        });

        newSocket.on('disruption:alert', (alert) => {
            setAlerts(prev => [alert, ...prev].slice(0, 10));
        });

        newSocket.on('payout:processed', (payout) => {
            setLastPayout(payout);
        });

        return () => newSocket.close();
    }, []);

    return (
        <RealTimeContext.Provider value={{ envData, riskData, alerts, lastPayout, socket }}>
            {children}
        </RealTimeContext.Provider>
    );
};

export const useRealTime = () => useContext(RealTimeContext);
