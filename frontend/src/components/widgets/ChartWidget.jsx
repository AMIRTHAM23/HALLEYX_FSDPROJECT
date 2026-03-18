import { motion } from "framer-motion";
import {
    BarChart, Bar,
    LineChart, Line,
    PieChart, Pie,
    XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

function ChartWidget({ type, data }) {
    const chartVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    };

    if (type === "bar")
        return (
            <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                className="bg-white p-4 rounded-lg shadow-md"
            >
                <BarChart width={300} height={200} data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#f9fafb',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px'
                        }}
                    />
                    <Bar dataKey="value" fill="url(#barGradient)" />
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        </linearGradient>
                    </defs>
                </BarChart>
            </motion.div>
        );

    if (type === "line")
        return (
            <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                className="bg-white p-4 rounded-lg shadow-md"
            >
                <LineChart width={300} height={200} data={data}>
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#f9fafb',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="url(#lineGradient)"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                </LineChart>
            </motion.div>
        );

    if (type === "pie")
        return (
            <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                className="bg-white p-4 rounded-lg shadow-md"
            >
                <PieChart width={300} height={200}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#3b82f6"
                        label
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#f9fafb',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px'
                        }}
                    />
                </PieChart>
            </motion.div>
        );

    if (type === "kpi")
        return (
            <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg shadow-md text-center"
            >
                <h2 className="text-lg font-bold text-gray-800 mb-2">Revenue</h2>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">$24000</p>
            </motion.div>
        );

    if (type === "table")
        return (
            <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                className="bg-white p-4 rounded-lg shadow-md"
            >
                <div className="text-gray-600">Table Widget</div>
            </motion.div>
        );

    return null;
}

export default ChartWidget;