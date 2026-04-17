"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  ShieldCheck, 
  CreditCard, 
  Activity, 
  AlertTriangle,
  ArrowUpRight,
  History,
  Info
} from 'lucide-react';
import { useRealTime } from '@/context/RealTimeContext';
import { useToast } from '@/context/ToastContext';
import RiskGauge from '@/components/RiskGauge';
import IncomeChart from '@/components/IncomeChart';
import { formatCurrency, cn } from '@/lib/utils';
import { CardSkeleton, TableSkeleton } from '@/components/Skeleton';

export default function Dashboard() {
  const { envData, riskData, alerts, lastPayout } = useRealTime();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPayouts: 12450,
    activeClaims: 3,
    protectionScore: 88,
    dailyLoss: 450
  });

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => {
    if (alerts.length > 0 && alerts[0].severity === 'CRITICAL') {
        addToast(alerts[0].message, 'error');
    }
  }, [alerts, addToast]);

  useEffect(() => {
    if (lastPayout) {
        addToast(`Payout of ${formatCurrency(lastPayout.amount)} processed!`, 'success');
    }
  }, [lastPayout, addToast]);

  // Mock chart data
  const chartData = [
    { name: '08:00', predicted: 120, actual: 110 },
    { name: '10:00', predicted: 180, actual: 165 },
    { name: '12:00', predicted: 220, actual: 40 }, // Drop
    { name: '14:00', predicted: 200, actual: 180 },
    { name: '16:00', predicted: 250, actual: 230 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner for Alerts */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 animate-pulse">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">Disruption Active</h3>
                <p className="text-sm text-slate-400">{alerts[0].message}</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors">
                View Details
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard 
              title="Total Payouts" 
              value={formatCurrency(stats.totalPayouts)} 
              icon={CreditCard} 
              trend="+₹1,200"
              color="blue"
            />
            <StatCard 
              title="Active Claims" 
              value={stats.activeClaims} 
              icon={History} 
              trend="Processing"
              color="purple"
            />
            <StatCard 
              title="Daily Loss" 
              value={formatCurrency(stats.dailyLoss)} 
              icon={TrendingUp} 
              trend="-₹150 today"
              color="amber"
              isNegative
            />
            <StatCard 
              title="Protection Score" 
              value={`${stats.protectionScore}%`} 
              icon={ShieldCheck} 
              trend="Strong"
              color="emerald"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Analysis & Gauge */}
        <div className="lg:col-span-1 glass-dark rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center space-y-6">
          <div className="w-full flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Activity size={20} className="text-primary" />
              Real-time Risk
            </h3>
            <Info size={16} className="text-slate-500 cursor-help" />
          </div>
          
          {loading ? (
            <div className="py-8"><Skeleton className="h-32 w-32 rounded-full" /></div>
          ) : (
            <RiskGauge score={riskData.score || envData.riskScore || 0.24} label="Environmental Risk" />
          )}
          
          <div className="w-full grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">AQI Status</p>
              <p className={cn("text-lg font-black", (envData.aqi > 200 ? "text-red-500" : "text-emerald-500"))}>
                {envData.aqi || 42}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Precipitation</p>
              <p className={cn("text-lg font-black", (envData.rain > 50 ? "text-red-500" : "text-blue-500"))}>
                {envData.rain || 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Income Chart */}
        <div className="lg:col-span-2 glass-dark rounded-3xl p-8 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Income Forecast vs Actual
            </h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-slate-400">Predicted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-xs text-slate-400">Actual</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <IncomeChart data={chartData} />
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-dark rounded-3xl p-8 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Recent Payouts</h3>
          <button className="text-sm font-bold text-primary hover:underline">View All History</button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <TableSkeleton rows={3} />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Description</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <ActivityRow 
                  desc="Rain Disruption Coverage" 
                  date="Apr 15, 2026" 
                  status="Paid" 
                  amount="₹850.00" 
                  statusColor="text-emerald-500" 
                />
                <ActivityRow 
                  desc="AQI Health Bonus" 
                  date="Apr 12, 2026" 
                  status="Paid" 
                  amount="₹300.00" 
                  statusColor="text-emerald-500" 
                />
                <ActivityRow 
                  desc="Service Continuity" 
                  date="Apr 10, 2026" 
                  status="Processing" 
                  amount="₹1,200.00" 
                  statusColor="text-amber-500" 
                />
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color, isNegative }) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-dark p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group"
    >
      <div className={cn("inline-flex p-3 rounded-2xl mb-4 transition-colors", colors[color])}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
        <p className="text-2xl font-black mt-1">{value}</p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={cn(
          "text-xs font-bold px-2 py-0.5 rounded-lg",
          isNegative ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
        )}>
          {trend}
        </span>
      </div>
      
      {/* Decorative background glow */}
      <div className={cn(
        "absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity",
        colors[color].split(' ')[1]
      )} />
    </motion.div>
  );
}

function ActivityRow({ desc, date, status, amount, statusColor }) {
  return (
    <tr className="group hover:bg-white/5 transition-colors">
      <td className="py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <ArrowUpRight size={16} className="text-slate-400" />
          </div>
          <p className="text-sm font-bold">{desc}</p>
        </div>
      </td>
      <td className="py-4 text-sm text-slate-400">{date}</td>
      <td className="py-4">
        <span className={cn("text-xs font-bold", statusColor)}>{status}</span>
      </td>
      <td className="py-4 text-sm font-black text-right">{amount}</td>
    </tr>
  );
}
