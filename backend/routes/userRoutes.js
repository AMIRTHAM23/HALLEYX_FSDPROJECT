const router = require("express").Router()
const authController = require("../controllers/authController")
const userController = require("../controllers/userController")

router.get("/", authController.authenticateToken, authController.requireAdmin, userController.getUsers)
router.put("/:id", authController.authenticateToken, authController.requireAdmin, userController.updateUser)
router.delete("/:id", authController.authenticateToken, authController.requireAdmin, userController.deleteUser)

module.exports = router
