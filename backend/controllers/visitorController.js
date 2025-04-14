const Visitor = require("../models/Visitor");
const User = require("../models/User");

// @desc    Create new visitor record
// @route   POST /api/visitors
// @access  Private (Matron only)
exports.createVisitor = async (req, res) => {
  try {
    // Add the matron as registeredBy
    req.body.registeredBy = req.user.id;

    // Check if tenant exists
    const tenant = await User.findById(req.body.tenant);

    if (!tenant || tenant.role !== "tenant") {
      return res.status(404).json({
        success: false,
        error: "Tenant not found",
      });
    }

    const visitor = await Visitor.create(req.body);

    res.status(201).json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all visitors
// @route   GET /api/visitors
// @access  Private (Matron only)
exports.getVisitors = async (req, res) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Visitor.countDocuments();

    let query = Visitor.find();

    // Filter by status if provided
    if (req.query.status) {
      query = query.find({ status: req.query.status });
    }

    // Filter by date range if provided
    if (req.query.from && req.query.to) {
      query = query.find({
        checkInTime: {
          $gte: new Date(req.query.from),
          $lte: new Date(req.query.to),
        },
      });
    }

    const visitors = await query
      .populate({
        path: "tenant",
        select: "name email phone",
      })
      .populate({
        path: "registeredBy",
        select: "name",
      })
      .skip(startIndex)
      .limit(limit)
      .sort("-checkInTime");

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
      count: visitors.length,
      pagination,
      data: visitors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get tenant's visitors
// @route   GET /api/visitors/tenant/:tenantId
// @access  Private
exports.getTenantVisitors = async (req, res) => {
  try {
    // Make sure user is accessing their own visitors or is a matron
    if (req.params.tenantId !== req.user.id && req.user.role !== "matron") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access these records",
      });
    }

    const visitors = await Visitor.find({ tenant: req.params.tenantId })
      .populate({
        path: "registeredBy",
        select: "name",
      })
      .sort("-checkInTime");

    res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single visitor
// @route   GET /api/visitors/:id
// @access  Private
exports.getVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate({
        path: "tenant",
        select: "name email phone",
      })
      .populate({
        path: "registeredBy",
        select: "name",
      });

    if (!visitor) {
      return res.status(404).json({
        success: false,
        error: "Visitor record not found",
      });
    }

    // Make sure user is the tenant or matron
    if (
      visitor.tenant._id.toString() !== req.user.id &&
      req.user.role !== "matron"
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this record",
      });
    }

    res.status(200).json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Check out visitor
// @route   PUT /api/visitors/:id/checkout
// @access  Private (Matron only)
exports.checkoutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        error: "Visitor record not found",
      });
    }

    if (visitor.status === "checked-out") {
      return res.status(400).json({
        success: false,
        error: "Visitor already checked out",
      });
    }

    // Update checkout time and status
    visitor.actualCheckOutTime = Date.now();
    visitor.status = "checked-out";

    await visitor.save();

    res.status(200).json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
