const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const orderRoutes = require("./routes/orderRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
        console.log("MongoDB connection error:", err)
        process.exit(1)
    })

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

app.use("/api/orders", orderRoutes)
app.use("/api/dashboard", dashboardRoutes)

const PORT = 5000

app.listen(PORT, () => {
    console.log("Server running on port", PORT)
}).on('error', (err) => {
    console.log("Server error:", err)
    process.exit(1)
})
