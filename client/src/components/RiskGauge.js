"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function RiskGauge({ score, label }) {
  const percentage = score * 100;
  const rotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  const getColor = (s) => {
    if (s > 0.7) return '#ef4444'; // red-500
    if (s > 0.4) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Background Track */}
        <div className="absolute top-0 left-0 w-48 h-48 border-[16px] border-white/5 rounded-full" />
        
        {/* Gauge Path */}
        <svg className="absolute top-0 left-0 w-48 h-48" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray="132 264"
            strokeDashoffset="0"
            transform="rotate(180 50 50)"
            className="opacity-20"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 132} 132`}
            transform="rotate(180 50 50)"
            initial={{ strokeDasharray: "0 132" }}
            animate={{ strokeDasharray: `${(percentage / 100) * 132} 132` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-1 h-20 bg-white origin-bottom -translate-x-1/2 z-10"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ 
            boxShadow: '0 0 10px rgba(255,255,255,0.5)',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px'
          }}
        />
        
        {/* Center Point */}
        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 translate-y-1/2 z-20 shadow-lg" />
      </div>
      
      <div className="mt-4 text-center">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-black block"
          style={{ color }}
        >
          {Math.round(percentage)}%
        </motion.span>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
}
