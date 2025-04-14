const express = require("express");
const {
  createVisitor,
  getVisitors,
  getTenantVisitors,
  getVisitor,
  checkoutVisitor,
} = require("../controllers/visitorController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("matron"), createVisitor)
  .get(protect, authorize("matron"), getVisitors);

router.route("/tenant/:tenantId").get(protect, getTenantVisitors);

router.route("/:id").get(protect, getVisitor);

router
  .route("/:id/checkout")
  .put(protect, authorize("matron"), checkoutVisitor);

module.exports = router;
