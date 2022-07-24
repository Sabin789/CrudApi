const express = require("express")
const router = express.Router()
const UserController = require("./controllers/userControllers")

router.get("/", UserController.showHomePage)
router.post("/create", UserController.createNewUser)
router.post("/edit/:id", UserController.userLoggedIn, UserController.editUser)
router.post("/update/:id", UserController.updateDocById)
router.post("/delete/:id",UserController.userLoggedIn, UserController.deleteUser)

router.post("/login", UserController.loginUser)
router.post("/logout", UserController.logoutUser)
router.post("/follow/:id",UserController.followUser)

module.exports = router;
