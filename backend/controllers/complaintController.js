const Complaint = require("../models/Complaint");
const Room = require("../models/Room");

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Tenant)
exports.createComplaint = async (req, res) => {
  try {
    req.body.tenant = req.user.id;

    // Check if room exists
    const room = await Room.findById(req.body.room);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Room not found",
      });
    }

    // Add images if files were uploaded
    if (req.files) {
      const images = [];
      req.files.forEach((file) => {
        images.push(file.filename);
      });
      req.body.images = images;
    }

    const complaint = await Complaint.create(req.body);

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Matron only)
exports.getComplaints = async (req, res) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Complaint.countDocuments();

    let query = Complaint.find();

    // Filter by status if provided
    if (req.query.status) {
      query = query.find({ status: req.query.status });
    }

    // Filter by category if provided
    if (req.query.category) {
      query = query.find({ category: req.query.category });
    }

    const complaints = await query
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
      count: complaints.length,
      pagination,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get tenant complaints
// @route   GET /api/complaints/me
// @access  Private (Tenant)
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ tenant: req.user.id })
      .populate("room")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate({
        path: "tenant",
        select: "name email phone",
      })
      .populate("room");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: "Complaint not found",
      });
    }

    // Make sure user is complaint owner or matron
    if (
      complaint.tenant._id.toString() !== req.user.id &&
      req.user.role !== "matron"
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this complaint",
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private (Matron only)
exports.updateComplaint = async (req, res) => {
  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: "Complaint not found",
      });
    }

    // If status is changed to resolved, add resolvedAt date
    if (req.body.status === "resolved" && complaint.status !== "resolved") {
      req.body.resolvedAt = Date.now();
    }

    complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
