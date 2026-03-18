const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const User = require("../models/User")
const Order = require("../models/Order")

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI)

    const passwordAdmin = await bcrypt.hash("admin123", 10)
    const passwordUser = await bcrypt.hash("user123", 10)

    const admin = await User.findOneAndUpdate(
        { email: "admin@example.com" },
        {
            username: "admin",
            email: "admin@example.com",
            password: passwordAdmin,
            role: "admin",
            isActive: true
        },
        { new: true, upsert: true }
    )

    const user = await User.findOneAndUpdate(
        { email: "user@example.com" },
        {
            username: "user",
            email: "user@example.com",
            password: passwordUser,
            role: "user",
            isActive: true
        },
        { new: true, upsert: true }
    )

    const existing = await Order.countDocuments()
    if (existing === 0) {
        await Order.insertMany([
            {
                firstName: "Ava",
                lastName: "Martinez",
                email: "ava.martinez@example.com",
                phone: "555-0191",
                address: "742 Evergreen Terrace",
                city: "Springfield",
                state: "IL",
                country: "United States",
                product: "Fiber Internet 300 Mbps",
                quantity: 2,
                unitPrice: 49.99,
                status: "Pending",
                createdBy: admin._id
            },
            {
                firstName: "Liam",
                lastName: "Nguyen",
                email: "liam.nguyen@example.com",
                phone: "555-0142",
                address: "12 Market Street",
                city: "San Francisco",
                state: "CA",
                country: "United States",
                product: "Business Internet 500 Mbps",
                quantity: 1,
                unitPrice: 129.0,
                status: "In Progress",
                createdBy: admin._id
            },
            {
                firstName: "Noah",
                lastName: "Singh",
                email: "noah.singh@example.com",
                phone: "555-0117",
                address: "88 Lakeview Blvd",
                city: "Austin",
                state: "TX",
                country: "United States",
                product: "5GUnlimited Mobile Plan",
                quantity: 3,
                unitPrice: 39.99,
                status: "Completed",
                createdBy: user._id
            }
        ])
    }

    console.log("Seed complete")
    await mongoose.disconnect()
}

seed().catch(async (err) => {
    console.error(err)
    await mongoose.disconnect()
    process.exit(1)
})
