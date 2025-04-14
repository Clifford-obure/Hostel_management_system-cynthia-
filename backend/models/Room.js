const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, "Please add a room number"],
    unique: true,
    trim: true,
  },
  floor: {
    type: Number,
    required: [true, "Please add a floor number"],
  },
  capacity: {
    type: Number,
    required: [true, "Please specify room capacity"],
    default: 1,
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  status: {
    type: String,
    enum: ["available", "occupied", "maintenance"],
    default: "available",
  },
  amenities: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: ["default-room.jpg"],
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", RoomSchema);
