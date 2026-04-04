"use client";
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import CheckoutForm from '@/components/CheckoutForm';

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
                <Loader2 size={48} className="text-blue-600 animate-spin" />
            </div>
        }>
            <CheckoutForm />
        </Suspense>
    );
}
