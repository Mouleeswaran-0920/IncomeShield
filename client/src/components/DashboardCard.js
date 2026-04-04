import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const DashboardCard = ({ title, value, icon: Icon, trend, description, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow",
                className
            )}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-full",
                        trend > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                {description && <p className="text-xs text-gray-400 mt-2">{description}</p>}
            </div>
        </motion.div>
    );
};

export default DashboardCard;
