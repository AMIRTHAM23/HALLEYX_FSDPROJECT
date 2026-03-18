import { useState, useEffect, useRef } from "react";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
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

function useElementSize() {
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!ref.current) return;
        const node = ref.current;

        const updateSize = () => {
            const rect = node.getBoundingClientRect();
            setSize({ width: rect.width, height: rect.height });
        };

        updateSize();

        const observer = new ResizeObserver(updateSize);
        observer.observe(node);

        window.addEventListener("resize", updateSize);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateSize);
        };
    }, []);

    return { ref, size };
}

function ConfigureDashboard() {
    const { width, containerRef } = useContainerWidth();
    const { ref: canvasRef, size: canvasSize } = useElementSize();

    const [widgets, setWidgets] = useState([]);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [activeWidget, setActiveWidget] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");

    useEffect(() => {
        API.get("/dashboard/load")
            .then(res => {
                if (Array.isArray(res.data)) {
                    setWidgets(res.data);
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

    function addWidget(type) {
        const maxCols = gridCols;

        let defaultWidth;
        let defaultHeight;

        switch (type) {
            case "kpi":
                defaultWidth = 2;
                defaultHeight = 2;
                break;
            case "bar":
            case "line":
            case "area":
            case "scatter":
                defaultWidth = 5;
                defaultHeight = 5;
                break;
            case "pie":
                defaultWidth = 4;
                defaultHeight = 4;
                break;
            case "table":
                defaultWidth = 4;
                defaultHeight = 4;
                break;
            case "date-filter":
                defaultWidth = 3;
                defaultHeight = 2;
                break;
            default:
                defaultWidth = 3;
                defaultHeight = 3;
        }

        const widgetWidth = Math.min(defaultWidth, maxCols);
        const widget = {
            i: Date.now().toString(),
            x: 0,
            y: Infinity,
            w: widgetWidth,
            h: defaultHeight,
            minW: 1,
            minH: 1,
            type,
            title: type === "date-filter" ? "Date Filter" : type.toUpperCase(),
            color: "#22c55e",
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
        setWidgets([...widgets, widget]);
    }

    function deleteWidget(id) {
        if (!window.confirm("Remove this widget?")) return;
        setWidgets(widgets.filter(w => w.i !== id));
    }

    function updateWidget(updatedWidget) {
        setWidgets(widgets.map(w => w.i === updatedWidget.i ? updatedWidget : w));
    }

    function onDrop(layout, layoutItem, event) {
        const widgetType = event.dataTransfer.getData("widgetType");
        if (widgetType) {
            addWidget(widgetType);
        }
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
    const gridCols = effectiveWidth < 768 ? 4 : effectiveWidth < 996 ? 8 : 12;
    const gridGap = effectiveWidth < 768 ? 8 : 10;
    const gridRowHeight = effectiveWidth < 768 ? 40 : 48;
    const gridPadding = effectiveWidth < 768 ? 12 : 16;
    const gridRows = Math.max(
        8,
        Math.ceil((canvasSize.height + gridGap) / (gridRowHeight + gridGap))
    );

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

                    <div
                        ref={canvasRef}
                    className={`min-h-[360px] md:min-h-[600px] border-2 border-dashed rounded-lg p-3 md:p-4 transition-colors relative overflow-hidden ${
                        isDragOver
                            ? "border-amber-400 bg-amber-50"
                            : "border-stone-300 bg-stone-50 hover:bg-stone-100"
                    }`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        if (currentBreakpoint !== "lg") return;
                        if (!isDragOver) setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOver(false);
                        if (currentBreakpoint !== "lg") return;
                        const widgetType = e.dataTransfer.getData("widgetType");
                        if (widgetType) {
                            addWidget(widgetType);
                        }
                    }}
                    >
                    <div
                        className="absolute inset-0 grid pointer-events-none"
                        style={{
                            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                            gap: `${gridGap}px`,
                            padding: `${gridPadding}px`
                        }}
                        aria-hidden="true"
                    >
                        {Array.from({ length: gridRows * gridCols }).map((_, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-200/70 rounded-md"
                                style={{ height: `${gridRowHeight}px` }}
                            />
                        ))}
                    </div>

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
                        <ResponsiveGridLayout
                            className="layout relative z-10"
                        layouts={{ lg: widgets }}
                        onLayoutChange={(layout) => {
                            if (currentBreakpoint !== "lg") return;
                            const updatedWidgets = widgets.map(widget => {
                                const layoutItem = layout.find(l => l.i === widget.i);
                                return layoutItem ? { ...widget, ...layoutItem } : widget;
                            });
                            setWidgets(updatedWidgets);
                        }}
                        onBreakpointChange={(newBreakpoint) => {
                            setCurrentBreakpoint(newBreakpoint);
                        }}
                        onDrop={onDrop}
                        isDroppable={currentBreakpoint === "lg"}
                        droppingItem={{ i: "__dropping-elem__", w: 1, h: 1 }}
                            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                            cols={{ lg: 12, md: 8, sm: 4, xs: 4, xxs: 4 }}
                            width={width}
                            rowHeight={gridRowHeight}
                            draggableHandle=".drag-handle"
                            compactType={null}
                            preventCollision={false}
                        isResizable={currentBreakpoint === "lg"}
                        resizeHandles={["se", "s", "e"]}
                        isDraggable={currentBreakpoint === "lg"}
                            margin={[gridGap, gridGap]}
                            containerPadding={[gridPadding, gridPadding]}
                        >
                            {widgets.map((w, index) => (
                                <div
                                    key={w.i}
                                className="bg-white rounded-xl shadow-lg border border-stone-200 relative group hover:shadow-2xl transition-shadow overflow-hidden min-w-0 flex flex-col h-full"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.1 * index }}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="drag-handle cursor-move bg-gradient-to-r from-amber-100 via-amber-50 to-stone-100 p-2 text-sm text-center font-semibold border-b tracking-wider">
                                            Drag to Move
                                        </div>

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
                                            className="absolute top-3 right-3 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 text-xs rounded shadow-md transition-colors z-30 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        >
                                            Settings
                                        </button>

                                        <div className="p-3 h-full w-full flex-1 min-h-0">
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
                        </ResponsiveGridLayout>
                    </div>
                </div>

                <div className="pt-4 pb-2 bg-transparent">
                    <div className="flex justify-end">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={saveDashboard}
                            className="bg-gradient-to-r from-amber-600 to-stone-600 hover:from-amber-700 hover:to-stone-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
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
