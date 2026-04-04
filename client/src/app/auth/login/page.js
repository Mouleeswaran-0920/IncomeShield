"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Phone, Lock, ArrowRight, User as UserIcon, Building2 } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
    const [formData, setFormData] = useState({ phone: '', password: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (res.data.user.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-blue-50"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-blue-600 p-3 rounded-2xl text-white mb-4">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 text-center">Welcome to IncomeShield</h1>
                    <p className="text-gray-500 text-sm mt-2 text-center">Secure your daily earnings with AI-driven protection</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="9876543210"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-900 font-medium"
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-900 font-medium"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-xs font-bold text-center mt-2">{error}</p>}

                    <button className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        Sign In <ArrowRight size={20} />
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-10">
                    Don't have an account? {' '}
                    <Link href="/auth/signup" className="text-blue-600 font-bold hover:underline">Create One</Link>
                </p>
            </motion.div>
        </div>
    );
}
