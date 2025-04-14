const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.ObjectId,
    ref: "Room",
    required: true,
  },
  tenant: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  checkInDate: {
    type: Date,
    required: [true, "Please add a check-in date"],
  },
  duration: {
    type: Number, // Duration in months
    required: [true, "Please specify duration"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
