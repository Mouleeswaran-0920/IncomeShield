"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const IncomeChart = ({ data, title = "Income Protection Overview" }) => {
    return (
        <div className="h-[300px] w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="predicted" stroke="#2563eb" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} name="Predicted Income" />
                    <Area type="monotone" dataKey="actual" stroke="#ef4444" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} name="Actual Income" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IncomeChart;
