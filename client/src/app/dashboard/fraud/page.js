"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Fingerprint, MapPin, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

export default function FraudInsights() {
  const [fraudData, setFraudData] = useState({
    fraudScore: 0.15,
    riskLevel: 'LOW',
    details: { delivery_drop: 5.2, pattern_anomaly: 'none' }
  });

  const fetchFraudScore = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/api/ai/fraud-score`, {
         deliveries: 28,
         avg_deliveries: 30
      });
      setFraudData(res.data);
    } catch (err) {
      console.error('Failed to fetch fraud score', err);
    }
  };

  useEffect(() => {
    fetchFraudScore();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black">Fraud Detection & Insights</h1>
        <p className="text-slate-400">Advanced pattern analysis to ensure system integrity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Identity Fingerprint */}
         <div className="lg:col-span-1 glass-dark p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6 shadow-xl shadow-primary/10">
               <Fingerprint size={48} />
            </div>
            <h3 className="text-lg font-bold">Worker Fingerprint</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-black mt-1">Verified Identity</p>
            
            <div className="w-full mt-10 space-y-4">
               <VerificationItem label="Device ID Consistency" status="Verified" color="text-emerald-500" />
               <VerificationItem label="Bank Account Match" status="Verified" color="text-emerald-500" />
               <VerificationItem label="Location Pin History" status="Normal" color="text-primary" />
            </div>
         </div>

         {/* Fraud Risk Score */}
         <div className="lg:col-span-2 glass-dark p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
               <div className={cn(
                 "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest",
                 fraudData.riskLevel === 'LOW' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : 
                 fraudData.riskLevel === 'MEDIUM' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
               )}>
                 {fraudData.riskLevel} Risk Level
               </div>
            </div>

            <div className="h-full flex flex-col justify-between">
               <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-8">
                    <ShieldAlert size={20} className="text-primary" />
                    AI Trust Analysis
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                     <div>
                        <p className="text-5xl font-black">{Math.round((1 - fraudData.fraudScore) * 100)}%</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Overall Trust Integrity Score</p>
                     </div>
                     <div className="space-y-4">
                        <p className="text-sm text-slate-200 leading-relaxed italic">
                           "Our pattern analysis engine shows a {(fraudData.details.delivery_drop).toFixed(1)}% variance in your delivery patterns compared to the regional average. No significant anomalies detected."
                        </p>
                     </div>
                  </div>
               </div>

               <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <AnomalyCard 
                    label="Delivery Drop" 
                    value={`${fraudData.details.delivery_drop}%`} 
                    status={fraudData.details.delivery_drop > 50 ? 'VIOLATION' : 'NOMINAL'} 
                  />
                  <AnomalyCard 
                    label="Location Drift" 
                    value="0.4km" 
                    status="STABLE" 
                  />
                  <AnomalyCard 
                    label="Payout Frequency" 
                    value="Normal" 
                    status="VALIDATED" 
                  />
               </div>
            </div>
         </div>
      </div>

      {/* Behavioral Analysis */}
      <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5">
         <div className="flex items-center justify-between mb-8">
           <h3 className="text-lg font-bold flex items-center gap-2">
              <Activity size={20} className="text-primary" />
              Real-time Behavior Stream
           </h3>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Analysis</span>
           </div>
         </div>

         <div className="space-y-4">
            <BehaviorLog time="14:22:05" event="Location checkpoint verified at 'Mumbai Sector 4'" status="SUCCESS" />
            <BehaviorLog time="13:58:30" event="Earnings consistency check: (Predicted: 180, Actual: 165)" status="VALID" />
            <BehaviorLog time="12:15:00" event="Rain-trigger automation gating enabled" status="ACTIVE" />
            <BehaviorLog time="10:05:12" event="Device biometric handshake confirmed" status="SUCCESS" />
         </div>
      </div>
    </div>
  );
}

function VerificationItem({ label, status, color }) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-xs font-bold text-slate-500">{label}</span>
       <div className="flex items-center gap-2">
          <CheckCircle size={14} className={color} />
          <span className={cn("text-xs font-black", color)}>{status}</span>
       </div>
    </div>
  );
}

function AnomalyCard({ label, value, status }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
       <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</p>
       <div className="flex justify-between items-end">
          <p className="text-xl font-black">{value}</p>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{status}</span>
       </div>
    </div>
  );
}

function BehaviorLog({ time, event, status }) {
  return (
    <div className="flex items-center gap-6 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-default group">
       <span className="text-xs font-mono text-slate-500">{time}</span>
       <p className="text-sm font-medium flex-1 group-hover:text-white transition-colors">{event}</p>
       <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
          {status}
       </span>
    </div>
  );
}
