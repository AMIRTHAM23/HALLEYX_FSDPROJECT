const Order = require("../models/Order")

exports.createOrder = async (req, res) => {
    try {
        const data = req.body
        const userId = req.user.userId

        const order = await Order.create({
            ...data,
            createdBy: userId
        })

        const populated = await Order.findById(order._id).populate('createdBy', 'username email role')
        res.status(201).json(populated)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.getOrders = async (req, res) => {
    try {
        let query = {}
        const { filter, status, startDate, endDate } = req.query
        const userRole = req.user.role
        const userId = req.user.userId

        if (userRole !== "admin") {
            query.createdBy = userId
        }

        if (filter || startDate || endDate) {
            query.createdAt = {}

            if (filter) {
                const now = new Date()
                switch (filter) {
                    case 'today':
                        query.createdAt.$gte = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                        break
                    case 'week':
                        query.createdAt.$gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                        break
                    case 'month':
                        query.createdAt.$gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                        break
                    case 'quarter':
                        query.createdAt.$gte = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
                        break
                    case 'all':
                    default:
                        delete query.createdAt
                        break
                }
            }

            if (startDate) {
                query.createdAt = query.createdAt || {}
                query.createdAt.$gte = new Date(startDate)
            }

            if (endDate) {
                query.createdAt = query.createdAt || {}
                query.createdAt.$lte = new Date(endDate)
            }

            if (query.createdAt && Object.keys(query.createdAt).length === 0) {
                delete query.createdAt
            }
        }

        if (status && status !== 'all') {
            query.status = status
        }

        const orders = await Order.find(query)
            .populate('createdBy', 'username email role')
            .sort({ createdAt: -1 })
        res.json(orders)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const userRole = req.user.role
        const userId = req.user.userId
        const query = userRole === "admin"
            ? { _id: req.params.id }
            : { _id: req.params.id, createdBy: userId }

        const deleted = await Order.findOneAndDelete(query)
        if (!deleted) {
            return res.status(404).json({ error: "Order not found or access denied" })
        }

        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.updateOrder = async (req, res) => {
    try {
        const userRole = req.user.role
        const userId = req.user.userId
        const query = userRole === "admin"
            ? { _id: req.params.id }
            : { _id: req.params.id, createdBy: userId }

        const updated = await Order.findOne(query)
        if (!updated) {
            return res.status(404).json({ error: "Order not found or access denied" })
        }

        const { createdBy, ...safeBody } = req.body
        Object.assign(updated, safeBody)
        if (req.body.quantity !== undefined || req.body.unitPrice !== undefined) {
            const qty = Number(updated.quantity || 0)
            const price = Number(updated.unitPrice || 0)
            updated.totalAmount = qty * price
        }

        await updated.save()

        const populated = await Order.findById(updated._id).populate('createdBy', 'username email role')
        res.json(populated)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
