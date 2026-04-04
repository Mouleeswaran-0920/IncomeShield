"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const DEFAULT_ENV_DATA = {
    rain: 0,
    aqi: 0,
    traffic: 0,
    alert: "NONE",
    source: "INITIALIZING"
};

const RealTimeContext = createContext({ envData: DEFAULT_ENV_DATA, socket: null });

export const RealTimeProvider = ({ children }) => {
    const [envData, setEnvData] = useState(DEFAULT_ENV_DATA);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const newSocket = io(backendUrl);
        setSocket(newSocket);

        newSocket.on('environment_update', (data) => {
            setEnvData(data);
        });

        return () => newSocket.close();
    }, []);

    return (
        <RealTimeContext.Provider value={{ envData, socket }}>
            {children}
        </RealTimeContext.Provider>
    );
};

export const useRealTime = () => useContext(RealTimeContext);
