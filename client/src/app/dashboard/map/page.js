"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, ShieldAlert, Navigation, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function MapView() {
  const [activeZone, setActiveZone] = useState(null);

  const zones = [
    { id: 1, name: 'Mumbai Central', risk: 'HIGH', density: 0.8, lat: 19.07, lng: 72.87, color: 'bg-red-500' },
    { id: 2, name: 'Delhi NCR', risk: 'SEVERE', density: 0.95, lat: 28.61, lng: 77.20, color: 'bg-red-600' },
    { id: 3, name: 'Bangalore Tech Park', risk: 'LOW', density: 0.3, lat: 12.97, lng: 77.59, color: 'bg-emerald-500' },
    { id: 4, name: 'Hyderabad Financial Dist', risk: 'MEDIUM', density: 0.5, lat: 17.38, lng: 78.48, color: 'bg-amber-500' },
  ];

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Live Operations Map</h1>
          <p className="text-slate-400">Geospatial risk overlay and disruption tracking.</p>
        </div>
        <div className="flex gap-2">
           <MapActionButton icon={Layers} label="Risk Heatmap" active />
           <MapActionButton icon={Navigation} label="Driver Density" />
        </div>
      </div>

      <div className="flex-1 flex gap-8">
        {/* Map Placeholder */}
        <div className="flex-1 glass-dark rounded-[2.5rem] border border-white/5 relative overflow-hidden bg-slate-900">
           {/* Abstract Map Grid Lines */}
           <div className="absolute inset-0 opacity-10" 
                style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           {/* Zone Markers */}
           {zones.map(zone => (
             <motion.div
               key={zone.id}
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               style={{ top: `${(zone.id * 15) + 20}%`, left: `${(zone.id * 18) + 10}%` }}
               className="absolute cursor-pointer group"
               onClick={() => setActiveZone(zone)}
             >
               <div className={cn("w-4 h-4 rounded-full animate-ping absolute", zone.color)} />
               <div className={cn("w-4 h-4 rounded-full relative z-10 border-2 border-white shadow-lg", zone.color)} />
               
               <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 glass rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                  <p className="text-[10px] font-black">{zone.name}</p>
               </div>
             </motion.div>
           ))}

           {/* Map Controls */}
           <div className="absolute bottom-8 right-8 flex flex-col gap-2">
              <button className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"><ZoomIn size={20} /></button>
              <button className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"><ZoomOut size={20} /></button>
           </div>
           
           <div className="absolute bottom-8 left-8 p-4 glass rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Current Zoom</span>
                 <span className="text-sm font-black">Regional (Level 12)</span>
              </div>
           </div>
        </div>

        {/* Side Info Panel */}
        <div className="w-80 space-y-6">
           {activeZone ? (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="glass-dark p-6 rounded-3xl border border-white/5 h-full"
             >
                <div className="flex items-center gap-3 mb-6">
                   <div className={cn("p-2 rounded-lg", activeZone.color)}>
                      <MapPin size={20} className="text-white" />
                   </div>
                   <h3 className="font-black text-lg">{activeZone.name}</h3>
                </div>

                <div className="space-y-6">
                   <ZoneMetric label="Current Risk" value={activeZone.risk} color={activeZone.color.replace('bg-', 'text-')} />
                   <ZoneMetric label="Worker Density" value={`${activeZone.density * 100}%`} />
                   
                   <div className="pt-6 border-t border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-3">Environmental Overlay</p>
                      <div className="space-y-4">
                         <div className="flex justify-between text-xs font-bold">
                            <span>Rain Intensity</span>
                            <span className="text-blue-500">Normal</span>
                         </div>
                         <div className="flex justify-between text-xs font-bold">
                            <span>AQI Level</span>
                            <span className="text-emerald-500">Good</span>
                         </div>
                      </div>
                   </div>

                   <button className="w-full py-4 mt-8 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase hover:bg-white/10 transition-all">
                      Deploy Local Alert
                   </button>
                </div>
             </motion.div>
           ) : (
             <div className="glass-dark p-8 rounded-3xl border border-white/5 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                   <Navigation size={32} className="text-slate-500" />
                </div>
                <h3 className="font-bold text-slate-400">Select a zone on the map to view detailed analytics</h3>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function MapActionButton({ icon: Icon, label, active }) {
  return (
    <button className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
      active ? "bg-primary text-white glow-primary" : "glass border border-white/5 text-slate-400 hover:text-white"
    )}>
      <Icon size={18} />
      {label}
    </button>
  );
}

function ZoneMetric({ label, value, color }) {
  return (
    <div>
       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
       <p className={cn("text-xl font-black mt-1", color)}>{value}</p>
    </div>
  );
}
