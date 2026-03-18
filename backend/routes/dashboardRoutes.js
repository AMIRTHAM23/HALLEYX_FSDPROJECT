const router = require("express").Router()
const authController = require("../controllers/authController")

const {
    getDashboards,
    getDashboard,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    shareDashboard,
    saveDashboard,
    loadDashboard
} = require("../controllers/dashboardController")

// specific routes FIRST
router.get("/load", authController.authenticateToken, loadDashboard)
router.post("/save", authController.authenticateToken, saveDashboard)

// normal routes
router.get("/", authController.authenticateToken, getDashboards)
router.get("/:id", authController.authenticateToken, getDashboard)
router.post("/", authController.authenticateToken, createDashboard)
router.put("/:id", authController.authenticateToken, updateDashboard)
router.delete("/:id", authController.authenticateToken, deleteDashboard)
router.post("/:id/share", authController.authenticateToken, shareDashboard)

module.exports = router
