"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  BrainCircuit, 
  Map as MapIcon, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  User as UserIcon,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'risk', label: 'Live Risk Monitor', icon: Activity, href: '/dashboard/risk' },
  { id: 'income', label: 'Income Analytics', icon: TrendingUp, href: '/dashboard/income' },
  { id: 'claims', label: 'Claims & Payouts', icon: ShieldCheck, href: '/dashboard/claims' },
  { id: 'disaster', label: 'Disaster Mode', icon: AlertTriangle, href: '/dashboard/disaster' },
  { id: 'fraud', label: 'Fraud Insights', icon: ShieldAlert, href: '/dashboard/fraud' },
  { id: 'ai', label: 'AI Insights', icon: BrainCircuit, href: '/dashboard/ai' },
  { id: 'map', label: 'Map View', icon: MapIcon, href: '/dashboard/map' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
  { id: 'admin', label: 'Admin Panel', icon: UserIcon, href: '/dashboard/admin' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState({ name: 'Partner', phone: '' });

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className={cn(
        "relative h-screen flex flex-col transition-all duration-300 ease-in-out z-50",
        "glass-dark border-r border-white/10 shadow-[20px_0_40px_rgba(0,0,0,0.3)]"
      )}
    >
      {/* Logo Section */}
      <div className="p-8 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center glow-primary shadow-lg shadow-primary/20">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter gradient-text">IncomeShield</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-500 hover:text-white"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-3 py-6 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.id} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.95, backgroundColor: "rgba(255,255,255,0.02)" }}
                className={cn(
                  "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 glow-primary" 
                    : "text-slate-500 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent transition-opacity duration-300",
                  isActive ? "opacity-100" : "opacity-0"
                )} />
                <item.icon className={cn(
                  "w-5 h-5 shrink-0 relative z-10",
                  isActive ? "text-primary" : "group-hover:text-white"
                )} />
                {!collapsed && (
                  <span className="font-bold text-sm tracking-wide relative z-10">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary relative z-10 glow-primary"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-white/5 mb-4">
        <div className={cn(
          "flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group",
          collapsed ? "justify-center" : ""
        )}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <UserIcon className="text-white w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-black text-xs tracking-tight truncate uppercase text-slate-300 group-hover:text-white">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate uppercase font-bold tracking-widest">{user.phone || 'Partner'}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
