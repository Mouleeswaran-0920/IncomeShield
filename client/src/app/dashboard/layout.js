"use client";
import React from 'react';
import { RealTimeProvider } from '@/context/RealTimeContext';

export default function Layout({ children }) {
    return (
        <RealTimeProvider>
            {children}
        </RealTimeProvider>
    );
}
