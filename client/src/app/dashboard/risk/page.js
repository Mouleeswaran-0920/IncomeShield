"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Wind, CloudRain, Car, Zap, Info } from 'lucide-react';
import { useRealTime } from '@/context/RealTimeContext';
import { cn } from '@/lib/utils';

export default function RiskMonitor() {
  const { envData, riskData } = useRealTime();

  const indicators = [
    { label: 'Precipitation', value: `${envData.rain}%`, icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Air Quality', value: envData.aqi, icon: Wind, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Traffic Density', value: `${envData.traffic}%`, icon: Car, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Strike Probability', value: `${envData.strike || 0}%`, icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Live Risk Monitor</h1>
          <p className="text-slate-400">Real-time environmental and system metrics.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Feed Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {indicators.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-dark p-6 rounded-3xl border border-white/5"
          >
            <div className={cn("inline-flex p-3 rounded-2xl mb-4", item.bg, item.color)}>
              <item.icon size={24} />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.label}</h3>
            <p className="text-3xl font-black mt-1">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-dark p-8 rounded-3xl border border-white/5">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Activity size={20} className="text-primary" />
            Risk Factor Contribution
          </h3>
          <div className="space-y-6">
            <RiskBar label="Weather Severity" value={envData.rain} color="bg-blue-500" />
            <RiskBar label="AQI Disruption" value={envData.aqi / 3} color="bg-emerald-500" />
            <RiskBar label="Traffic Delay" value={envData.traffic} color="bg-amber-500" />
            <RiskBar label="System Health" value={10} color="bg-purple-500" />
          </div>
        </div>

        <div className="glass-dark p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info size={20} className="text-primary" />
              AI Risk Explanation
            </h3>
            <p className="text-slate-400 italic">
              "Based on current satellite data and historical patterns, we've detected a {riskData.score > 0.6 ? 'high' : 'low'} probability of income disruption. 
              The main driver is {envData.rain > 50 ? 'approaching precipitation' : 'stable environmental conditions'}."
            </p>
          </div>
          <div className="mt-8 p-6 rounded-2xl bg-primary/10 border border-primary/20">
            <p className="text-[10px] font-bold text-primary uppercase mb-2">Confidence Score</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '92%' }} />
              </div>
              <span className="text-sm font-black text-primary">92%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskBar({ label, value, color }) {
  const percentage = Math.min(100, value);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="font-bold">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
           initial={{ width: 0 }}
           animate={{ width: `${percentage}%` }}
           className={cn("h-full rounded-full shadow-sm", color)}
        />
      </div>
    </div>
  );
}
