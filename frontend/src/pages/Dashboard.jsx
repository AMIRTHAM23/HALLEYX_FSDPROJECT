import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Responsive as ResponsiveGridLayout } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import FilterBar from "../components/FilterBar"
import WidgetRenderer from "../components/WidgetRenderer"
import DashboardSelector from "../components/DashboardSelector"
import API from "../services/api"

function useContainerWidth() {
    const containerRef = useRef(null)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        if (!containerRef.current) return
        const node = containerRef.current

        const updateWidth = () => {
            const nextWidth = node.getBoundingClientRect().width
            setWidth(nextWidth)
        }

        updateWidth()

        const observer = new ResizeObserver(updateWidth)
        observer.observe(node)

        window.addEventListener("resize", updateWidth)
        return () => {
            observer.disconnect()
            window.removeEventListener("resize", updateWidth)
        }
    }, [])

    return { width, containerRef }
}

function Dashboard() {

    const { width, containerRef } = useContainerWidth()

    const [currentDashboard, setCurrentDashboard] = useState(null)
    const [widgets, setWidgets] = useState([])
    const [data, setData] = useState([])
    const [filter, setFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        loadDefaultDashboard()
    }, [])

    const loadDefaultDashboard = async () => {
        try {
            setLoading(true)
            setError("")
            const response = await API.get("/dashboard")
            if (response.data.success && response.data.dashboards.length > 0) {
                const defaultDashboard = response.data.dashboards[0]
                setCurrentDashboard(defaultDashboard)
                setWidgets(defaultDashboard.widgets || [])
            }
        } catch (error) {
            console.error("Error loading dashboards:", error)
            setError("Failed to load dashboard")
        } finally {
            setLoading(false)
        }
    }

    const handleDashboardChange = (dashboard) => {
        setCurrentDashboard(dashboard)
        setWidgets(dashboard.widgets || [])
    }

    const handleCreateDashboard = (dashboard) => {
        setCurrentDashboard(dashboard)
        setWidgets(dashboard.widgets || [])
    }

    useEffect(() => {

        const params = new URLSearchParams()

        if (filter !== "all") params.append("filter", filter)
        if (statusFilter !== "all") params.append("status", statusFilter)
        if (startDate) params.append("startDate", startDate)
        if (endDate) params.append("endDate", endDate)

        const queryString = params.toString()
        const url = queryString ? `/orders?${queryString}` : "/orders"

        API.get(url)
            .then(res => {
                setData(res.data)
                setError("")
            })
            .catch(err => {
                console.log("API error:", err)
                setData([])
                setError("Failed to load order data")
            })

    }, [filter, statusFilter, startDate, endDate])

    useEffect(() => {

        const interval = setInterval(() => {

            const params = new URLSearchParams()

            if (filter !== "all") params.append("filter", filter)
            if (statusFilter !== "all") params.append("status", statusFilter)
            if (startDate) params.append("startDate", startDate)
            if (endDate) params.append("endDate", endDate)

            const queryString = params.toString()
            const url = queryString ? `/orders?${queryString}` : "/orders"

            API.get(url)
                .then(res => {
                    setData(res.data)
                })
                .catch(err => {
                    console.log("Real-time update error:", err)
                })

        }, 30000)

        return () => clearInterval(interval)

    }, [filter, statusFilter, startDate, endDate])

    const effectiveWidth = width || 1200
    const gridCols = effectiveWidth < 768 ? 4 : effectiveWidth < 996 ? 8 : 12
    const gridGap = effectiveWidth < 768 ? 8 : 10
    const gridRowHeight = effectiveWidth < 768 ? 40 : 55
    const gridPadding = effectiveWidth < 768 ? 12 : 16

    return (

        <div className="p-2 md:p-4 bg-transparent min-h-screen overflow-x-hidden" ref={containerRef}>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">

                <h1 className="text-2xl font-bold">
                    Dashboard
                </h1>

                <DashboardSelector
                    currentDashboard={currentDashboard}
                    onDashboardChange={handleDashboardChange}
                    onCreateDashboard={handleCreateDashboard}
                />

            </div>

            <FilterBar
                filter={filter}
                setFilter={setFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
            />

            {/* Loading State */}
            {loading && (
                <div className="text-center mt-20">
                    <div className="text-gray-500">Loading dashboard...</div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center mt-20">
                    <div className="text-red-500 mb-4">{error}</div>
                    <button
                        onClick={loadDefaultDashboard}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* No Widgets State */}
            {!loading && !error && widgets.length === 0 && (
                <div className="text-center mt-20 text-gray-500">
                    <div className="mb-4">
                        No widgets configured.
                        <br />
                        Create your personalized dashboard.
                    </div>
                    <Link
                        to="/configure"
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors inline-block"
                    >
                        Configure Dashboard
                    </Link>
                </div>
            )}

            {/* Widgets Grid */}
            {!loading && !error && widgets.length > 0 && (
                <ResponsiveGridLayout
                    className="layout"
                    layouts={{ lg: widgets }}
                    cols={{ lg: 12, md: 8, sm: 4, xs: 4, xxs: 4 }}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    rowHeight={gridRowHeight}
                    width={width || 1200}
                    compactType={null}
                    preventCollision={false}
                    isDraggable={false}
                    isResizable={false}
                    margin={[gridGap, gridGap]}
                    containerPadding={[gridPadding, gridPadding]}
                >

                 {widgets.map((w, index) => (
                    <div
                        key={w.i}
                        className="bg-white shadow rounded-lg border p-3 min-w-0 flex flex-col h-full"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="h-full flex flex-col"
                        >
                            <WidgetRenderer
                                widget={w}
                                data={data}
                                onDateFilter={(start, end) => {
                                    setStartDate(start)
                                    setEndDate(end)
                                }}
                            />
                        </motion.div>
                    </div>
                ))}

                </ResponsiveGridLayout>
            )}

        </div>

    )

}

export default Dashboard 
