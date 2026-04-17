"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "group relative w-16 h-8 rounded-full transition-all duration-500 overflow-hidden border",
                theme === 'dark' 
                    ? "bg-slate-900 border-white/10" 
                    : "bg-slate-100 border-slate-200"
            )}
            aria-label="Toggle Theme"
        >
            {/* Background Glows within toggle */}
            <div className={cn(
                "absolute inset-0 transition-opacity duration-500",
                theme === 'dark' ? "opacity-100" : "opacity-0"
            )}>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
            </div>

            {/* Slider / Thumb */}
            <motion.div
                animate={{ 
                    x: theme === 'dark' ? 32 : 4,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                    "relative z-10 w-6 h-6 rounded-full flex items-center justify-center top-1 shadow-lg",
                    theme === 'dark' 
                        ? "bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-blue-500/20" 
                        : "bg-white shadow-slate-200"
                )}
            >
                <AnimatePresence mode="wait">
                    {theme === 'dark' ? (
                        <motion.div
                            key="moon"
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 90 }}
                        >
                            <Moon size={14} className="text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ scale: 0, rotate: 90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: -90 }}
                        >
                            <Sun size={14} className="text-amber-500" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Decorative Stars for Dark Mode */}
            {theme === 'dark' && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                    <div className="w-0.5 h-0.5 rounded-full bg-white opacity-40 animate-pulse" />
                    <div className="w-0.5 h-0.5 rounded-full bg-white opacity-20 animate-pulse delay-75" />
                </div>
            )}
        </button>
    );
}
