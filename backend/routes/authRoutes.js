const express = require("express");
const {
  register,
  login,
  getMe,
  getTenants,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/tenants", protect, getTenants);
router.get("/me", protect, getMe);

module.exports = router;
