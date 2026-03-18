import { useState, useEffect } from "react";

const numericMetrics = new Set(["Quantity", "Unit price", "Total amount"]);

function WidgetSettings({ widget, onUpdate, onClose }) {
    const [title, setTitle] = useState("");
    const [width, setWidth] = useState(3);
    const [height, setHeight] = useState(3);
    const [color, setColor] = useState("#8B5E34");
    const [columns, setColumns] = useState([]);
    const [visibleColumns, setVisibleColumns] = useState([]);

    const [metric, setMetric] = useState("Total amount");
    const [aggregation, setAggregation] = useState("Sum");
    const [dataFormat, setDataFormat] = useState("Number");
    const [decimalPrecision, setDecimalPrecision] = useState(0);

    const [xAxis, setXAxis] = useState("Product");
    const [yAxis, setYAxis] = useState("Total amount");
    const [showDataLabels, setShowDataLabels] = useState(false);


    const [sortBy, setSortBy] = useState("Order date");
    const [pagination, setPagination] = useState("10");
    const [applyFilter, setApplyFilter] = useState(false);

   
    const [chartData, setChartData] = useState("Product");
    const [showLegend, setShowLegend] = useState(true);

    
    const [fontSize, setFontSize] = useState(14);
    const [headerBgColor, setHeaderBgColor] = useState("#54bd95");

    useEffect(() => {
        if (widget) {
            setTitle(widget.title || "");
             
            setWidth(widget.w || 3);
             
            setHeight(widget.h || 3);
             
            setColor(widget.color || "#8B5E34");

            if (widget.type === "kpi") {
                setMetric(widget.metric || "Total amount");
                setAggregation(widget.aggregation || "Sum");
                setDataFormat(widget.dataFormat || "Number");
                setDecimalPrecision(widget.decimalPrecision || 0);
            }

            if (["bar", "line", "area", "scatter"].includes(widget.type)) {
                setXAxis(widget.xAxis || "Product");
                setYAxis(widget.yAxis || "Total amount");
                setShowDataLabels(widget.showDataLabels || false);
            }

            if (widget.type === "pie") {
                setChartData(widget.chartData || "Product");
                setShowLegend(widget.showLegend !== false);
            }

            if (widget.type === "table") {
                const cols = widget.columns || ["Customer ID", "Customer name", "Email id", "Phone number", "Address", "Order ID", "Order date", "Product", "Quantity", "Unit price", "Total amount", "Status", "Created by"];
                setColumns(cols);
                setVisibleColumns(widget.visibleColumns || cols);
                setSortBy(widget.sortBy || "Order date");
                setPagination(widget.pagination || "10");
                setApplyFilter(widget.applyFilter || false);
                setFontSize(widget.fontSize || 14);
                setHeaderBgColor(widget.headerBgColor || "#54bd95");
            }
        }
    }, [widget]);

    useEffect(() => {
        if (widget?.type !== "kpi") return;
        if (!numericMetrics.has(metric)) {
            setAggregation("Count");
        }
    }, [metric, widget]);

    function saveSettings() {
        const isNumericMetric = numericMetrics.has(metric);
        const updatedWidget = {
            ...widget,
            title,
            w: Number(width),
            h: Number(height),
            color
        };

        if (widget.type === "kpi") {
            updatedWidget.metric = metric;
            updatedWidget.aggregation = isNumericMetric ? aggregation : "Count";
            updatedWidget.dataFormat = dataFormat;
            updatedWidget.decimalPrecision = decimalPrecision;
        }

        if (["bar", "line", "area", "scatter"].includes(widget.type)) {
            updatedWidget.xAxis = xAxis;
            updatedWidget.yAxis = yAxis;
            updatedWidget.showDataLabels = showDataLabels;
        }

        if (widget.type === "pie") {
            updatedWidget.chartData = chartData;
            updatedWidget.showLegend = showLegend;
        }

        if (widget.type === "table") {
            updatedWidget.visibleColumns = visibleColumns;
            updatedWidget.sortBy = sortBy;
            updatedWidget.pagination = pagination;
            updatedWidget.applyFilter = applyFilter;
            updatedWidget.fontSize = fontSize;
            updatedWidget.headerBgColor = headerBgColor;
        }

        onUpdate(updatedWidget);
        onClose();
    }

    function toggleColumn(col) {
        if (visibleColumns.includes(col)) {
            setVisibleColumns(visibleColumns.filter(c => c !== col));
        } else {
            setVisibleColumns([...visibleColumns, col]);
        }
    }

    if (!widget) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 z-50 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Widget Settings ({widget.type})</h2>

            <label className="block mt-2">Widget title</label>
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="border p-2 w-full rounded"
                placeholder="Untitled"
            />

            <label className="block mt-2">Description</label>
            <textarea
                className="border p-2 w-full rounded"
                rows="2"
                placeholder="Optional description"
            />

            <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                    <label className="block">Width (Columns)</label>
                    <input
                        type="number"
                        value={width}
                        min={1}
                        max={12}
                        onChange={e => setWidth(Number(e.target.value))}
                        className="border p-2 w-full rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                        disabled
                    />
                </div>
                <div>
                    <label className="block">Height (Rows)</label>
                    <input
                        type="number"
                        value={height}
                        min={1}
                        onChange={e => setHeight(Number(e.target.value))}
                        className="border p-2 w-full rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                        disabled
                    />
                </div>
            </div>

            {widget.type === "kpi" && (
                <>
                    <label className="block mt-4 font-semibold">Data Settings</label>
                    <select
                        value={metric}
                        onChange={e => setMetric(e.target.value)}
                        className="border p-2 w-full rounded mt-1"
                    >
                        <option>Customer ID</option>
                        <option>Customer name</option>
                        <option>Email id</option>
                        <option>Address</option>
                        <option>City</option>
                        <option>State</option>
                        <option>Country</option>
                        <option>Order date</option>
                        <option>Product</option>
                        <option>Created by</option>
                        <option>Status</option>
                        <option>Total amount</option>
                        <option>Unit price</option>
                        <option>Quantity</option>
                    </select>

                    <select
                        value={aggregation}
                        onChange={e => setAggregation(e.target.value)}
                        className="border p-2 w-full rounded mt-1"
                        disabled={!numericMetrics.has(metric)}
                    >
                        <option>Sum</option>
                        <option>Average</option>
                        <option>Count</option>
                    </select>

                    <select
                        value={dataFormat}
                        onChange={e => setDataFormat(e.target.value)}
                        className="border p-2 w-full rounded mt-1"
                    >
                        <option>Number</option>
                        <option>Currency</option>
                    </select>

                    <input
                        type="number"
                        value={decimalPrecision}
                        min={0}
                        // onChange={e => setDecimalPrecision(e.target.value)}
                        onChange={e => setDecimalPrecision(Number(e.target.value))}
                        className="border p-2 w-full rounded mt-1"
                        placeholder="Decimal Precision"
                    />
                </>
            )}

            {["bar", "line", "area", "scatter"].includes(widget.type) && (
                <>
                    <label className="block mt-4 font-semibold">Data Settings</label>
                    <select
                        value={xAxis}
                        onChange={e => setXAxis(e.target.value)}
                        className="border p-2 w-full rounded mt-1"
                    >
                        <option>Product</option>
                        <option>Quantity</option>
                        <option>Unit price</option>
                        <option>Total amount</option>
                        <option>Status</option>
                        <option>Created by</option>
                        <option>City</option>
                        <option>State</option>
                        <option>Country</option>
                    </select>

                    <select
                        value={yAxis}
                        onChange={e => setYAxis(e.target.value)}
                        className="border p-2 w-full rounded mt-1"
                    >
                        <option>Product</option>
                        <option>Quantity</option>
                        <option>Unit price</option>
                        <option>Total amount</option>
                        <option>Status</option>
                        <option>Created by</option>
                        <option>City</option>
                        <option>State</option>
                        <option>Country</option>
                    </select>

                    <label className="block mt-4 font-semibold">Styling</label>
                    <input
                        type="color"
                        value={color}
                        onChange={e => setColor(e.target.value)}
                        className="border p-1 w-full rounded h-10"
                    />

                    <label className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            checked={showDataLabels}
                            onChange={e => setShowDataLabels(e.target.checked)}
                            className="mr-2"
                        />
                        Show data labels
                    </label>
                </>
            )}

            {widget.type === "pie" && (
                <>
                    <label className="block mt-4 font-semibold">Data Settings</label>
                    <select
                        value={chartData}
                        onChange={e => setChartData(e.target.value)}
                        className="border p-2 w-full rounded mt-1"
                    >
                        <option>Product</option>
                        <option>Quantity</option>
                        <option>Unit price</option>
                        <option>Total amount</option>
                        <option>Status</option>
                        <option>Created by</option>
                        <option>City</option>
                        <option>State</option>
                        <option>Country</option>
                    </select>

                    <label className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            checked={showLegend}
                            onChange={e => setShowLegend(e.target.checked)}
                            className="mr-2"
                        />
                        Show legend
                    </label>
                </>
            )}

            {widget.type === "table" && (
                <>
                    <label className="block mt-4 font-semibold">Data Settings</label>
                    <label className="block mt-2">Choose columns</label>
                    {columns.map(col => (
                        <div key={col} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={visibleColumns.includes(col)}
                                onChange={() => toggleColumn(col)}
                            />
                            <span>{col}</span>
                        </div>
                    ))}

                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="border p-2 w-full rounded mt-2"
                    >
                        <option>Ascending</option>
                        <option>Descending</option>
                        <option>Order date</option>
                    </select>

                    <select
                        value={pagination}
                        onChange={e => setPagination(e.target.value)}
                        className="border p-2 w-full rounded mt-1"
                    >
                        <option>5</option>
                        <option>10</option>
                        <option>15</option>
                    </select>

                    <label className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            checked={applyFilter}
                            onChange={e => setApplyFilter(e.target.checked)}
                            className="mr-2"
                        />
                        Apply filter
                    </label>

                    <label className="block mt-4 font-semibold">Styling</label>
                    <input
                        type="number"
                        value={fontSize}
                        min={12}
                        max={18}
                       onChange={e => setFontSize(Number(e.target.value))}
                        className="border p-2 w-full rounded mt-1"
                        placeholder="Font size"
                    />

                    <input
                        type="color"
                        value={headerBgColor}
                        onChange={e => setHeaderBgColor(e.target.value)}
                        className="border p-1 w-full rounded h-10 mt-1"
                    />
                </>
            )}

            <div className="flex justify-end gap-2 mt-4">
                <button
                    onClick={onClose}
                    className="border px-4 py-2 rounded text-gray-700"
                >
                    Cancel
                </button>
                <button
                    onClick={saveSettings}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export default WidgetSettings;
