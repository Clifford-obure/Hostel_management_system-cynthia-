const Advertisement = require("../models/Advertisement");

// @desc    Create new advertisement
// @route   POST /api/advertisements
// @access  Private
exports.createAdvertisement = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Add images if files were uploaded
    if (req.files) {
      const images = [];
      req.files.forEach((file) => {
        images.push(file.filename);
      });
      req.body.images = images;
    }

    const advertisement = await Advertisement.create(req.body);

    res.status(201).json({
      success: true,
      data: advertisement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all advertisements
// @route   GET /api/advertisements
// @access  Public
exports.getAdvertisements = async (req, res) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let query = Advertisement.find();

    // Filter by category if provided
    if (req.query.category) {
      query = query.find({ category: req.query.category });
    }

    // Filter by price range if provided
    if (req.query.minPrice && req.query.maxPrice) {
      query = query.find({
        price: {
          $gte: req.query.minPrice,
          $lte: req.query.maxPrice,
        },
      });
    }

    const total = await Advertisement.countDocuments(query);

    const advertisements = await query
      .populate({
        path: "user",
        select: "name",
      })
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
      count: advertisements.length,
      pagination,
      data: advertisements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get user advertisements
// @route   GET /api/advertisements/me
// @access  Private
exports.getMyAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find({ user: req.user.id }).sort(
      "-createdAt"
    );

    res.status(200).json({
      success: true,
      count: advertisements.length,
      data: advertisements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single advertisement
// @route   GET /api/advertisements/:id
// @access  Public
exports.getAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id).populate({
      path: "user",
      select: "name",
    });

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        error: "Advertisement not found",
      });
    }

    res.status(200).json({
      success: true,
      data: advertisement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update advertisement
// @route   PUT /api/advertisements/:id
// @access  Private
exports.updateAdvertisement = async (req, res) => {
  try {
    let advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        error: "Advertisement not found",
      });
    }

    // Make sure user is advertisement owner
    if (advertisement.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this advertisement",
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
        req.body.images = [...advertisement.images, ...newImages];
      } else {
        req.body.images = newImages;
      }
    }

    advertisement = await Advertisement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: advertisement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete advertisement
// @route   DELETE /api/advertisements/:id
// @access  Private
exports.deleteAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        error: "Advertisement not found",
      });
    }

    // Make sure user is advertisement owner
    if (
      advertisement.user.toString() !== req.user.id &&
      req.user.role !== "matron"
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete this advertisement",
      });
    }

    await advertisement.remove();

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
