const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/reset-password", authController.resetPassword);
router.post("/confirm-email", authController.confirmEmail);
router.post("/logout", authController.logoutUser);

module.exports = router;