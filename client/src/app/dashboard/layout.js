"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto no-scrollbar">
        {/* Top Header */}
        <header className="sticky top-0 z-40 w-full glass border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-sm font-medium text-slate-400">Welcome Back,</h1>
            <h2 className="text-xl font-bold">Rohan Das</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">System Live</span>
            </div>
            
            <button className="p-2 rounded-full hover:bg-white/5 transition-colors relative">
              <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
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
