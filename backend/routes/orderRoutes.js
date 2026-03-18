const router = require("express").Router()
const authController = require("../controllers/authController")
const {
    createOrder,
    getOrders,
    deleteOrder,
    updateOrder
} = require("../controllers/orderController")

router.post("/", authController.authenticateToken, createOrder)
router.get("/", authController.authenticateToken, getOrders)
router.delete("/:id", authController.authenticateToken, deleteOrder)
router.put("/:id", authController.authenticateToken, updateOrder)

module.exports = router
