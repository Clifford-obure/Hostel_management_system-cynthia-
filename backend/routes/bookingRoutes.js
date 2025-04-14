const express = require("express");
const {
  createBooking,
  getBookings,
  getMyBookings,
  getBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("tenant"), createBooking)
  .get(protect, authorize("matron"), getBookings);

router.route("/me").get(protect, authorize("tenant"), getMyBookings);

router
  .route("/:id")
  .get(protect, getBooking)
  .put(protect, authorize("matron"), updateBooking)
  .delete(protect, authorize("matron"), deleteBooking);

module.exports = router;
