const Order = require("../models/Order")

exports.createOrder = async (req, res) => {

    try {

        const data = req.body

        data.totalAmount = data.quantity * data.unitPrice

        const order = await Order.create(data)

        res.json(order)

    }

    catch (err) {

        res.status(500).json(err)

    }

}

exports.getOrders = async (req, res) => {

    try {
        let query = {}
        const { filter, status, startDate, endDate } = req.query

        if (filter || startDate || endDate) {
            query.createdAt = {}

            if (filter) {
                const now = new Date()
                switch (filter) {
                    case 'today':
                        query.createdAt.$gte = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                        break
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                        query.createdAt.$gte = weekAgo
                        break
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                        query.createdAt.$gte = monthAgo
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

        const orders = await Order.find(query).populate('createdBy', 'username').sort({ createdAt: -1 })
        res.json(orders)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.deleteOrder = async (req, res) => {

    await Order.findByIdAndDelete(req.params.id)

    res.json("Deleted")

}

exports.updateOrder = async (req, res) => {

    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.json(order)

} 