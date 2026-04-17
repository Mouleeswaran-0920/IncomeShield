"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Phone, Lock, User, ArrowRight, AlertTriangle, Info, Sparkles } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

export default function LoginPage() {
    const [formData, setFormData] = useState({ username: '', phone: '', password: '', role: 'USER' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const router = useRouter();

    const handlePhoneChange = (val) => {
        const cleaned = val.slice(0, 10);
        setFormData({ ...formData, phone: cleaned });
        if (cleaned.length > 0 && cleaned.length !== 10) {
            setPhoneError(true);
        } else {
            setPhoneError(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.phone.length !== 10) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }

        if (formData.password.length !== 6) {
            setError('Vault Key must be exactly 6 characters.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${API_URL}/api/auth/login`, formData);
            const userToStore = res.data.user || { name: formData.username, phone: formData.phone, role: formData.role };
            localStorage.setItem('user', JSON.stringify(userToStore));
            router.push('/dashboard');
        } catch (err) {
            // Since it's a mock for now, we'll allow login with any data
            const fallbackUser = { name: formData.username, phone: formData.phone, role: formData.role };
            localStorage.setItem('user', JSON.stringify(fallbackUser));
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
            {/* Extremely Vibrant Background Overlays */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-48 -left-24 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[160px] animate-pulse" />
                <div className="absolute top-1/2 -right-48 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[160px] animate-pulse delay-700" />
                <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-full max-w-lg relative z-10"
            >
                {/* Decorative floating icon */}
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-12 group hover:rotate-0 transition-transform hidden lg:flex"
                >
                    <Sparkles className="text-white" size={40} />
                </motion.div>

                <div className="glass-dark border border-white/10 rounded-[3rem] p-12 shadow-[0_32px_120px_-20px_rgba(59,130,246,0.3)]">
                    <div className="flex flex-col items-center mb-12 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary via-blue-400 to-emerald-400 p-[2px] mb-8 glow-primary">
                           <div className="w-full h-full bg-[#020617] rounded-[calc(1.5rem-2px)] flex items-center justify-center">
                              <ShieldCheck size={44} className="text-white" />
                           </div>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
                           Partner Portal
                        </h1>
                        <p className="text-slate-400 font-medium max-w-xs">
                           Secure your gig earnings with high-fidelity parametric intelligence.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Access Portal (Role Selector) Moved to Top */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-amber-400 uppercase tracking-[0.2em] ml-2">Access Portal</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'USER' })}
                                    className={cn(
                                        "py-4 rounded-2xl border font-bold transition-all",
                                        formData.role === 'USER' 
                                            ? "bg-primary/20 border-primary text-white glow-primary" 
                                            : "glass border-white/10 text-slate-500 hover:text-slate-300"
                                    )}
                                >
                                    Gig Worker
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                                    className={cn(
                                        "py-4 rounded-2xl border font-bold transition-all",
                                        formData.role === 'ADMIN' 
                                            ? "bg-purple-600/20 border-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]" 
                                            : "glass border-white/10 text-slate-500 hover:text-slate-300"
                                    )}
                                >
                                    Admin Panel
                                </button>
                            </div>
                        </div>

                        {/* Username Field */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-primary uppercase tracking-[0.2em] ml-2">Display Name</label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                <div className="relative flex items-center">
                                   <User className="absolute left-5 text-slate-500 group-focus-within:text-white transition-colors" size={20} />
                                   <input
                                       type="text"
                                       required
                                       placeholder="Enter your full name"
                                       className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary/50 transition-all outline-none text-white font-bold placeholder:text-slate-600"
                                       onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                   />
                                </div>
                            </div>
                        </div>

                        {/* Phone Field with Validation Logic */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center ml-2">
                                <label className="text-xs font-black text-purple-400 uppercase tracking-[0.2em]">Mobile Anchor</label>
                                {phoneError && <span className="text-[10px] font-black text-red-500 uppercase animate-bounce">Require Exactly 10 Digits</span>}
                            </div>
                            <div className="relative group">
                                <div className={cn(
                                    "absolute inset-0 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity",
                                    phoneError ? "bg-red-500/20" : "bg-gradient-to-r from-purple-600/20 to-emerald-500/20"
                                )} />
                                <div className="relative flex items-center">
                                   <Phone className={cn("absolute left-5 transition-colors", phoneError ? "text-red-500" : "text-slate-500 group-focus-within:text-white")} size={20} />
                                   <input
                                       type="number"
                                       required
                                       placeholder="10-Digit Mobile Number"
                                       className={cn(
                                           "w-full pl-14 pr-6 py-5 bg-white/5 border rounded-2xl focus:bg-white/10 transition-all outline-none text-white font-bold placeholder:text-slate-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                           phoneError ? "border-red-500/50" : "border-white/10 focus:border-purple-500/50"
                                       )}
                                       onChange={(e) => handlePhoneChange(e.target.value)}
                                   />
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center ml-2">
                                <label className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">Vault Key</label>
                                {formData.password.length > 0 && formData.password.length !== 6 && (
                                    <span className="text-[10px] font-black text-red-500 uppercase animate-pulse">Required Exactly 6 Chars</span>
                                )}
                            </div>
                            <div className="relative group">
                                <div className={cn(
                                    "absolute inset-0 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity",
                                    formData.password.length > 0 && formData.password.length !== 6 ? "bg-red-500/20" : "bg-gradient-to-r from-emerald-500/20 to-primary/20"
                                )} />
                                <div className="relative flex items-center">
                                   <Lock className={cn("absolute left-5 transition-colors", formData.password.length > 0 && formData.password.length !== 6 ? "text-red-500" : "text-slate-500 group-focus-within:text-white")} size={20} />
                                   <input
                                       type="password"
                                       required
                                       placeholder="••••••"
                                       className={cn(
                                           "w-full pl-14 pr-6 py-5 bg-white/5 border rounded-2xl focus:bg-white/10 transition-all outline-none text-white font-bold placeholder:text-slate-600",
                                           formData.password.length > 0 && formData.password.length !== 6 ? "border-red-500/50" : "border-white/10 focus:border-emerald-500/50"
                                       )}
                                       onChange={(e) => setFormData({ ...formData, password: e.target.value.slice(0, 6) })}
                                       value={formData.password}
                                   />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold shadow-lg"
                                >
                                    <AlertTriangle size={18} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            disabled={loading}
                            className="w-full group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-400 to-purple-600 transition-all duration-500 group-hover:scale-110" />
                            <div className="relative py-6 rounded-2xl flex items-center justify-center gap-4 text-xl font-black text-white transition-transform active:scale-95">
                                {loading ? "Establishing Secure Link..." : "Authenticate Access"}
                                {!loading && <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />}
                            </div>
                        </button>
                    </form>

                    <div className="mt-12 flex flex-col items-center gap-6">
                        <p className="text-slate-500 text-sm font-medium">
                            Need partner verification? <Link href="/auth/signup" className="text-primary font-black hover:underline underline-offset-4 decoration-2">Inquire here</Link>
                        </p>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">
                           <Info size={12} className="text-primary" />
                           Parametric Guard Engine v4.0.2
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

