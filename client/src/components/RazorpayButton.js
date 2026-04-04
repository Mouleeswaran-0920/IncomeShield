"use client";
import React from 'react';
import { CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function RazorpayButton({ amount, onSuccess }) {
    const router = useRouter();

    const handlePayment = () => {
        router.push(`/checkout?amount=${amount}`);
    };

    return (
        <button
            onClick={handlePayment}
            className={cn(
                "w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl shadow-lg transition-all",
                "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
            )}
        >
            <CreditCard size={20} />
            Pay ₹{amount} via Razorpay
        </button>
    );
}
