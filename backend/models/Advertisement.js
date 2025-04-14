const mongoose = require("mongoose");

const AdvertisementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [50, "Title cannot be more than 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  price: {
    type: Number,
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
  },
  images: {
    type: [String],
    default: [],
  },
  contactInfo: {
    type: String,
    required: [true, "Please add contact information"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Advertisement", AdvertisementSchema);
