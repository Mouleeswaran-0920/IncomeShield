"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Phone, Lock, ArrowRight, Info, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

export default function LoginPage() {
    const [formData, setFormData] = useState({ phone: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${API_URL}/api/auth/login`, formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-dark border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="bg-primary p-3 rounded-2xl text-white mb-6 glow-primary">
                            <ShieldCheck size={40} />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">Partner Portal</h1>
                        <p className="text-slate-400 text-sm">Secure access to your protective earnings hub.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Phone Identity</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Registered mobile number"
                                    className="w-full pl-12 pr-4 py-5 glass border-none rounded-2xl focus:ring-2 focus:ring-primary/50 transition-all outline-none text-white font-bold placeholder:text-slate-600"
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    className="w-full pl-12 pr-4 py-5 glass border-none rounded-2xl focus:ring-2 focus:ring-primary/50 transition-all outline-none text-white font-bold placeholder:text-slate-600"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold"
                                >
                                    <AlertTriangle size={14} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            disabled={loading}
                            className="w-full bg-primary text-white font-black py-6 rounded-2xl shadow-2xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                        >
                            {loading ? "Authenticating..." : "Connect Account"}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 flex flex-col gap-4 text-center">
                        <Link href="/auth/signup" className="text-slate-400 text-sm font-bold hover:text-white transition-colors">
                            Request new partner access?
                        </Link>
                        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                            <Info size={12} />
                            Secured by IncomeShield Neural Auth
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
