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
import axios from 'axios';
import { useRealTime } from '@/context/RealTimeContext';
import { useToast } from '@/context/ToastContext';
import RiskGauge from '@/components/RiskGauge';
import IncomeChart from '@/components/IncomeChart';
import { formatCurrency, cn } from '@/lib/utils';
import { Skeleton, CardSkeleton, TableSkeleton } from '@/components/Skeleton';

export default function Dashboard() {
  const { city, setCity, envData, riskData, alerts, payoutStatus, loading: contextLoading } = useRealTime();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ role: 'USER', avg_daily_income: 800 });
  const [stats, setStats] = useState({
    totalPayouts: 12450,
    activeClaims: 3,
    protectionScore: 88,
    dailyLoss: 450
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'];

  useEffect(() => {
    // Simulate initial loading
    if (!contextLoading) {
      setTimeout(() => setLoading(false), 800);
    }
  }, [contextLoading]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_URL}/api/admin/overview`);
        setStats(prev => ({
          ...prev,
          totalPayouts: res.data.totalPayouts,
          activeClaims: res.data.activeClaims,
        }));
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };
    fetchDashboardStats();
  }, [payoutStatus]);

  useEffect(() => {
    if (payoutStatus?.payoutTriggered) {
        addToast(`Disruption Payout of ${formatCurrency(payoutStatus.payout.amount)} PROCESSED!`, 'success');
    }
  }, [payoutStatus, addToast]);

  const handlePayment = async () => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const { data: order } = await axios.post(`${API_URL}/api/payments/create-order`, {
            amount: 49,
            currency: 'INR',
            receipt: `sub_${user.role}_${Date.now()}`
        });

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
            amount: order.amount,
            currency: order.currency,
            name: "IncomeShield AI",
            description: "Premium Coverage Subscription",
            order_id: order.id,
            handler: async (response) => {
                const verifyRes = await axios.post(`${API_URL}/api/payments/verify`, response);
                if (verifyRes.data.success) {
                    addToast('Premium Activated Successfully!', 'success');
                } else {
                    addToast('Payment Verification Failed', 'error');
                }
            },
            prefill: {
                name: user.name,
                contact: user.phone
            },
            theme: {
                color: "#3b82f6"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (err) {
        console.error('Payment Failed', err);
        addToast('Initiating Payment Failed', 'error');
    }
  };

  const chartData = [
    { name: '08:00', predicted: 120, actual: 110 },
    { name: '10:00', predicted: 180, actual: 165 },
    { name: '12:00', predicted: 220, actual: 40 }, // Drop
    { name: '14:00', predicted: 200, actual: 180 },
    { name: '16:00', predicted: 250, actual: 230 },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header with City Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-dark p-6 rounded-[2.5rem] border border-white/5">
        <div>
          <h2 className="text-xl font-black gradient-text">Operational Intel</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time parametric monitoring</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">Current Node:</span>
          <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/10">
            {cities.slice(0, 3).map(c => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black transition-all",
                  city === c ? "bg-primary text-white glow-primary" : "text-slate-500 hover:text-white"
                )}
              >
                {c}
              </button>
            ))}
            <select 
              className="bg-transparent text-xs font-black px-2 outline-none text-slate-400"
              onChange={(e) => setCity(e.target.value)}
              value={cities.includes(city) ? city : ""}
            >
              <option value="" disabled>Others</option>
              {cities.slice(3).map(c => <option key={c} value={c} className="bg-[#020617]">{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Top Banner for Alerts */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20 animate-pulse">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-red-500 uppercase tracking-tighter">Parametric Disruption Detected</h3>
                <p className="text-sm text-slate-400 font-medium">{alerts[0].message}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase">Live Risk Index</p>
                <p className="text-lg font-black text-red-500">{(riskData.riskScore * 100).toFixed(0)}%</p>
              </div>
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

      {user.role === 'USER' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Loss Analytics Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-dark p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden"
            >
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <Activity className="text-red-500" size={24} />
                            Real-Time Loss Analytics
                        </h3>
                        <div className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20">
                            Leakage Detected
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Hourly Loss Impact</p>
                            <p className="text-4xl font-black text-white">
                                ₹{((envData.rain * 5) + ((envData.traffic || 70) * 0.2) + ((envData.aqi || 100) * 0.1)).toFixed(2)}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                                Calculated based on current environmental friction in <span className="text-primary font-bold">{city}</span>.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Traffic Friction</span>
                                <span className="text-amber-500 font-bold">₹{(envData.traffic * 0.2).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Weather Delay</span>
                                <span className="text-blue-400 font-bold">₹{(envData.rain * 5).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">AQI Penalty</span>
                                <span className="text-emerald-400 font-bold">₹{(envData.aqi * 0.1).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
            </motion.div>

            {/* Premium Upgrade Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-primary to-blue-700 p-8 rounded-[2.5rem] relative overflow-hidden group cursor-pointer"
            >
                <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <ShieldCheck className="text-white" size={20} />
                            </div>
                            <h3 className="text-xl font-black text-white">IncomeShield Premium</h3>
                        </div>
                        <p className="text-blue-100 text-sm font-medium leading-relaxed max-w-[280px]">
                            Unlock 100% loss coverage and priority automated payouts during heavy disaster modes.
                        </p>
                    </div>
                    
                    <button 
                        onClick={handlePayment}
                        className="mt-8 py-4 bg-white text-primary rounded-2xl font-black text-sm transition-transform active:scale-95 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    >
                        Upgrade for ₹49/month
                    </button>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <ArrowUpRight className="absolute top-8 right-8 text-white/40 group-hover:text-white transition-colors" size={32} />
            </motion.div>
        </div>
      )}

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
              <p className={cn("text-lg font-black", (envData.rain > 10 ? "text-red-500" : "text-blue-500"))}>
                {envData.rain || 0} <span className="text-[10px] font-bold text-slate-500">mm/h</span>
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
