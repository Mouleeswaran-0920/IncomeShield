"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    CloudRain,
    AlertTriangle,
    Wallet,
    MapPin,
    Activity,
    IndianRupee,
    LayoutDashboard,
    ShieldCheck,
    History,
    ArrowUpRight,
    HelpCircle,
    X,
    CheckCircle2
} from 'lucide-react';
import { useRealTime } from '@/context/RealTimeContext';
import DashboardCard from '@/components/DashboardCard';
import IncomeChart from '@/components/IncomeChart';
import { formatCurrency, cn } from '@/lib/utils';

import RazorpayButton from '@/components/RazorpayButton';

export default function Dashboard() {
    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/auth/login');
        }
    }, [router]);

    const [user, setUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ name: '', bank_account: '', ifsc_code: '' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setEditData({ name: parsed.name || '', bank_account: parsed.bank_account || '', ifsc_code: parsed.ifsc_code || '' });
        }
    }, []);

    const { envData } = useRealTime();
    const [stats, setStats] = useState({
        earnings: 850,
        expected: 1200,
        loss: 350,
        payout: 280,
        weeklyLoss: 2450,
        weeklyPayout: 1960,
        trustScore: 92
    });
    const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        setLastSync(new Date().toLocaleTimeString());
    }, [envData]);

    const chartData = [
        { time: 'Mon', predicted: 1100, actual: 1050 },
        { time: 'Tue', predicted: 1200, actual: 1180 },
        { time: 'Wed', predicted: 1000, actual: 400 }, // Rain alert
        { time: 'Thu', predicted: 1100, actual: 950 },
        { time: 'Fri', predicted: 1200, actual: 1100 },
        { time: 'Sat', predicted: 1300, actual: 1250 },
        { time: 'Sun', predicted: 1200, actual: 850 },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans p-6 md:p-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                        <ShieldCheck size={32} className="text-blue-600" />
                        My IncomeShield
                    </h1>
                    <p className="text-gray-500 font-medium">Personal Income Protection</p>
                </div>
                <div className="flex items-center gap-4">
                    <div
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl shadow-sm border border-gray-100 group cursor-pointer hover:border-blue-200 transition-all"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100">
                            {user?.name?.charAt(0).toUpperCase() || 'G'}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                {user?.role === 'ADMIN' ? 'Admin' : 'Gig Worker'}
                            </p>
                            <p className="text-sm font-bold text-gray-900 leading-none">{user?.name || 'Loading...'}</p>
                        </div>
                    </div>
                    <div className="h-10 w-[1px] bg-gray-200 mx-1" />
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <StatusIndicator status={envData.source} />
                    </div>
                </div>
            </header>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-10 overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-2 bg-blue-600" />
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-gray-900">Profile Details</h3>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank Account</label>
                                    <input
                                        type="text"
                                        value={editData.bank_account}
                                        onChange={(e) => setEditData({ ...editData, bank_account: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">IFSC Code</label>
                                    <input
                                        type="text"
                                        value={editData.ifsc_code}
                                        onChange={(e) => setEditData({ ...editData, ifsc_code: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        const updated = { ...user, ...editData };
                                        setUser(updated);
                                        localStorage.setItem('user', JSON.stringify(updated));
                                        setIsEditModalOpen(false);
                                    }}
                                    className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    Save Changes <CheckCircle2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <DashboardCard
                    title="Daily Earnings"
                    value={formatCurrency(stats.earnings)}
                    icon={Wallet}
                    trend={-12.5}
                />
                <DashboardCard
                    title="Weekly Protection"
                    value={formatCurrency(stats.weeklyPayout)}
                    icon={Activity}
                    className="border-blue-100"
                    description="Accrued daily loss coverage"
                />
                <DashboardCard
                    title="Claimable Today"
                    value={formatCurrency(stats.payout)}
                    icon={ArrowUpRight}
                    className="border-green-100"
                    description={envData.alert !== "NONE" ? "DISRUPTION DETECTED" : "Normal Conditions"}
                />
                <DashboardCard
                    title="Trust Score"
                    value={`${stats.trustScore}%`}
                    icon={ShieldCheck}
                    description="Very High Probability"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Analytics */}
                <div className="lg:col-span-2 space-y-8">
                    <IncomeChart data={chartData} title="Weekly Income Flow" />
                </div>

                {/* Real-time Details */}
                <div className="space-y-8">
                    {/* Alerts Section */}
                    <AnimatePresence>
                        {envData.alert !== "NONE" && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-600 text-white p-6 rounded-3xl shadow-xl shadow-red-100 flex flex-col gap-4"
                            >
                                <div className="flex items-center gap-3">
                                    <AlertTriangle size={32} />
                                    <h3 className="text-xl font-black uppercase tracking-wider">{envData.alert} ALERT</h3>
                                </div>
                                <p className="text-sm text-red-50 font-medium leading-relaxed">
                                    {envData.alert === "HEAT_WAVE"
                                        ? "Extreme temperature detected. Your heat-exposure protection is active."
                                        : envData.alert === "AIR_EMERGENCY"
                                            ? "Hazardous air quality detected. Protective payouts are being calculated."
                                            : "Extreme disruption detected. Your income protection is active."}
                                </p>
                                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                                    <p className="text-xs font-bold uppercase opacity-80 mb-1">Estimated Loss</p>
                                    <p className="text-2xl font-black">₹{stats.payout}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                                <Activity size={20} className="text-blue-600" />
                                Real-time Risk Data
                            </h3>
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                SYNCED: {lastSync}
                            </span>
                        </div>

                        <div className="space-y-6">
                            <EnvItem label="Dry Heat (Temp)" value={`${envData.temp || 42}°C`} max={50} color={envData.temp > 40 ? "red" : "blue"} />
                            <EnvItem label="Air Quality (AQI)" value={envData.aqi} max={400} color={envData.aqi > 250 ? "red" : "blue"} />
                            <EnvItem label="Gig Strike Risk" value={`${envData.strike || 0}%`} max={100} color={envData.strike > 30 ? "red" : "blue"} />
                            <EnvItem label="AI Overall Risk" value={(envData.riskScore * 10).toFixed(1)} max={10} color={envData.riskScore > 0.7 ? "red" : "blue"} />
                        </div>

                        <div className="space-y-4 mt-8">
                            <div className="p-6 bg-blue-50/50 rounded-[24px] border border-blue-100">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Calculation Logic (Payout)</p>
                                <p className="text-sm font-bold text-gray-700 italic">
                                    Payout = (Expected - Actual Earnings) × 0.8
                                </p>
                            </div>

                            <div className="p-6 bg-orange-50/50 rounded-[24px] border border-orange-100">
                                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3">Calculation Logic (Risk Score)</p>
                                <p className="text-sm font-bold text-gray-700 italic mb-2">
                                    Risk Score = (0.4 × Temp) + (0.3 × AQI) + (0.3 × Income Drop)
                                </p>
                                <div className="pt-3 border-t border-orange-100/50 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Score:</span>
                                    <span className="text-lg font-black text-orange-600">
                                        {Math.round((0.4 * (envData.temp || 42)) + (0.3 * (envData.aqi || 180) / 5) + (0.3 * (stats.expected - stats.earnings) / 10))} pts
                                    </span>
                                </div>
                            </div>
                        </div>


                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Weekly Payout</h4>
                                <div className="group relative">
                                    <HelpCircle size={16} className="text-gray-400 cursor-help" />
                                    <div className="invisible group-hover:visible absolute right-0 bottom-full mb-2 w-64 p-4 bg-gray-900 text-white text-[10px] rounded-xl shadow-2xl z-50">
                                        <p className="font-bold mb-2">How we calculate your payout:</p>
                                        <ul className="space-y-1 opacity-80">
                                            <li>• Predicted Income: AI estimate for normal days</li>
                                            <li>• Actual Income: Your tracked gig earnings</li>
                                            <li>• Coverage: 80% of the difference (Loss)</li>
                                            <li>• Total = Σ (Predicted - Actual) × 0.8</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold">ACCUMULATED LOSS</p>
                                    <p className="text-2xl font-black text-gray-900">{formatCurrency(stats.weeklyPayout)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-green-600 font-black px-2 py-1 bg-green-50 rounded-lg">VERIFIED BY AI</p>
                                </div>
                            </div>
                            <RazorpayButton amount={stats.weeklyPayout} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusIndicator({ status }) {
    const color = status === "LIVE_DATA" ? "bg-green-500" : "bg-yellow-500";
    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-700">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", color)} />
            {status}
        </div>
    );
}

function EnvItem({ label, value, max, color }) {
    const percentage = Math.min(100, (value / max) * 100);
    const barColor = color === "red" ? "bg-red-500" : "bg-blue-600";
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">{label}</span>
                <span className={cn("font-bold", color === "red" ? "text-red-600" : "text-gray-900")}>{value}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={cn("h-full rounded-full", barColor)}
                />
            </div>
        </div>
    );
}
