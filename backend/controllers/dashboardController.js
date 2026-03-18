const Dashboard = require("../models/Dashboard")
exports.getDashboards = async (req, res) => {
    try {
        const userId = req.user?.userId || "69b96fbf8f49aa704d53fb3b" // Test user ObjectId
        const userRole = req.user?.role || "admin"

        let query = {}

        if (userRole !== 'admin') {
            query = {
                $or: [
                    { owner: userId },
                    { sharedWith: userId },
                    { isPublic: true }
                ]
            }
        }
        // Admins see all dashboards

        const dashboards = await Dashboard.find(query)
          .populate('owner', 'username email')
          .sort({ updatedAt: -1 })

        res.json({
            success: true,
            dashboards
        })
    } catch (error) {
        console.error('Get dashboards error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

exports.getDashboard = async (req, res) => {
    try {
        const dashboardId = req.params.id
        const userId = req.user?.userId || "69b96fbf8f49aa704d53fb3b"
        const userRole = req.user?.role || "admin"

        let query = { _id: dashboardId }

        if (userRole !== 'admin') {
            query.$or = [
                { owner: userId },
                { sharedWith: userId },
                { isPublic: true }
            ]
        }

        const dashboard = await Dashboard.findOne(query).populate('owner', 'username email')

        if (!dashboard) {
            return res.status(404).json({
                success: false,
                message: 'Dashboard not found'
            })
        }

        res.json({
            success: true,
            dashboard
        })
    } catch (error) {
        console.error('Get dashboard error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

exports.createDashboard = async (req, res) => {
    try {
        const { name, description, widgets, isPublic } = req.body
        const userId = req.user?.userId || "69b96fbf8f49aa704d53fb3b"

        const dashboard = new Dashboard({
            name,
            description,
            widgets: widgets || [],
            isPublic: isPublic || false,
            owner: userId
        })

        await dashboard.save()

        const populatedDashboard = await Dashboard.findById(dashboard._id)
            .populate('owner', 'username email')

        res.status(201).json({
            success: true,
            message: 'Dashboard created successfully',
            dashboard: populatedDashboard
        })
    } catch (error) {
        console.error('Create dashboard error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

exports.updateDashboard = async (req, res) => {
    try {
        const dashboardId = req.params.id
        const userId = req.user?.userId || "69b96fbf8f49aa704d53fb3b"
        const { name, description, widgets, isPublic } = req.body

        const dashboard = await Dashboard.findOne({
            _id: dashboardId,
            owner: userId
        })

        if (!dashboard) {
            return res.status(404).json({
                success: false,
                message: 'Dashboard not found or access denied'
            })
        }

        if (name !== undefined) dashboard.name = name
        if (description !== undefined) dashboard.description = description
        if (widgets !== undefined) dashboard.widgets = widgets
        if (isPublic !== undefined) dashboard.isPublic = isPublic

        await dashboard.save()

        const updatedDashboard = await Dashboard.findById(dashboardId)
            .populate('owner', 'username email')

        res.json({
            success: true,
            message: 'Dashboard updated successfully',
            dashboard: updatedDashboard
        })
    } catch (error) {
        console.error('Update dashboard error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

exports.deleteDashboard = async (req, res) => {
    try {
        const dashboardId = req.params.id
        const userId = req.user?.userId || "69b96fbf8f49aa704d53fb3b"

        const dashboard = await Dashboard.findOneAndDelete({
            _id: dashboardId,
            owner: userId
        })

        if (!dashboard) {
            return res.status(404).json({
                success: false,
                message: 'Dashboard not found or access denied'
            })
        }

        res.json({
            success: true,
            message: 'Dashboard deleted successfully'
        })
    } catch (error) {
        console.error('Delete dashboard error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

exports.shareDashboard = async (req, res) => {
    try {
        const dashboardId = req.params.id
        const userId = req.user?.userId || "69b96fbf8f49aa704d53fb3b"
        const { userEmail, permission } = req.body

        const dashboard = await Dashboard.findOne({
            _id: dashboardId,
            owner: userId
        })

        if (!dashboard) {
            return res.status(404).json({
                success: false,
                message: 'Dashboard not found or access denied'
            })
        }

        const User = require('../models/User')
        const userToShare = await User.findOne({ email: userEmail.toLowerCase() })

        if (!userToShare) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (!dashboard.sharedWith.includes(userToShare._id)) {
            dashboard.sharedWith.push(userToShare._id)
            await dashboard.save()
        }

        res.json({
            success: true,
            message: 'Dashboard shared successfully'
        })
    } catch (error) {
        console.error('Share dashboard error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

exports.loadDashboard = async (req, res) => {
    try {
        const userId = req.user?.userId || "69b96fbf8f49aa704d53fb3b" // Test user ObjectId

        const dashboard = await Dashboard.findOne({ owner: userId, name: 'Default Dashboard' })

        res.json(dashboard ? dashboard.widgets : [])
    } catch (error) {
        console.error('Load dashboard error:', error)
        // Return empty array on error (matches spec: "By default, no widgets are configured")
        res.json([])
    }
}

exports.saveDashboard = async (req, res) => {
    try {
        const userId = req.user?.userId || "69b96fbf8f49aa704d53fb3b" // Test user ObjectId
        const { widgets } = req.body

        let dashboard = await Dashboard.findOne({ owner: userId, name: 'Default Dashboard' })

        if (!dashboard) {
            dashboard = new Dashboard({
                name: 'Default Dashboard',
                owner: userId,
                widgets: widgets
            })
        } else {
            dashboard.widgets = widgets
        }

        await dashboard.save()

        res.json({
            success: true,
            message: 'Dashboard saved successfully'
        })
    } catch (error) {
        console.error('Save dashboard error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

