const Carousel = require("../models/Carousel.model");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/carousel/featured
const getCarousel = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: carousel });
});

module.exports = { getCarousel };
