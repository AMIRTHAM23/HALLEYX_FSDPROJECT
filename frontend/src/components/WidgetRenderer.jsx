import { Bar, Line, Pie, Scatter } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js"
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend,
    ChartDataLabels
)

import jsPDF from "jspdf"
import "jspdf-autotable"
import { useMemo, useState } from "react"

function WidgetRenderer({ widget, data, onDateFilter }) {

    const today = useMemo(() => new Date().toISOString().split("T")[0], [])
    const thirtyDaysAgo = useMemo(() => {
        return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    }, [])
    const [range, setRange] = useState("all")
    const [tableFilters, setTableFilters] = useState({
        product: "",
        status: "",
        createdBy: "",
        search: ""
    })
    const safeData = Array.isArray(data) ? data : []
    const hasData = safeData.length > 0

    const fieldMap = {
        "Total amount": "totalAmount",
        "Quantity": "quantity",
        "Unit price": "unitPrice",
        "Product": "product",
        "Status": "status",
        "Created by": "createdBy",
        "City": "city",
        "State": "state",
        "Country": "country",
        "Customer ID": "_id",
        "Customer name": "customerName",
        "Email id": "email",
        "Phone number": "phone",
        "Address": "address",
        "Order ID": "_id",
        "Order date": "createdAt"
    }

    const getFieldValue = (item, field) => {

    // 🛑 SAFETY CHECK
    if (!field) return "Unknown"

    if (field === "Customer name") {
        const first = item?.firstName || ""
        const last = item?.lastName || ""
        return `${first} ${last}`.trim() || "Unknown"
    }

    if (field === "Created by") {
        if (typeof item?.createdBy === "string") return item.createdBy
        return item?.createdBy?.username || item?.createdBy?.name || "Unknown"
    }

    const safeField = field?.toString()?.toLowerCase()?.replace(" ", "")

    const mappedField = fieldMap[field] || safeField

    return item?.[mappedField] ?? item?.[safeField] ?? "Unknown"
}

    const processData = (field) => {
        return safeData.map(o => {
            const val = getFieldValue(o, field)
            if (typeof val === "number") return val
            if (typeof val === "string" && val.trim() !== "" && !Number.isNaN(Number(val))) {
                return Number(val)
            }
            return 0
        })
    }

    if (widget.type === "date-filter") {
        const getRangeDates = (value) => {
            if (value === "today") {
                return { start: today, end: today }
            }
            if (value === "7d") {
                const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
                return { start, end: today }
            }
            if (value === "30d") {
                return { start: thirtyDaysAgo, end: today }
            }
            if (value === "90d") {
                const start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
                return { start, end: today }
            }
            return { start: "", end: "" }
        }

        return (
            <div className="p-4">
                <h3 className="text-gray-600 text-sm mb-2 font-semibold">{widget.title || "Date Filter"}</h3>
                <label className="block text-sm text-gray-600 mb-1">Show data for</label>
                <select
                    className="border p-2 rounded w-full"
                    value={range}
                    onChange={(e) => {
                        const value = e.target.value
                        setRange(value)
                        const { start, end } = getRangeDates(value)
                        if (onDateFilter) onDateFilter(start, end)
                    }}
                >
                    <option value="all">All time</option>
                    <option value="today">Today</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                </select>
            </div>
        )
    }

    if (widget.type === "kpi") {
        const numericMetrics = new Set(["Quantity", "Unit price", "Total amount"])
        const isNumericMetric = numericMetrics.has(widget.metric)

        let value = 0
        const rawData = processData(widget.metric)
        const aggregation = isNumericMetric ? widget.aggregation : "Count"

        switch (aggregation) {
            case "Sum":
                value = rawData.reduce((sum, val) => sum + val, 0)
                break
            case "Average":
                value = rawData.length ? rawData.reduce((sum, val) => sum + val, 0) / rawData.length : 0
                break
            case "Count":
                value = rawData.length
                break
            default:
                value = rawData.reduce((sum, val) => sum + val, 0)
        }

        const formattedValue = widget.dataFormat === "Currency"
            ? `$${value.toFixed(widget.decimalPrecision || 0)}`
            : value.toFixed(widget.decimalPrecision || 0)

        return (
            <div className="text-center p-4">
                <h3 className="text-gray-600 text-sm mb-2">{widget.title || "Untitled"}</h3>
                <h1 className="text-3xl font-bold" style={{ color: widget.color }}>
                    {formattedValue}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    {aggregation} of {widget.metric}
                </p>
            </div>
        )
    }

    let chartData = {}

    if (["bar", "line", "area"].includes(widget.type)) {
        const groupedData = {}
        const xField = widget.xAxis || "Product"
        const yField = widget.yAxis || "Total amount"
        safeData.forEach(item => {
            const xVal = getFieldValue(item, xField)
            const yVal = getFieldValue(item, yField)
            if (!groupedData[xVal]) groupedData[xVal] = []
            groupedData[xVal].push(yVal)
        })

        const aggregatedData = Object.keys(groupedData).map(key => {
            const values = groupedData[key]
            return values.reduce((sum, val) => sum + Number(val || 0), 0)
        })

        chartData = {
            labels: Object.keys(groupedData),
            datasets: [{
                label: yField,
                data: aggregatedData,
                backgroundColor: widget.color,
                borderColor: widget.color
            }]
        }
    }

    if (widget.type === "scatter") {
        const xData = processData(widget.xAxis)

        chartData = {
            datasets: [{
                label: `${widget.xAxis} vs ${widget.yAxis}`,
                data: xData.map((x, i) => ({ x, y: processData(widget.yAxis)[i] })),
                backgroundColor: widget.color
            }]
        }
    }

    if (widget.type === "pie") {
        const groupedData = {}
        safeData.forEach(item => {
            const key = getFieldValue(item, widget.chartData || "Status")
            groupedData[key] = (groupedData[key] || 0) + 1
        })

        chartData = {
            labels: Object.keys(groupedData),
            datasets: [{
                data: Object.values(groupedData),
                backgroundColor: [
                    widget.color,
                    "#B08968",
                    "#DDB892",
                    "#7F5539",
                    "#E6CCB2"
                ]
            }]
        }
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: widget.showLegend !== false
            },
            tooltip: {
                enabled: true
            },
            datalabels: {
                display: widget.showDataLabels === true
            }
        },
        scales: ["bar", "line", "area"].includes(widget.type) ? {
            y: {
                beginAtZero: true
            }
        } : {}
    }

    if (widget.type === "bar") {
        return (
            <div className="h-full w-full">
                <Bar data={chartData} options={chartOptions} />
            </div>
        )
    }

    if (widget.type === "line") {
        return (
            <div className="h-full w-full">
                <Line data={chartData} options={chartOptions} />
            </div>
        )
    }

    if (widget.type === "area") {
        return (
            <div className="h-full w-full">
                <Line data={chartData} options={{ ...chartOptions, fill: true }} />
            </div>
        )
    }

    if (widget.type === "pie") {
        return (
            <div className="h-full w-full">
                <Pie data={chartData} options={chartOptions} />
            </div>
        )
    }

    if (widget.type === "scatter") {
        return (
            <div className="h-full w-full">
                <Scatter data={chartData} options={chartOptions} />
            </div>
        )
    }

    if (widget.type === "table") {
        const visibleColumns = widget.visibleColumns?.length
            ? widget.visibleColumns
            : ["Customer ID", "Customer name", "Email id", "Phone number", "Address", "Order ID", "Order date", "Product", "Quantity", "Unit price", "Total amount", "Status", "Created by"]

        let filteredTableData = safeData
        const createdByOptions = Array.from(new Set(
            safeData.map(o => (typeof o.createdBy === "string" ? o.createdBy : o.createdBy?.username || "")).filter(Boolean)
        ))
        const productOptions = Array.from(new Set(
            safeData.map(o => o.product).filter(Boolean)
        ))

        if (widget.applyFilter) {
            const search = tableFilters.search.trim().toLowerCase()
            filteredTableData = safeData.filter(o => {
                const product = (o.product || "").toLowerCase()
                const status = (o.status || "").toLowerCase()
                const createdBy = (typeof o.createdBy === "string" ? o.createdBy : o.createdBy?.username || "").toLowerCase()
                const name = `${o.firstName || ""} ${o.lastName || ""}`.trim().toLowerCase()
                const matchSearch = !search || [product, status, createdBy, name].some(v => v.includes(search))
                const matchProduct = !tableFilters.product || o.product === tableFilters.product
                const matchStatus = !tableFilters.status || o.status === tableFilters.status
                const matchCreatedBy = !tableFilters.createdBy || (typeof o.createdBy === "string" ? o.createdBy : o.createdBy?.username) === tableFilters.createdBy
                return matchSearch && matchProduct && matchStatus && matchCreatedBy
            })
        }

        let sortedTableData = [...filteredTableData]
        if (widget.sortBy === "Ascending") {
            sortedTableData.sort((a, b) => (a.totalAmount || 0) - (b.totalAmount || 0))
        } else if (widget.sortBy === "Descending") {
            sortedTableData.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
        } else if (widget.sortBy === "Order date") {
            sortedTableData.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        }

        const pageSize = parseInt(widget.pagination, 10) || 10
        const displayData = sortedTableData.slice(0, pageSize)

        const exportToCSV = () => {
            const headers = visibleColumns.join(",")
            const rows = displayData.map(o =>
                visibleColumns.map(col => {
                    let value = ""
                    switch (col) {
                        case "Customer ID": value = o._id || "N/A"; break
                        case "Customer name": value = `${o.firstName || ""} ${o.lastName || ""}`.trim() || "N/A"; break
                        case "Email id": value = o.email || "N/A"; break
                        case "Phone number": value = o.phone || "N/A"; break
                        case "Address": value = `${o.address || ""}, ${o.city || ""}, ${o.state || ""}, ${o.country || ""}`.trim() || "N/A"; break
                        case "Order ID": value = o._id || "N/A"; break
                        case "Order date": value = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "N/A"; break
                        case "Product": value = o.product || "N/A"; break
                        case "Quantity": value = o.quantity || "N/A"; break
                        case "Unit price": value = o.unitPrice ? `$${o.unitPrice}` : "N/A"; break
                        case "Total amount": value = o.totalAmount ? `$${o.totalAmount}` : "N/A"; break
                        case "Status": value = o.status || "N/A"; break
                        case "Created by": value = typeof o.createdBy === "string" ? o.createdBy : o.createdBy?.username || "N/A"; break
                        default: value = ""
                    }
                    return `"${String(value).replace(/"/g, '""')}"`
                }).join(",")
            ).join("\n")

            const csvContent = `${headers}\n${rows}`
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
            const link = document.createElement("a")
            const url = URL.createObjectURL(blob)
            link.setAttribute("href", url)
            link.setAttribute("download", `${widget.title || "table"}_export.csv`)
            link.style.visibility = "hidden"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }

        const exportToPDF = () => {
            const doc = new jsPDF()
            doc.text(widget.title || "Table Export", 14, 20)

            const tableData = displayData.map(o =>
                visibleColumns.map(col => {
                    let value = ""
                    switch (col) {
                        case "Customer ID": value = o._id || "N/A"; break
                        case "Customer name": value = `${o.firstName || ""} ${o.lastName || ""}`.trim() || "N/A"; break
                        case "Email id": value = o.email || "N/A"; break
                        case "Phone number": value = o.phone || "N/A"; break
                        case "Address": value = `${o.address || ""}, ${o.city || ""}, ${o.state || ""}, ${o.country || ""}`.trim() || "N/A"; break
                        case "Order ID": value = o._id || "N/A"; break
                        case "Order date": value = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "N/A"; break
                        case "Product": value = o.product || "N/A"; break
                        case "Quantity": value = o.quantity || "N/A"; break
                        case "Unit price": value = o.unitPrice ? `$${o.unitPrice}` : "N/A"; break
                        case "Total amount": value = o.totalAmount ? `$${o.totalAmount}` : "N/A"; break
                        case "Status": value = o.status || "N/A"; break
                        case "Created by": value = typeof o.createdBy === "string" ? o.createdBy : o.createdBy?.username || "N/A"; break
                        default: value = ""
                    }
                    return value
                })
            )

            doc.autoTable({
                head: [visibleColumns],
                body: tableData,
                startY: 30,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [84, 189, 149] }
            })

            doc.save(`${widget.title || "table"}_export.pdf`)
        }

        return (
            <div className="p-2 h-full flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-gray-600 text-sm font-semibold">{widget.title || "Untitled"}</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={exportToCSV}
                            className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                        >
                            CSV
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
                        >
                            PDF
                        </button>
                    </div>
                </div>
                {widget.applyFilter && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                        <input
                            value={tableFilters.search}
                            onChange={(e) => setTableFilters({ ...tableFilters, search: e.target.value })}
                            placeholder="Search"
                            className="border p-2 rounded text-sm"
                        />
                        <select
                            value={tableFilters.product}
                            onChange={(e) => setTableFilters({ ...tableFilters, product: e.target.value })}
                            className="border p-2 rounded text-sm"
                        >
                            <option value="">All Products</option>
                            {productOptions.map(name => (
                                <option key={name}>{name}</option>
                            ))}
                        </select>
                        <select
                            value={tableFilters.status}
                            onChange={(e) => setTableFilters({ ...tableFilters, status: e.target.value })}
                            className="border p-2 rounded text-sm"
                        >
                            <option value="">All Status</option>
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                        </select>
                        <select
                            value={tableFilters.createdBy}
                            onChange={(e) => setTableFilters({ ...tableFilters, createdBy: e.target.value })}
                            className="border p-2 rounded text-sm"
                        >
                            <option value="">All Owners</option>
                            {createdByOptions.map(name => (
                                <option key={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="flex-1 overflow-auto rounded-md border border-gray-200 scrollbar-hide overflow-x-hidden">
                    <table className="w-full text-sm table-fixed" style={{ fontSize: `${widget.fontSize || 14}px` }}>
                        <thead>
                            <tr style={{ backgroundColor: widget.headerBgColor || "#54bd95" }}>
                                {visibleColumns.map(col => (
                                    <th key={col} className="p-2 text-white text-left whitespace-normal break-words">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {displayData.map(o => (
                                <tr key={o._id} className="border-b">
                                    {visibleColumns.map(col => {
                                        let value = ""
                                        switch (col) {
                                            case "Customer ID": value = o._id || "N/A"; break
                                            case "Customer name": value = `${o.firstName || ""} ${o.lastName || ""}`.trim() || "N/A"; break
                                            case "Email id": value = o.email || "N/A"; break
                                            case "Phone number": value = o.phone || "N/A"; break
                                            case "Address": value = `${o.address || ""}, ${o.city || ""}, ${o.state || ""}, ${o.country || ""}`.trim() || "N/A"; break
                                            case "Order ID": value = o._id || "N/A"; break
                                            case "Order date": value = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "N/A"; break
                                            case "Product": value = o.product || "N/A"; break
                                            case "Quantity": value = o.quantity || "N/A"; break
                                            case "Unit price": value = o.unitPrice ? `$${o.unitPrice}` : "N/A"; break
                                            case "Total amount": value = o.totalAmount ? `$${o.totalAmount}` : "N/A"; break
                                            case "Status": value = o.status || "N/A"; break
                                            case "Created by": value = typeof o.createdBy === "string" ? o.createdBy : o.createdBy?.username || "N/A"; break
                                            default: value = ""
                                        }
                                        return <td key={col} className="p-2 whitespace-normal break-all align-top">{value}</td>
                                    })}
                                </tr>
                            ))}
                            {!displayData.length && (
                                <tr>
                                    <td colSpan={visibleColumns.length} className="p-3 text-center text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    if (!hasData) {
        return <div className="p-4 text-center text-gray-500">No data available</div>
    }

    return <div className="p-4 text-center text-gray-500">Widget type not supported</div>
}

export default WidgetRenderer
