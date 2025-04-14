const express = require("express");
const {
  createComplaint,
  getComplaints,
  getMyComplaints,
  getComplaint,
  updateComplaint,
} = require("../controllers/complaintController");

const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    authorize("tenant"),
    upload.array("images", 3),
    createComplaint
  )
  .get(protect, authorize("matron"), getComplaints);

router.route("/me").get(protect, authorize("tenant"), getMyComplaints);

router
  .route("/:id")
  .get(protect, getComplaint)
  .put(protect, authorize("matron"), updateComplaint);

module.exports = router;
