"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, History, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { formatCurrency, cn } from '@/lib/utils';
import RazorpayButton from '@/components/RazorpayButton';

export default function ClaimsPayouts() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const res = await axios.get(`${API_URL}/api/admin/claims`); // Reusing admin claims for simplicity in demo
          const userClaims = res.data.filter(c => c.user_id === user.id);
          setClaims(userClaims);
        }
      } catch (err) {
        console.error('Failed to fetch claims', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const totalPayout = claims.reduce((sum, c) => sum + (c.status === 'PAID' ? c.payout : 0), 0);
  const pendingPayout = claims.reduce((sum, c) => sum + (c.status === 'PENDING' ? c.payout : 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black">Claims & Payouts</h1>
        <p className="text-slate-400">Manage your insurance claims and track automated payouts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-dark p-6 rounded-3xl border border-white/5">
           <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 w-fit mb-4">
              <ShieldCheck size={24} />
           </div>
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Protected</h3>
           <p className="text-2xl font-black mt-1">{formatCurrency(totalPayout)}</p>
        </div>
        <div className="glass-dark p-6 rounded-3xl border border-white/5">
           <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 w-fit mb-4">
              <Clock size={24} />
           </div>
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending Payout</h3>
           <p className="text-2xl font-black mt-1">{formatCurrency(pendingPayout)}</p>
        </div>
        <div className="glass-dark p-6 rounded-3xl border border-white/5 flex flex-col justify-center">
           <RazorpayButton amount={pendingPayout} />
        </div>
      </div>

      <div className="glass-dark rounded-3xl p-8 border border-white/5">
         <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <History size={20} className="text-primary" />
            Claim History
         </h3>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Reason</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase text-right">Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {claims.length > 0 ? claims.map(claim => (
                  <tr key={claim.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4">
                       <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            claim.status === 'PAID' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                          )}>
                             <ArrowUpRight size={16} />
                          </div>
                          <p className="text-sm font-bold">{claim.loss > 500 ? 'Severe Disruption' : 'Weather Protection'}</p>
                       </div>
                    </td>
                    <td className="py-4 font-black">{formatCurrency(claim.payout)}</td>
                    <td className="py-4 text-sm text-slate-400">{new Date(claim.createdAt).toLocaleDateString()}</td>
                    <td className="py-4">
                       <div className="flex items-center gap-2">
                          {claim.status === 'PAID' ? <CheckCircle size={14} className="text-emerald-500" /> : <Clock size={14} className="text-amber-500" />}
                          <span className={cn(
                            "text-xs font-bold uppercase",
                            claim.status === 'PAID' ? "text-emerald-500" : "text-amber-500"
                          )}>
                            {claim.status}
                          </span>
                       </div>
                    </td>
                    <td className="py-4 text-right font-mono text-xs text-slate-500">
                       {claim.status === 'PAID' ? `TXN_${Math.random().toString(36).substr(2, 8).toUpperCase()}` : '--'}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-500">No payout history available.</td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
