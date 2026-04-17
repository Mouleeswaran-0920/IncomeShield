"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';
import ThemeToggle from '@/components/ThemeToggle';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }) {
  const [user, setUser] = React.useState({ name: 'Partner', phone: '' });

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground relative transition-colors duration-500">
      {/* Background Glows for Dashboard */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] dark:opacity-100 opacity-20" />
        <div className="absolute bottom-1/4 -right-24 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] dark:opacity-100 opacity-20" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto no-scrollbar z-10">
        {/* Top Header */}
        <header className="sticky top-0 z-40 w-full glass border-b border-border px-8 py-5 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Authenticated Session</h1>
            <h2 className="text-2xl font-black gradient-text">Welcome, {user.name}</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">System Secure</span>
            </div>
            
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all relative">
              <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-[#020617] glow-primary" />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
