const User = require("../models/User")

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 })
        res.json({ success: true, users })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { role, isActive } = req.body
        const update = {}
        if (role !== undefined) update.role = role
        if (isActive !== undefined) update.isActive = isActive

        const user = await User.findByIdAndUpdate(req.params.id, update, { new: true })
            .select("-password")
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.json({ success: true, user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
