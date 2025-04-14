const express = require("express");
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router
  .route("/")
  .get(getRooms)
  .post(protect, authorize("matron"), upload.array("images", 5), createRoom);

router
  .route("/:id")
  .get(getRoom)
  .put(protect, authorize("matron"), upload.array("images", 5), updateRoom)
  .delete(protect, authorize("matron"), deleteRoom);

module.exports = router;
