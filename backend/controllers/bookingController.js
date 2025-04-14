const Booking = require("../models/Booking");
const Room = require("../models/Room");

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Tenant)
exports.createBooking = async (req, res) => {
  try {
    req.body.tenant = req.user.id;

    // Check if room exists and is available
    const room = await Room.findById(req.body.room);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Room not found",
      });
    }

    if (room.status !== "available") {
      return res.status(400).json({
        success: false,
        error: "Room is not available for booking",
      });
    }

    // Calculate total amount
    const totalAmount = room.price * req.body.duration;
    req.body.totalAmount = totalAmount;

    // Create booking
    const booking = await Booking.create(req.body);

    // Update room status to occupied
    await Room.findByIdAndUpdate(req.body.room, { status: "occupied" });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Matron only)
exports.getBookings = async (req, res) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Booking.countDocuments();

    // Get bookings with tenant and room details
    const bookings = await Booking.find()
      .populate({
        path: "tenant",
        select: "name email phone",
      })
      .populate("room")
      .skip(startIndex)
      .limit(limit)
      .sort("-createdAt");

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      pagination,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get tenant bookings
// @route   GET /api/bookings/me
// @access  Private (Tenant)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user.id })
      .populate("room")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: "tenant",
        select: "name email phone",
      })
      .populate("room");

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // Make sure user is booking owner or matron
    if (
      booking.tenant._id.toString() !== req.user.id &&
      req.user.role !== "matron"
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this booking",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Matron only)
exports.updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // Update booking
    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // If booking is cancelled, make room available again
    if (req.body.status === "cancelled" || req.body.status === "completed") {
      await Room.findByIdAndUpdate(booking.room, { status: "available" });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Matron only)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // Make room available again
    await Room.findByIdAndUpdate(booking.room, { status: "available" });

    await booking.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
