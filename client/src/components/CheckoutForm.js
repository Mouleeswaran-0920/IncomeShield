"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Loader2, CheckCircle2, CreditCard, ArrowLeft, Zap, Lock } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';

export default function CheckoutForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const amount = searchParams.get('amount') || '0';
    const [status, setStatus] = useState('review'); // review, processing, success

    const handlePay = () => {
        setStatus('processing');
        setTimeout(() => setStatus('success'), 3000);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[32rem] relative z-10"
            >
                <div className="glass-dark border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 relative">
                        <button 
                            onClick={() => router.back()} 
                            className="absolute left-6 top-9 p-2 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex flex-col items-center">
                            <div className="bg-primary p-2 rounded-xl text-white mb-3 glow-primary">
                                <ShieldCheck size={32} />
                            </div>
                            <h1 className="text-xl font-black">Secure Settlement</h1>
                            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-1 flex items-center gap-1">
                                <Lock size={10} /> Razorpay Verified Node
                            </p>
                        </div>
                    </div>

                    <div className="p-10">
                        {status === 'review' && (
                            <div className="space-y-10">
                                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 relative group">
                                    <div className="absolute top-4 right-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity">
                                       <Zap size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Payout Amount</p>
                                    <div className="flex flex-col">
                                        <h2 className="text-5xl font-black">{formatCurrency(amount)}</h2>
                                        <p className="text-xs text-slate-400 mt-2">Accrued environmental protection</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Receiving Method</h3>
                                    <div className="p-6 border-2 border-primary/50 bg-primary/5 rounded-3xl flex justify-between items-center group cursor-pointer hover:bg-primary/10 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg font-black italic text-xl">R</div>
                                            <div>
                                                <p className="font-black text-sm">Linked Bank Account</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">HDFC Bank •••• 4492</p>
                                            </div>
                                        </div>
                                        <div className="w-6 h-6 rounded-full border-4 border-primary bg-white shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                    </div>
                                </div>

                                <button
                                    onClick={handlePay}
                                    className="w-full bg-primary text-white font-black py-6 rounded-2xl shadow-2xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
                                >
                                    Confirm Settlement
                                    <ArrowLeft className="rotate-180" size={20} />
                                </button>
                                
                                <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                    Funds typically arrive in 2-5 minutes
                                </p>
                            </div>
                        )}

                        {status === 'processing' && (
                            <div className="py-24 flex flex-col items-center justify-center space-y-8">
                                <div className="relative">
                                   <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                                   <Loader2 size={80} className="text-primary animate-spin relative z-10" strokeWidth={1} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-black">Encrypting Session</h3>
                                    <p className="text-slate-400 mt-2 text-sm italic">Synchronizing with blockchain audit trail...</p>
                                </div>
                            </div>
                        )}

                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-12 flex flex-col items-center justify-center space-y-10"
                            >
                                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-500/20 glow-primary shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                                    <CheckCircle2 size={56} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-3xl font-black">Funds Released</h3>
                                    <p className="text-slate-400 mt-3 text-sm max-w-xs mx-auto leading-relaxed">
                                        Your payout of <b>{formatCurrency(amount)}</b> has been successfully initiated. Transaction ID: <span className="text-slate-200 font-mono">SHLD_{Math.random().toString(36).substr(2,6).toUpperCase()}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="w-full bg-white/5 hover:bg-white/10 text-white font-black px-10 py-6 rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    Return to Console
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
