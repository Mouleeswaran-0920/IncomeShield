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

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className={cn(
        "relative h-screen flex flex-col transition-all duration-300 ease-in-out z-50",
        "glass-dark border-r border-white/10"
      )}
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold gradient-text">IncomeShield</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.id} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive 
                    ? "bg-primary/20 text-primary border border-primary/30 glow-primary" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 shrink-0",
                  isActive ? "text-primary" : "group-hover:text-white"
                )} />
                {!collapsed && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-white/5">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer",
          collapsed ? "justify-center" : ""
        )}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <UserIcon className="text-white w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate">Rohan Das</p>
              <p className="text-xs text-slate-500 truncate">rohan@example.com</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
