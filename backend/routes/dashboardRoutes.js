const router = require("express").Router()

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
router.get("/load", loadDashboard)
router.post("/save", saveDashboard)

// normal routes
router.get("/", getDashboards)
router.get("/:id", getDashboard)
router.post("/", createDashboard)
router.put("/:id", updateDashboard)
router.delete("/:id", deleteDashboard)
router.post("/:id/share", shareDashboard)

module.exports = router
