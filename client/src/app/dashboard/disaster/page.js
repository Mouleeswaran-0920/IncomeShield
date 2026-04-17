"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap, ShieldAlert, Activity, Users, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { formatCurrency, cn } from '@/lib/utils';

export default function DisasterMode() {
  const [status, setStatus] = useState({ isDisasterMode: false, scalingFactor: 1.0 });
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDisasterData = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const [statusRes, queueRes] = await Promise.all([
        axios.get(`${API_URL}/api/disaster/status`),
        axios.get(`${API_URL}/api/disaster/priority-queue`)
      ]);
      setStatus(statusRes.data);
      setQueue(queueRes.data);
    } catch (err) {
      console.error('Failed to fetch disaster data', err);
    }
  };

  useEffect(() => {
    fetchDisasterData();
    const interval = setInterval(fetchDisasterData, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerDisaster = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await axios.post(`${API_URL}/api/disaster/advanced-trigger`, {
        region: 'Mumbai Coastal',
        data: { type: 'CYCLONE_WARNING', severity: 0.9 }
      });
      fetchDisasterData();
    } catch (err) {
      console.error('Trigger failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Advanced Disaster Response</h1>
          <p className="text-slate-400">Manage regional crises and priority payout queuing.</p>
        </div>
        <button
          onClick={triggerDisaster}
          disabled={loading || status.isDisasterMode}
          className={cn(
            "px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
            status.isDisasterMode 
              ? "bg-red-500/20 text-red-500 border border-red-500/30 cursor-not-allowed" 
              : "bg-red-600 text-white glow-primary hover:bg-red-700 active:scale-95"
          )}
        >
          {status.isDisasterMode ? 'Disaster Mode Active' : 'Trigger Simulation'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-1 glass-dark p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-6">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500",
              status.isDisasterMode ? "bg-red-500 animate-pulse glow-primary" : "bg-white/5"
            )}>
               <AlertTriangle size={40} className={status.isDisasterMode ? "text-white" : "text-slate-500"} />
            </div>
            <div>
               <h3 className="text-xl font-bold">{status.isDisasterMode ? 'System Under Duress' : 'System Healthy'}</h3>
               <p className="text-sm text-slate-500 mt-2">
                 {status.isDisasterMode 
                    ? `Region: ${status.activeRegion || 'Multiple Zones'}` 
                    : 'Monitoring regional environmental telemetries.'}
               </p>
            </div>
            {status.isDisasterMode && (
              <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/5">
                 <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Scaling Factor</p>
                 <p className="text-2xl font-black text-red-500">{status.scalingFactor.toFixed(2)}x</p>
              </div>
            )}
         </div>

         <div className="lg:col-span-2 glass-dark p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
               <Zap size={20} className="text-primary" />
               Disaster Response Protocol
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <ProtocolCard 
                 title="Regional Isolation" 
                 desc="Only claims from affected post-codes are prioritized." 
                 active={status.isDisasterMode} 
               />
               <ProtocolCard 
                 title="Progressive Payouts" 
                 desc="50% instant liquidity via Razorpay API." 
                 active={status.isDisasterMode} 
               />
               <ProtocolCard 
                 title="AI Fraud Gating" 
                 desc="Strict location consistency check per claim." 
                 active={status.isDisasterMode} 
               />
               <ProtocolCard 
                 title="Liquid Reserve Scaling" 
                 desc="Dynamic scaling ensures fund sustainability." 
                 active={status.isDisasterMode} 
               />
            </div>
         </div>
      </div>

      <div className="glass-dark rounded-[2.5rem] p-8 border border-white/5">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
               <Activity size={20} className="text-primary" />
               Claim Priority Queue
            </h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-red-500" /> High Sensitivity
               </div>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Provider</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Loss Impact</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Reliability</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase text-right">Priority Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {queue.length > 0 ? queue.map((item, idx) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs">
                             {item.User?.name?.charAt(0) || 'U'}
                          </div>
                          <p className="text-sm font-bold">{item.User?.name || `Driver ID: ${item.user_id}`}</p>
                       </div>
                    </td>
                    <td className="py-4 font-black text-sm">{formatCurrency(item.loss)}</td>
                    <td className="py-4">
                       <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '85%' }} />
                       </div>
                    </td>
                    <td className="py-4 text-right">
                       <span className={cn(
                         "text-sm font-black px-3 py-1 rounded-lg",
                         item.priorityScore > 80 ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                       )}>
                        {item.priorityScore}
                       </span>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-slate-500 italic">Queue empty. Monitoring global events...</td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

function ProtocolCard({ title, desc, active }) {
  return (
    <div className={cn(
      "p-6 rounded-2xl border transition-all duration-500",
      active ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5" : "bg-white/5 border-white/5"
    )}>
       <h4 className={cn("text-sm font-black uppercase tracking-wider mb-2", active ? "text-primary" : "text-white")}>
         {title}
       </h4>
       <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
