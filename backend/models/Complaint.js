const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: "Room",
    required: true,
  },
  category: {
    type: String,
    enum: [
      "water",
      "electricity",
      "plumbing",
      "furniture",
      "cleanliness",
      "security",
      "other",
    ],
    required: [true, "Please select a category"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved"],
    default: "pending",
  },
  images: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  },
  resolution: {
    type: String,
  },
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
