"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Phone, Lock, User as UserIcon, Building2, MapPin, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

export default function SignupPage() {
    const [role, setRole] = useState('USER');
    const [formData, setFormData] = useState({
        name: '', phone: '', password: '', zone: '', company: '', avg_daily_income: 500,
        bank_account: '', ifsc_code: ''
    });
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleInitialSubmit = (e) => {
        e.preventDefault();
        setStep(2);
        alert("Mock OTP sent to " + formData.phone + ": 123");
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (otp !== "123") {
            setError("Invalid OTP. Try 123");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
                ...formData,
                role
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl shadow-blue-100/50 p-10 md:p-16 border border-gray-50"
            >
                <div className="flex flex-col items-center mb-12">
                    <div className="bg-blue-600 p-3 rounded-2xl text-white mb-4">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 text-center">
                        {step === 1 ? "Join IncomeShield AI" : "Verify Your Identity"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-2 text-center">
                        {step === 1
                            ? "Smart income protection for the modern workforce"
                            : `We've sent a 3-digit code to ${formData.phone}`
                        }
                    </p>
                </div>

                {step === 1 ? (
                    <>
                        <div className="flex bg-gray-50 p-1.5 rounded-3xl mb-10">
                            <button
                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${role === 'USER' ? 'bg-white text-blue-600 shadow-xl shadow-blue-100' : 'text-gray-400 hover:text-gray-600'}`}
                                onClick={() => setRole('USER')}
                            >
                                <UserIcon size={18} />
                                Gig Worker
                            </button>
                            <button
                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${role === 'ADMIN' ? 'bg-white text-blue-600 shadow-xl shadow-blue-100' : 'text-gray-400 hover:text-gray-600'}`}
                                onClick={() => setRole('ADMIN')}
                            >
                                <Building2 size={18} />
                                Company Admin
                            </button>
                        </div>

                        <form onSubmit={handleInitialSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 text-gray-900 font-medium outline-none transition-all"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="9876543210"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 text-gray-900 font-medium outline-none transition-all"
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>

                            {role === 'USER' ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Location / Zone</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Chennai South"
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 text-gray-900 font-medium outline-none transition-all"
                                            onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Avg. Daily Income (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="1200"
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 text-gray-900 font-medium outline-none transition-all"
                                            onChange={(e) => setFormData({ ...formData, avg_daily_income: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Bank Account Number</label>
                                        <input
                                            type="text"
                                            placeholder="000000000000"
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 text-gray-900 font-medium outline-none transition-all"
                                            onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">IFSC Code</label>
                                        <input
                                            type="text"
                                            placeholder="SBIN0001234"
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 text-gray-900 font-medium outline-none transition-all"
                                            onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value })}
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Company Name</label>
                                    <input
                                        type="text"
                                        placeholder="Zomato / Swiggy / Uber"
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 text-gray-900 font-medium outline-none transition-all"
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Secure Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 text-gray-900 font-medium outline-none transition-all"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>

                            {error && <p className="md:col-span-2 text-red-500 text-xs font-bold bg-red-50 p-4 rounded-2xl border border-red-100">{error}</p>}

                            <button
                                type="submit"
                                className="md:col-span-2 w-full py-5 bg-blue-600 text-white rounded-3xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 mt-4"
                            >
                                Create Account <ArrowRight size={18} />
                            </button>
                        </form>
                    </>
                ) : (
                    <form onSubmit={handleSignup} className="space-y-8">
                        <div className="flex justify-center gap-2">
                            <input
                                type="text"
                                maxLength="3"
                                placeholder="    1 2 3"
                                className="w-full max-w-[200px] h-20 text-3xl font-black text-center tracking-[0.5em] bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                onChange={(e) => setOtp(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-4 rounded-2xl border border-red-100 text-center">{error}</p>}

                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-blue-600 text-white rounded-3xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? "Verifying..." : "Verify & Complete"} <Shield size={18} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full py-4 text-gray-400 font-bold text-sm hover:text-gray-600"
                            >
                                Back to Details
                            </button>
                        </div>
                    </form>
                )}

                <p className="mt-10 text-center text-gray-400 text-sm font-medium">
                    Already protected? <a href="/auth/login" className="text-blue-600 font-bold hover:underline">Sign In</a>
                </p>
            </motion.div>
        </div>
    );
}
