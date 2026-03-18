const mongoose = require("mongoose")

const dashboardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    widgets: {
        type: Array,
        default: []
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

dashboardSchema.pre('save', function(next) {
    this.updatedAt = new Date()
    next()
})

module.exports = mongoose.model("Dashboard", dashboardSchema)