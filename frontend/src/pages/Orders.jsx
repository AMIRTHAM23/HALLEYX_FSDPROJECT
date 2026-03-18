import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import API from "../services/api"
import CreateOrderModel from "../components/CreateOrderModel"

function Orders() {

    const [orders, setOrders] = useState([])
    const [open, setOpen] = useState(false)
    const [editOrder, setEditOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [contextMenu, setContextMenu] = useState(null)

    function loadOrders() {
        setLoading(true)
        setError("")

        API.get("/orders")
            .then(res => {
                setOrders(res.data)
            })
            .catch(err => {
                console.error("Error loading orders:", err)
                setError("Failed to load orders")
                setOrders([])
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        loadOrders()
    }, [])

    function deleteOrder(id) {

        if (!window.confirm("Delete this order?")) return

        API.delete(`/orders/${id}`)
            .then(() => {
                loadOrders()
            })

    }

    function openContextMenu(e, order) {
        e.preventDefault()
        const menuWidth = 180
        const menuHeight = 120
        const x = Math.min(e.clientX, window.innerWidth - menuWidth - 8)
        const y = Math.min(e.clientY, window.innerHeight - menuHeight - 8)
        setContextMenu({
            x,
            y,
            order
        })
    }

    return (

        <div className="relative bg-transparent">

            <div className="flex justify-between mb-4">

                <h1 className="text-2xl font-bold">
                    Customer Orders
                </h1>

                <button
                    onClick={() => setOpen(true)}
                    className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700">

                    Create Order

                </button>

            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-20">
                    <div className="text-gray-500">Loading orders...</div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-20">
                    <div className="text-red-500 mb-4">{error}</div>
                    <button
                        onClick={loadOrders}
                        className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Orders Table */}
            {!loading && !error && (
                <div className="w-full bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full table-fixed">

                            <thead>

                                <tr className="bg-gray-200">

                                    <th className="p-2 text-left">Customer</th>
                                    <th className="p-2 text-left">Product</th>
                                    <th className="p-2 text-left">Total</th>
                                    <th className="p-2 text-left">Status</th>
                                    <th className="p-2 text-left">Created By</th>
                                    <th className="p-2 text-left">Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {orders.map(o => (
                                    <motion.tr
                                        key={o._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.05 * orders.indexOf(o) }}
                                        onContextMenu={(e) => openContextMenu(e, o)}
                                        className="border-b"
                                    >

                                        <td className="p-2 whitespace-normal break-words">
                                            {o.firstName} {o.lastName}
                                        </td>

                                        <td className="p-2 whitespace-normal break-words">
                                            {o.product}
                                        </td>

                                        <td className="p-2 whitespace-normal break-words">
                                            ${o.totalAmount}
                                        </td>

                                        <td className="p-2">

                                            <span className={`px-2 py-1 rounded text-white text-sm
${o.status === "Pending" && "bg-yellow-500"}
${o.status === "In Progress" && "bg-blue-500"}
${o.status === "Completed" && "bg-green-600"}
`}>

                                                {o.status}

                                            </span>

                                        </td>

                                        <td className="p-2 whitespace-normal break-words">
                                            {typeof o.createdBy === "string" ? o.createdBy : o.createdBy?.username || "N/A"}
                                        </td>

                                        <td className="p-2">
                                            <button
                                                onClick={(e) => openContextMenu(e, o)}
                                                className="px-2 py-1 rounded border hover:bg-gray-100"
                                                aria-label="Open actions"
                                            >
                                                ...
                                            </button>
                                        </td>

                                    </motion.tr>
                                ))}

                            </tbody>

                        </table>
                    </div>
                </div>
            )}

            {open ? (
                <CreateOrderModel
                    close={() => {
                        setOpen(false)
                        loadOrders()
                    }}
                />
            ) : null}

            {editOrder ? (
                <CreateOrderModel
                    order={editOrder}
                    close={() => {
                        setEditOrder(null)
                        loadOrders()
                    }}
                />
            ) : null}

            {contextMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setContextMenu(null)}
                >
                    <div
                        className="absolute z-50 bg-white rounded-lg shadow-lg border w-40"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="w-full text-left px-3 py-2 hover:bg-gray-50"
                            onClick={() => {
                                setContextMenu(null)
                                setEditOrder(contextMenu.order)
                            }}
                        >
                            Edit
                        </button>
                        <button
                            className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                            onClick={() => {
                                const id = contextMenu.order?._id
                                setContextMenu(null)
                                if (id) deleteOrder(id)
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}

        </div>

    )

}

export default Orders;
