"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Info, Zap, CloudRain, Wind, Car, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useRealTime } from '@/context/RealTimeContext';
import { cn } from '@/lib/utils';

export default function AIInsights() {
  const { envData } = useRealTime();
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExplanation = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await axios.post(`${API_URL}/api/ai/explain-risk`, {
          rain: envData.rain,
          aqi: envData.aqi,
          traffic: envData.traffic,
          strike: envData.strike || 0
        });
        setExplanation(res.data);
      } catch (err) {
        console.error('Failed to fetch AI explanation', err);
      } finally {
        setLoading(false);
      }
    };
    if (envData) fetchExplanation();
  }, [envData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black">Explainable AI Insights</h1>
        <p className="text-slate-400">Deep-learning based analysis of your protection metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Explanation Card */}
        <div className="glass-dark p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
           <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
           
           <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center glow-primary">
                    <BrainCircuit className="text-white" size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold">Risk Reasoning</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Neural Engine v2.4</p>
                 </div>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-4">
                   <div className="h-4 bg-white/5 rounded w-3/4" />
                   <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                   <p className="text-lg text-slate-200 leading-relaxed italic">
                     "{explanation?.explanation || "Calculating optimal protection parameters based on regional metrics..."}"
                   </p>
                   
                   <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                         <ShieldCheck size={20} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-400">Verdict</p>
                         <p className="text-sm font-black whitespace-nowrap">Protection Active - Monitoring Cont.</p>
                      </div>
                   </div>
                </motion.div>
              )}
           </div>
        </div>

        {/* Factors Breakdown */}
        <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5">
           <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
              <Zap size={20} className="text-amber-500" />
              Weightage Distribution
           </h3>
           
           <div className="space-y-8">
              {explanation?.factors ? Object.entries(explanation.factors).map(([key, val]) => (
                <div key={key} className="space-y-2">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         {key === 'rain' && <CloudRain size={16} className="text-blue-400" />}
                         {key === 'aqi' && <Wind size={16} className="text-emerald-400" />}
                         {key === 'traffic' && <Car size={16} className="text-amber-400" />}
                         {key === 'strike' && <ShieldAlert size={16} className="text-purple-400" />}
                         <span className="text-sm font-bold capitalize text-slate-400">{key}</span>
                      </div>
                      <span className="text-sm font-black">{Math.round(val * 100)}% Influence</span>
                   </div>
                   <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${val * 200}%` }}
                        className={cn(
                          "h-full rounded-full",
                          key === 'rain' ? "bg-blue-400" : 
                          key === 'aqi' ? "bg-emerald-400" : 
                          key === 'traffic' ? "bg-amber-400" : "bg-purple-400"
                        )}
                      />
                   </div>
                </div>
              )) : (
                <div className="py-12 text-center text-slate-500">No factor data available.</div>
              )}
           </div>
        </div>
      </div>

      <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5">
         <div className="flex items-center gap-3 mb-8">
            <Info className="text-primary" size={24} />
            <h3 className="text-xl font-bold">Methodology</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
               <h4 className="text-sm font-black text-slate-200">Regression Analysis</h4>
               <p className="text-xs text-slate-500 leading-relaxed">
                 We compare your historical earnings with current market trends and environmental penalties to forecast expected income with 95% confidence intervals.
               </p>
            </div>
            <div className="space-y-4">
               <h4 className="text-sm font-black text-slate-200">Parametric Triggers</h4>
               <p className="text-xs text-slate-500 leading-relaxed">
                 Unlike traditional insurance, we don't wait for a manual claim. If our AI detects a threshold breach in AQI or Rain, the payout is triggered automatically.
               </p>
            </div>
            <div className="space-y-4">
               <h4 className="text-sm font-black text-slate-200">Ethical Scoring</h4>
               <p className="text-xs text-slate-500 leading-relaxed">
                 Our neural network is trained on diverse gig-worker datasets to ensure fair protection scoring across different vehicle types and delivery zones.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}

function ShieldAlert({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}
