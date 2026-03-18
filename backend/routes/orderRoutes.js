const router = require("express").Router()

const {
    createOrder,
    getOrders,
    deleteOrder,
    updateOrder
} = require("../controllers/orderController")

router.post("/", createOrder)
router.get("/", getOrders)
router.delete("/:id", deleteOrder)
router.put("/:id", updateOrder)

module.exports = router