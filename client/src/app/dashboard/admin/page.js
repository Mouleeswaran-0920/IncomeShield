"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'react-redux';
import { 
  Users, 
  IndianRupee, 
  ShieldAlert, 
  Activity, 
  Filter, 
  Download,
  Search,
  CheckCircle,
  Clock,
  AlertOctagon
} from 'lucide-react';
import axios from 'axios';
import { formatCurrency, cn } from '@/lib/utils';

export default function AdminPanel() {
  const [overview, setOverview] = useState({
    totalPayouts: 0,
    activeClaims: 0,
    totalUsers: 0,
    systemStatus: 'HEALTHY',
    scalingFactor: 1.0
  });
  const [claims, setClaims] = useState([]);
  const [heatmap, setHeatmap] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const [ovRes, claimsRes, heatRes] = await Promise.all([
          axios.get(`${API_URL}/api/admin/overview`),
          axios.get(`${API_URL}/api/admin/claims`),
          axios.get(`${API_URL}/api/admin/risk-heatmap`)
        ]);
        setOverview(ovRes.data);
        setClaims(claimsRes.data);
        setHeatmap(heatRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Admin Command Center</h1>
          <p className="text-slate-400">Holistic view of system performance and payouts.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm font-bold border border-white/5 hover:bg-white/5 transition-all">
            <Download size={18} />
            Export Audit Logs
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold glow-primary hover:bg-primary/90 transition-all">
            <Filter size={18} />
            System Filters
          </button>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard title="Total Payouts" value={formatCurrency(overview.totalPayouts)} icon={IndianRupee} />
        <AdminStatCard title="Active Claims" value={overview.activeClaims} icon={Clock} />
        <AdminStatCard title="Total Users" value={overview.totalUsers} icon={Users} />
        <AdminStatCard 
          title="System Status" 
          value={overview.systemStatus} 
          icon={Activity} 
          status={overview.systemStatus === 'HEALTHY' ? 'success' : 'danger'} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Heatmap (Visual Placeholder) */}
        <div className="lg:col-span-2 glass-dark p-8 rounded-3xl border border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold flex items-center gap-2">
               <ShieldAlert size={20} className="text-primary" />
               Zone Risk Heatmap
             </h3>
             <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/5">
                Live Data
             </div>
          </div>
          <div className="flex-1 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center justify-center p-8 space-y-6">
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {heatmap.map(zone => (
                  <div key={zone.zone} className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{zone.zone}</p>
                    <p className={cn("text-lg font-black", zone.intensity > 0.7 ? "text-red-500" : "text-amber-500")}>
                      {Math.round(zone.intensity * 100)}% Risk
                    </p>
                  </div>
                ))}
             </div>
             <p className="text-xs text-slate-500 italic">Map visualization currently restricted to regional analytics data points.</p>
          </div>
        </div>

        {/* System Scaling Factor */}
        <div className="glass-dark p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
           <div>
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
               <AlertOctagon size={20} className="text-amber-500" />
               Dynamic Payout Scaling
             </h3>
             <p className="text-slate-400 text-sm leading-relaxed">
               The system automatically scales payouts based on claim volume vs available reserve funds ({formatCurrency(50000)}).
             </p>
           </div>
           
           <div className="mt-8 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Current Factor</p>
                  <p className="text-4xl font-black text-primary">{overview.scalingFactor.toFixed(2)}x</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase border border-primary/20">
                  {overview.scalingFactor < 1 ? 'Throttled' : 'Full Payout'}
                </div>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-primary rounded-full" style={{ width: `${overview.scalingFactor * 100}%` }} />
              </div>
           </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="glass-dark rounded-3xl p-8 border border-white/5">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Claim Verification Queue</h3>
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                 <input 
                  type="text" 
                  placeholder="Search user ID or claim..." 
                  className="bg-white/5 border border-white/10 rounded-xl px-10 py-2 text-sm outline-none focus:border-primary/50 transition-all"
                 />
               </div>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase">User</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {claims.length > 0 ? claims.map(claim => (
                  <tr key={claim.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4 font-bold text-sm">{claim.User?.name || `User ID: ${claim.user_id}`}</td>
                    <td className="py-4 font-black">{formatCurrency(claim.payout)}</td>
                    <td className="py-4 text-sm text-slate-400">{new Date(claim.createdAt).toLocaleDateString()}</td>
                    <td className="py-4">
                       <span className={cn(
                         "px-2 py-0.5 rounded-lg text-xs font-bold uppercase",
                         claim.status === 'PAID' ? "bg-emerald-500/10 text-emerald-500" : 
                         claim.status === 'PENDING' ? "bg-amber-500/10 text-amber-500" : "bg-white/10 text-slate-400"
                       )}>
                        {claim.status}
                       </span>
                    </td>
                    <td className="py-4 text-right">
                       <button className="p-2 hover:bg-primary/20 rounded-lg text-primary transition-all">
                         <CheckCircle size={18} />
                       </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-500">No active claims found in queue.</td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

function AdminStatCard({ title, value, icon: Icon, status = 'default' }) {
  const statusColors = {
    success: "text-emerald-500",
    danger: "text-red-500",
    default: "text-primary"
  };
  
  return (
    <div className="glass-dark p-6 rounded-3xl border border-white/5">
      <div className={cn("inline-flex p-3 rounded-2xl mb-4 bg-white/5", statusColors[status])}>
        <Icon size={24} />
      </div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
      <p className="text-2xl font-black mt-1 uppercase">{value}</p>
    </div>
  );
}
