import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import WidgetRenderer from "../components/WidgetRenderer";
import Sidebar from "../components/Sidebar";
import WidgetSettings from "../components/widgets/WidgetSettings";

function useContainerWidth() {
    const containerRef = useRef(null);
    const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth - 256 : 1200);

    useEffect(() => {
        if (!containerRef.current) return;
        const node = containerRef.current;

        const updateWidth = () => {
            const nextWidth = node.getBoundingClientRect().width;
            setWidth(nextWidth);
        };

        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(node);

        window.addEventListener("resize", updateWidth);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateWidth);
        };
    }, []);

    return { width, containerRef };
}

function ConfigureDashboard() {
    const { width, containerRef } = useContainerWidth();

    const [widgets, setWidgets] = useState([]);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [activeWidget, setActiveWidget] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [activeAddSlot, setActiveAddSlot] = useState(null);

    useEffect(() => {
        API.get("/dashboard/load")
            .then(res => {
                if (Array.isArray(res.data)) {
                    setWidgets(applyLayout(res.data));
                } else {
                    setWidgets([]);
                }
            })
            .catch(err => {
                console.error("Error loading dashboard:", err);
                setWidgets([]);
            });
    }, []);

    useEffect(() => {
        API.get("/orders")
            .then(res => {
                setData(res.data);
                setFilteredData(res.data);
            })
            .catch(err => {
                console.log("API error:", err);
                setData([]);
                setFilteredData([]);
            });
    }, []);

    const PER_ROW = 4;
    const FIXED_W = 3;
    const FIXED_H = 4;

    function applyLayout(list) {
        return list.map((widget, index) => ({
            ...widget,
            x: (index % PER_ROW) * FIXED_W,
            y: Math.floor(index / PER_ROW) * FIXED_H,
            w: FIXED_W,
            h: FIXED_H
        }));
    }

    function addWidget(type) {
        const index = widgets.length;
        const nextX = (index % PER_ROW) * FIXED_W;
        const nextY = Math.floor(index / PER_ROW) * FIXED_H;

        const widget = {
            i: Date.now().toString(),
            x: nextX,
            y: nextY,
            w: FIXED_W,
            h: FIXED_H,
            minW: 1,
            minH: 1,
            type,
            title: type === "date-filter" ? "Date Filter" : type.toUpperCase(),
            color: "#8B5E34",
            columns: type === "table" ? ["Customer ID", "Customer name", "Email id", "Phone number", "Address", "Order ID", "Order date", "Product", "Quantity", "Unit price", "Total amount", "Status", "Created by"] : [],
            visibleColumns: type === "table" ? ["Customer ID", "Customer name", "Email id", "Phone number", "Address", "Order ID", "Order date", "Product", "Quantity", "Unit price", "Total amount", "Status", "Created by"] : [],
            ...(type === "kpi" && {
                metric: "Total amount",
                aggregation: "Sum",
                dataFormat: "Number",
                decimalPrecision: 0
            }),
            ...(["bar", "line", "area"].includes(type) && {
                xAxis: "Product",
                yAxis: "Total amount",
                showLegend: true
            }),
            ...(type === "pie" && {
                chartData: "Status",
                showLegend: true
            }),
            ...(type === "scatter" && {
                xAxis: "Quantity",
                yAxis: "Total amount"
            }),
            ...(type === "table" && {
                fontSize: 14,
                headerBgColor: "#54bd95",
                pagination: 10,
                sortable: true,
                sortBy: "Order date",
                applyFilter: false
            })
        };
        setWidgets(applyLayout([...widgets, widget]));
    }

    function deleteWidget(id) {
        if (!window.confirm("Remove this widget?")) return;
        setWidgets(applyLayout(widgets.filter(w => w.i !== id)));
    }

    function updateWidget(updatedWidget) {
        setWidgets(applyLayout(widgets.map(w => w.i === updatedWidget.i ? updatedWidget : w)));
    }

    function saveDashboard() {
        API.post("/dashboard/save", { widgets })
            .then(() => alert("Dashboard Saved"))
            .catch(err => {
                console.error("Save error:", err);
                alert("Error saving dashboard");
            });
    }

    const effectiveWidth = width || 1200;
    const gridGap = effectiveWidth < 768 ? 12 : 16;
    const placeholders = widgets.length % PER_ROW === 0 ? PER_ROW : PER_ROW - (widgets.length % PER_ROW);

    const quickAddItems = [
        { type: "kpi", label: "KPI" },
        { type: "bar", label: "Bar" },
        { type: "line", label: "Line" },
        { type: "area", label: "Area" },
        { type: "pie", label: "Pie" },
        { type: "scatter", label: "Scatter" },
        { type: "table", label: "Table" },
        { type: "date-filter", label: "Date Filter" }
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-transparent">
            <Sidebar addWidget={addWidget} />

            <div className="flex-1 p-2 md:p-4 bg-transparent relative flex flex-col min-w-0" ref={containerRef}>
                <div className="flex-1 overflow-auto min-h-0 overflow-x-hidden">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl font-bold mb-4 text-gray-800"
                    >
                        Configure Dashboard
                    </motion.h1>

                    <div className="min-h-[360px] md:min-h-[600px] border-2 border-dashed rounded-lg p-3 md:p-4 transition-colors relative overflow-hidden border-stone-300 bg-stone-50">
                        {!widgets.length && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-center text-gray-500 py-16 relative z-10"
                            >
                                <p className="text-lg mb-4">No widgets added yet</p>
                                <p>Drag widgets from the left panel or use the Add buttons.</p>
                            </motion.div>
                        )}

                        <div
                            className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-start content-start"
                            style={{ gap: `${gridGap}px` }}
                        >
                            {widgets.map((w, index) => (
                                <div
                                    key={w.i}
                                    className={`bg-white rounded-xl shadow-lg border border-stone-200 relative group hover:shadow-2xl transition-shadow overflow-hidden min-w-0 flex flex-col ${
                                        w.type === "table" ? "h-[420px] md:col-span-2 xl:col-span-4" : "h-64"
                                    }`}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.05 * index }}
                                        className="h-full flex flex-col"
                                    >
                                        <button
                                            onClick={() => deleteWidget(w.i)}
                                            className="absolute top-3 left-3 bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 text-xs rounded shadow-md transition-colors z-30 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActiveWidget(w);
                                            }}
                                            className="absolute top-3 right-3 bg-[#8B5E34] hover:bg-[#6F4726] text-white px-3 py-1 text-xs rounded shadow-md transition-colors z-30 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        >
                                            Settings
                                        </button>

                                        <div className="p-3 h-full w-full flex-1 min-h-0 overflow-hidden">
                                            <WidgetRenderer
                                                widget={w}
                                                data={filteredData}
                                                onDateFilter={(start, end) => {
                                                    if (start && end) {
                                                        const filtered = data.filter(item => {
                                                            const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
                                                            return itemDate >= start && itemDate <= end;
                                                        });
                                                        setFilteredData(filtered);
                                                    } else {
                                                        setFilteredData(data);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            ))}

                            {Array.from({ length: placeholders }).map((_, idx) => {
                                const slotIndex = widgets.length + idx
                                return (
                                    <div
                                        key={`slot-${slotIndex}`}
                                        onClick={() => setActiveAddSlot(activeAddSlot === slotIndex ? null : slotIndex)}
                                        onDragOver={(e) => {
                                            e.preventDefault()
                                            setDragOverIndex(slotIndex)
                                        }}
                                        onDragLeave={() => setDragOverIndex(null)}
                                        onDrop={(e) => {
                                            e.preventDefault()
                                            setDragOverIndex(null)
                                            const widgetType = e.dataTransfer.getData("widgetType")
                                            if (widgetType) addWidget(widgetType)
                                        }}
                                        className={`border-2 border-dashed rounded-xl flex items-center justify-center h-64 text-gray-400 transition-colors cursor-pointer ${
                                            dragOverIndex === slotIndex ? "border-[#8B5E34] bg-[#F4EDE4] text-[#8B5E34]" : "border-stone-300 bg-white"
                                        }`}
                                    >
                                        {activeAddSlot === slotIndex ? (
                                            <div className="grid grid-cols-2 gap-2 p-3 w-full">
                                                {quickAddItems.map((item) => (
                                                    <button
                                                        key={item.type}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            addWidget(item.type)
                                                            setActiveAddSlot(null)
                                                        }}
                                                        className="text-xs px-2 py-1 rounded border border-stone-200 hover:border-[#8B5E34] hover:bg-[#F4EDE4] text-stone-700"
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="text-3xl font-bold">+</div>
                                                <div className="text-xs">Drag or click to add</div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="pt-4 pb-2 bg-transparent">
                    <div className="flex justify-end">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={saveDashboard}
                            className="bg-gradient-to-r from-[#8B5E34] to-[#B08968] hover:from-[#6F4726] hover:to-[#8B5E34] text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            Save Configuration
                        </motion.button>
                    </div>
                </div>

                {activeWidget && (
                    <motion.div
                        initial={{ x: 320, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 320, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed right-0 top-0 z-50 w-full md:w-80 h-full bg-white shadow-2xl overflow-y-auto"
                    >
                        <WidgetSettings
                            widget={activeWidget}
                            onUpdate={updateWidget}
                            onClose={() => setActiveWidget(null)}
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default ConfigureDashboard; 
