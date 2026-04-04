"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    TrendingUp,
    ShieldAlert,
    LayoutDashboard,
    Wallet,
    Activity,
    ArrowUpRight,
    ShieldCheck,
    AlertCircle,
    FileText,
    IndianRupee
} from 'lucide-react';
import { useRealTime } from '@/context/RealTimeContext';
import DashboardCard from '@/components/DashboardCard';
import IncomeChart from '@/components/IncomeChart';
import { cn, formatCurrency } from '@/lib/utils';

export default function AdminDashboard() {
    const router = useRouter();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!localStorage.getItem('token') || user.role !== 'ADMIN') {
            router.push('/auth/login');
        }
    }, [router]);

    const { envData } = useRealTime();
    const [adminData, setAdminData] = useState({
        company: "Zomato Logistics",
        totalWorkers: 12450,
        activeClaims: 84,
        totalPayouts: 450000,
        systemHealth: 98
    });

    const aggregateData = [
        { time: 'Mon', predicted: 45000, actual: 42000 },
        { time: 'Tue', predicted: 48000, actual: 46000 },
        { time: 'Wed', predicted: 52000, actual: 32000 }, // Disruption
        { time: 'Thu', predicted: 50000, actual: 48000 },
        { time: 'Fri', predicted: 55000, actual: 53000 },
        { time: 'Sat', predicted: 60000, actual: 58000 },
        { time: 'Sun', predicted: 58000, actual: 57000 },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] p-6 md:p-10 font-sans">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <Building2 className="text-blue-600" />
                        IncomeShield Console
                    </h1>
                    <p className="text-gray-500 font-medium">Enterprise Protection Monitor</p>
                </div>
                <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 items-center gap-4">
                    <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-bold flex items-center gap-2">
                        <ShieldCheck size={18} />
                        System Online
                    </div>
                </div>
            </header>

            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <DashboardCard
                    title="Protected Workers"
                    value={adminData.totalWorkers.toLocaleString()}
                    icon={Users}
                    description="Across all active zones"
                />
                <DashboardCard
                    title="Active Claims"
                    value={adminData.activeClaims}
                    icon={FileText}
                    className="border-yellow-100"
                    description="Pending AI verification"
                />
                <DashboardCard
                    title="Risk Level"
                    value={envData.strike > 50 ? "CRITICAL" : "STABLE"}
                    icon={Activity}
                    className={envData.strike > 50 ? "border-red-200 text-red-600" : "text-blue-600"}
                />
                <DashboardCard
                    title="Payouts (Wk)"
                    value={formatCurrency(458000)}
                    icon={IndianRupee}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Activity size={20} className="text-blue-600" />
                            Environmental Disruption Monitor
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <span className="text-sm font-medium text-gray-600">Ambient Temp</span>
                                <span className="font-bold text-gray-900">{envData.temp || 42}°C (Summer)</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <span className="text-sm font-medium text-gray-600">Air quality (AQI)</span>
                                <span className="font-bold text-gray-900">{envData.aqi}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                                <span className="text-sm font-medium text-red-700">Strike Probability</span>
                                <span className="font-bold text-red-900">{envData.strike || 0}%</span>
                            </div>
                        </div>
                    </div>

                    <IncomeChart data={aggregateData} title="Enterprise Aggregate Earnings" />

                    <div className="mt-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <AlertCircle size={20} className="text-red-500" />
                            Active Disruption Alerts
                        </h3>
                        <div className="space-y-4">
                            {envData.alert !== "NONE" ? (
                                <div className="p-5 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                                            <ShieldAlert size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{envData.alert} WARNING</p>
                                            <p className="text-sm text-gray-500">Affecting 3,420 workers in North Delhi</p>
                                        </div>
                                    </div>
                                    <button className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                                        ACTIVATE EMERGENCY SCALING
                                    </button>
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm font-medium">No active disruptions detected across protected zones.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold mb-6">Zone Health</h3>
                        <div className="space-y-6">
                            <ZoneItem name="Delhi Central" risk={20} />
                            <ZoneItem name="Gurgaon Sector 45" risk={85} high />
                            <ZoneItem name="Noida Electronic City" risk={15} />
                            <ZoneItem name="Mumbai West" risk={45} />
                        </div>
                    </div>

                    <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">Weekly Settlement</h3>
                            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                                Calculated automatically based on parametric thresholds.
                            </p>
                            <div className="text-3xl font-black mb-6">₹4,50,000</div>
                            <button className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-50 transition-colors">
                                Authorize Payouts
                            </button>
                        </div>
                        <Activity className="absolute -bottom-10 -right-10 text-white/10 w-40 h-40" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ZoneItem({ name, risk, high }) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <p className="text-sm font-bold text-gray-900">{name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Current Risk Index</p>
            </div>
            <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase",
                high ? "bg-red-100 text-red-700" : "bg-blue-50 text-blue-600"
            )}>
                {risk}%
            </div>
        </div>
    );
}
