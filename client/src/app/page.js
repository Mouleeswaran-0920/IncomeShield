"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Zap, CloudRain, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Shield size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">GigShield AI</span>
        </div>
        <Link href="/dashboard" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
          Go to Dashboard <ArrowRight size={16} />
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
            AI-Powered Parametric Insurance
          </span>
          <h1 className="text-6xl font-extrabold tracking-tighter mb-8 md:text-7xl">
            Income Protection for the <br />
            <span className="text-blue-600">Gig Economy</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            GigShield AI detects weather, traffic, and AQI disruptions in real-time,
            predicts your income loss, and triggers automatic payouts. No claims, no paperwork.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
              Launch Dashboard <Zap size={20} />
            </Link>
            <button className="bg-gray-50 text-gray-900 border border-gray-100 px-10 py-5 rounded-2xl font-bold hover:bg-gray-100 transition-all">
              Learn How It Works
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-32 text-left">
          <Feature icon={CloudRain} title="Disruption Detection" desc="Automatic weather and traffic monitoring using real-time API feeds." />
          <Feature icon={Zap} title="Instant Payouts" desc="Calculated by AI models and triggered automatically to your account." />
          <Feature icon={BarChart3} title="Income Prediction" desc="Precision regression models to forecast expected daily earnings." />
        </div>
      </main>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-blue-100 transition-colors">
      <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-6">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
