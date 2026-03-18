import { useState } from "react";
import { motion } from "framer-motion";

function Sidebar({ addWidget }) {
    const [open, setOpen] = useState({
        charts: true,
        tables: true,
        kpis: true,
        filters: true
    });

    const groups = [
        {
            id: "filters",
            title: "Filters",
            items: [{ type: "date-filter", label: "Date Filter" }]
        },
        {
            id: "charts",
            title: "Charts",
            items: [
                { type: "bar", label: "Bar Chart" },
                { type: "line", label: "Line Chart" },
                { type: "pie", label: "Pie Chart" },
                { type: "area", label: "Area Chart" },
                { type: "scatter", label: "Scatter Plot" }
            ]
        },
        {
            id: "tables",
            title: "Tables",
            items: [{ type: "table", label: "Table" }]
        },
        {
            id: "kpis",
            title: "KPIs",
            items: [{ type: "kpi", label: "KPI Value" }]
        }
    ];

    function onDragStart(e, type) {
        e.dataTransfer.setData("widgetType", type);
    }

    return (
        <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-64 lg:w-72 bg-gradient-to-b from-stone-50 to-stone-100 shadow-xl md:h-screen md:sticky md:top-0 p-4 overflow-y-auto shrink-0 border-r border-stone-200"
        >
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="font-bold mb-4 text-lg text-gray-800"
            >
                Widgets
            </motion.h2>

            {groups.map((group, index) => (
                <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    className="mb-4"
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-between text-sm font-semibold text-stone-700 mb-2 bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        onClick={() => setOpen({ ...open, [group.id]: !open[group.id] })}
                    >
                        <span>{group.title}</span>
                        <motion.span
                            animate={{ rotate: open[group.id] ? 0 : 180 }}
                            transition={{ duration: 0.3 }}
                            className="text-gray-400"
                        >
                            ▼
                        </motion.span>
                    </motion.button>

                    <motion.div
                        initial={false}
                        animate={{ height: open[group.id] ? "auto" : 0, opacity: open[group.id] ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        {group.items.map((w, itemIndex) => (
                            <motion.div
                                key={w.type}
                                draggable
                                onDragStart={(e) => onDragStart(e, w.type)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * itemIndex, duration: 0.4 }}
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                                whileTap={{ scale: 0.98 }}
                                className="p-3 border-2 border-stone-200 mb-3 cursor-move bg-white hover:bg-gradient-to-r hover:from-[#F4EDE4] hover:to-stone-50 hover:border-[#B08968] rounded-lg transition-all duration-200 shadow-sm"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="mb-2 sm:mb-0">
                                        <div className="font-semibold text-gray-800">{w.label}</div>
                                        <div className="text-xs text-gray-500 mt-1">Drag to add to dashboard</div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-gradient-to-r from-[#8B5E34] to-[#B08968] hover:from-[#6F4726] hover:to-[#8B5E34] text-white text-xs px-3 py-2 rounded-lg shadow-md transition-all duration-200"
                                        onClick={() => addWidget(w.type)}
                                    >
                                        Add
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            ))}
        </motion.div>
    );
}

export default Sidebar; 
