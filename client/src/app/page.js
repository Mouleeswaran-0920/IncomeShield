"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Zap, CloudRain, Activity, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-primary/30 overflow-x-hidden">
      {/* Abstract Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
      </div>

      <nav className="relative z-10 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl text-white glow-primary">
            <ShieldCheck size={28} />
          </div>
          <span className="text-2xl font-black tracking-tighter gradient-text">IncomeShield AI</span>
        </div>
        <div className="flex items-center gap-8">
           <Link href="/about" className="hidden md:block text-sm font-bold text-slate-400 hover:text-white transition-colors">How it works</Link>
           <Link href="/auth/login" className="bg-white/10 hover:bg-white/15 px-6 py-2.5 rounded-xl text-sm font-bold border border-white/10 transition-all flex items-center gap-2">
              Launch Console <ArrowRight size={16} />
           </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20 mb-10">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Empowering the modern workforce
          </div>
          
          <h1 className="text-6xl font-black tracking-tighter mb-8 md:text-8xl leading-[0.9]">
            Instant Protection for <br />
            <span className="gradient-text">Gig Earnings.</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
            The world's first AI-powered parametric platform that detects disruptions 
            and triggers automatic payouts. No claims. No waiting. Just security.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link href="/auth/login" className="bg-primary text-white px-12 py-6 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center gap-3 group">
              Get Started Now <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-slate-500 text-sm font-medium">Trusted by 10,000+ driver partners across India</p>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-40">
          <Feature 
            icon={Activity} 
            title="Real-time Telemetry" 
            desc="Continuous monitoring of weather, AQI, and traffic density via hyper-local APIs." 
          />
          <Feature 
            icon={BrainCircuit} 
            title="Predictive AI" 
            desc="Proprietary regression models to forecast expected earnings with high precision." 
          />
          <Feature 
            icon={Zap} 
            title="Parametric Payouts" 
            desc="Automated settlements triggered instantly when environmental thresholds are breached." 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 text-center text-slate-600 text-sm font-medium">
         © 2026 IncomeShield AI. Built for the future of work.
      </footer>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-10 glass-dark rounded-[2.5rem] border border-white/5 text-left group hover:border-primary/30 transition-all"
    >
      <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all mb-8">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
