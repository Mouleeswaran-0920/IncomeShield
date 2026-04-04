"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, CheckCircle2, CreditCard, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const amount = searchParams.get('amount') || '0';
    const [status, setStatus] = useState('review'); // review, processing, success

    const handlePay = () => {
        setStatus('processing');
        setTimeout(() => setStatus('success'), 2500);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-blue-600 p-8 text-white relative">
                    <button onClick={() => router.back()} className="absolute left-6 top-8 text-white/80 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex flex-col items-center">
                        <ShieldCheck size={48} className="mb-4" />
                        <h1 className="text-2xl font-bold text-center">GigShield Secure Checkout</h1>
                        <p className="text-blue-100 text-sm mt-1 uppercase tracking-widest font-bold">Razorpay Integrated</p>
                    </div>
                </div>

                <div className="p-10">
                    {status === 'review' && (
                        <div className="space-y-8">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Settlement Summary</p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-900">{formatCurrency(amount)}</h2>
                                        <p className="text-sm text-gray-500">Weekly Accrued Protection</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-1 rounded-lg inline-block">PARAMETRIC PAYOUT</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900 ml-1 flex items-center gap-2">
                                    <CreditCard size={18} className="text-blue-600" />
                                    Payment Method
                                </h3>
                                <div className="p-5 border-2 border-blue-600 bg-blue-50 rounded-2xl flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm font-black italic">R</div>
                                        <div>
                                            <p className="font-bold text-sm text-blue-900">Razorpay Direct</p>
                                            <p className="text-xs text-blue-700">UPI, Card, Netbanking</p>
                                        </div>
                                    </div>
                                    <div className="w-5 h-5 rounded-full border-4 border-blue-600 bg-white" />
                                </div>
                            </div>

                            <button
                                onClick={handlePay}
                                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-lg"
                            >
                                Complete Payment
                            </button>
                        </div>
                    )}

                    {status === 'processing' && (
                        <div className="py-20 flex flex-col items-center justify-center space-y-6">
                            <Loader2 size={64} className="text-blue-600 animate-spin" />
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-900">Verifying Transaction</h3>
                                <p className="text-gray-500 mt-2">Connecting to Razorpay secure gateway...</p>
                            </div>
                        </div>
                    )}

                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="py-10 flex flex-col items-center justify-center space-y-8"
                        >
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <CheckCircle2 size={48} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-black text-gray-900">Settlement Complete</h3>
                                <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                                    The payout of <b>{formatCurrency(amount)}</b> has been successfully transferred to your linked bank account.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="bg-gray-900 text-white font-bold px-10 py-4 rounded-2xl hover:bg-black transition-all"
                            >
                                Back to Dashboard
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
