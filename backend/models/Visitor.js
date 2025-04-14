const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add visitor name"],
    trim: true,
  },
  idNumber: {
    type: String,
    required: [true, "Please add ID number"],
  },
  phone: {
    type: String,
    required: [true, "Please add visitor phone number"],
  },
  tenant: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  checkInTime: {
    type: Date,
    default: Date.now,
  },
  expectedCheckOutTime: {
    type: Date,
    required: [true, "Please specify expected check-out time"],
  },
  actualCheckOutTime: {
    type: Date,
  },
  purpose: {
    type: String,
    required: [true, "Please specify purpose of visit"],
  },
  status: {
    type: String,
    enum: ["checked-in", "checked-out"],
    default: "checked-in",
  },
  registeredBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Visitor", VisitorSchema);
