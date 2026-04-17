"use client";

import React from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useRealTime } from '@/context/RealTimeContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Notifications() {
  const { alerts } = useRealTime();

  const mockNotifications = [
    { id: 1, type: 'PAYOUT', title: 'Payout Processed', message: '₹850 has been settled to your bank account.', time: '2h ago', status: 'SUCCESS' },
    { id: 2, type: 'SYSTEM', title: 'New Protection Layer', message: 'Heat-wave coverage is now active for your region.', time: '5h ago', status: 'INFO' },
    { id: 3, type: 'ALERT', title: 'AQI Warning', message: 'High pollution levels detected. Stay safe while working.', time: '1d ago', status: 'WARNING' },
  ];

  const allNotifications = [
    ...(alerts.map((a, i) => ({
      id: `alert-${i}`,
      type: 'ALERT',
      title: 'Real-time Alert',
      message: a.message,
      time: 'Just now',
      status: a.severity === 'CRITICAL' ? 'WARNING' : 'INFO'
    }))),
    ...mockNotifications
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Notifications & Alerts</h1>
          <p className="text-slate-400">Stay updated on payouts, disruptions, and system updates.</p>
        </div>
        <button className="text-sm font-bold text-primary hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-4">
        {allNotifications.map((notif, idx) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-dark p-6 rounded-2xl border border-white/5 flex gap-4 hover:border-white/10 transition-all cursor-pointer group"
          >
            <div className={cn(
              "p-3 rounded-xl h-fit",
              notif.status === 'SUCCESS' ? "bg-emerald-500/10 text-emerald-500" :
              notif.status === 'WARNING' ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
            )}>
              {notif.status === 'SUCCESS' ? <CheckCircle size={20} /> :
               notif.status === 'WARNING' ? <AlertTriangle size={20} /> : <Info size={20} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-white group-hover:text-primary transition-colors">{notif.title}</h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{notif.time}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{notif.message}</p>
              <div className="mt-3 flex gap-2">
                 <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white/5 text-slate-500 uppercase">
                    {notif.type}
                 </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
