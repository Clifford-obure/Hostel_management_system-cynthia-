const Room = require("../models/Room");

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
exports.getRooms = async (req, res) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    let query = Room.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Room.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const rooms = await query;

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
      count: rooms.length,
      pagination,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Matron only)
exports.createRoom = async (req, res) => {
  try {
    // Add images if files were uploaded
    if (req.files) {
      const images = [];
      req.files.forEach((file) => {
        images.push(file.filename);
      });
      req.body.images = images;
    }

    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Matron only)
exports.updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Room not found",
      });
    }

    // Add new images if files were uploaded
    if (req.files && req.files.length > 0) {
      const newImages = [];
      req.files.forEach((file) => {
        newImages.push(file.filename);
      });

      // Combine existing and new images
      if (req.body.keepExistingImages !== "false") {
        req.body.images = [...room.images, ...newImages];
      } else {
        req.body.images = newImages;
      }
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Matron only)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Room not found",
      });
    }

    await room.remove();

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
