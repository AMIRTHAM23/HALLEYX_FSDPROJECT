const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/register', authController.register)
router.post('/login', authController.login)

router.get('/profile', authController.authenticateToken, authController.getProfile)

module.exports = router



// const router = require("express").Router()
// const authController = require("../controllers/authController")

// const {
//     getDashboards,
//     getDashboard,
//     createDashboard,
//     updateDashboard,
//     deleteDashboard,
//     shareDashboard,
//     saveDashboard,
//     loadDashboard
// } = require("../controllers/dashboardController")

// router.get("/", getDashboards)
// router.get("/:id", getDashboard)
// router.post("/", createDashboard)
// router.put("/:id", updateDashboard)
// router.delete("/:id", deleteDashboard)
// router.post("/:id/share", shareDashboard)
// router.post("/save", saveDashboard)
// router.get("/load", loadDashboard)

// module.exports = router

// const router = require("express").Router()

// const {
//     getDashboards,
//     getDashboard,
//     createDashboard,
//     updateDashboard,
//     deleteDashboard,
//     shareDashboard,
//     saveDashboard,
//     loadDashboard
// } = require("../controllers/dashboardController")

// router.get("/load", loadDashboard)
// router.post("/save", saveDashboard)

// router.get("/", getDashboards)
// router.post("/", createDashboard)

// router.get("/:id", getDashboard)
// router.put("/:id", updateDashboard)
// router.delete("/:id", deleteDashboard)
// router.post("/:id/share", shareDashboard)

// module.exports = router


