"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, Info, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell
} from 'recharts';
import { formatCurrency, cn } from '@/lib/utils';
import axios from 'axios';

export default function IncomeAnalytics() {
  const [scoreData, setScoreData] = useState({
    score: 85,
    breakdown: {
      earnings_consistency: 90,
      working_hours: 75,
      zone_risk: 15,
      disruption_frequency: 10
    }
  });

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const res = await axios.get(`${API_URL}/api/user/income-protection-score?user_id=${user.id}`);
          setScoreData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch income score', err);
      }
    };
    fetchScore();
  }, []);

  const historyData = [
    { day: 'Mon', income: 1100, expected: 1200 },
    { day: 'Tue', income: 1250, expected: 1200 },
    { day: 'Wed', income: 450, expected: 1200 },
    { day: 'Thu', income: 900, expected: 1200 },
    { day: 'Fri', income: 1150, expected: 1200 },
    { day: 'Sat', income: 1400, expected: 1300 },
    { day: 'Sun', income: 1050, expected: 1200 },
  ];

  const breakdownData = [
    { name: 'Consistency', value: scoreData.breakdown.earnings_consistency, color: '#3b82f6' },
    { name: 'Active Hours', value: scoreData.breakdown.working_hours, color: '#8b5cf6' },
    { name: 'Stability', value: 100 - scoreData.breakdown.disruption_frequency, color: '#10b981' },
    { name: 'Zone Quality', value: 100 - scoreData.breakdown.zone_risk, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Income Analytics & Forecasting</h1>
          <p className="text-slate-400">Deep dive into your earnings pattern and protection coverage.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all">
              Monthly Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Income Protection Score Card */}
        <div className="glass-dark p-8 rounded-3xl border border-white/5 flex flex-col items-center">
           <div className="w-full flex items-center justify-between mb-8">
             <h3 className="text-lg font-bold">Protection Score</h3>
             <Info size={16} className="text-slate-500" />
           </div>
           
           <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80" cy="80" r="70"
                  stroke="currentColor" strokeWidth="12"
                  fill="transparent"
                  className="text-white/5"
                />
                <motion.circle
                  cx="80" cy="80" r="70"
                  stroke="currentColor" strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={440}
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * scoreData.score) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-primary"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-5xl font-black">{scoreData.score}</span>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Excellent</span>
              </div>
           </div>
           
           <div className="w-full mt-10 space-y-4">
              {breakdownData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-medium text-slate-400">{item.name}</span>
                   </div>
                   <span className="text-sm font-bold">{item.value}%</span>
                </div>
              ))}
           </div>
        </div>

        {/* Main Forecasting Chart */}
        <div className="lg:col-span-2 glass-dark p-8 rounded-3xl border border-white/5">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-lg font-bold flex items-center gap-2">
               <TrendingUp size={20} className="text-primary" />
               Weekly Performance Analysis
             </h3>
             <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-primary" /> Target</div>
                <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-purple-500" /> Realized</div>
             </div>
           </div>
           
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="expected" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="income" stroke="#8b5cf6" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="glass-dark p-8 rounded-3xl border border-white/5">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
               <BarChart3 size={20} className="text-primary" />
               Daily Earnings Distribution
            </h3>
            <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                    <Bar dataKey="income" radius={[4, 4, 0, 0]}>
                      {historyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.income < entry.expected ? '#ef4444' : '#10b981'} opacity={0.8} />
                      ))}
                    </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="glass-dark p-8 rounded-3xl border border-white/5 flex flex-col">
            <h3 className="text-lg font-bold mb-6">Income Loss Vectors</h3>
            <div className="flex-1 space-y-8 flex flex-col justify-center">
               <VectorItem label="Environmental Disruption (Rain/AQI)" percentage={65} color="bg-blue-500" />
               <VectorItem label="Market Volatility (Low Demand)" percentage={20} color="bg-amber-500" />
               <VectorItem label="System downtime/strikes" percentage={15} color="bg-purple-500" />
            </div>
            <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
               <Activity className="text-primary" size={20} />
               <p className="text-xs text-slate-400">Our AI identifies weather disruptions as your primary income risk factor.</p>
            </div>
         </div>
      </div>
    </div>
  );
}

function VectorItem({ label, percentage, color }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-slate-400">{label}</span>
        <span className="text-sm font-black">{percentage}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}
