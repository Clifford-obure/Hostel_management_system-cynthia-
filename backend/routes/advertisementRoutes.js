const express = require("express");
const {
  createAdvertisement,
  getAdvertisements,
  getMyAdvertisements,
  getAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
} = require("../controllers/advertisementController");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router
  .route("/")
  .post(protect, upload.array("images", 5), createAdvertisement)
  .get(getAdvertisements);

router.route("/me").get(protect, getMyAdvertisements);

router
  .route("/:id")
  .get(getAdvertisement)
  .put(protect, upload.array("images", 5), updateAdvertisement)
  .delete(protect, deleteAdvertisement);

module.exports = router;
