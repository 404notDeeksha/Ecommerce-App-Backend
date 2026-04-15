const Carousel = require("../models/Carousel.model");
const asyncHandler = require("../utils/asyncHandler");

const transformCarouselItem = (item) => ({
  categoryId: item.category_id,
  displayType: item.display_type,
  categoryImageAddress: item.category_image_address,
});

// GET /api/carousel/featured
const getCarousel = asyncHandler(async (req, res) => {
  const carousel = await Carousel.find().lean();
  const transformedData = carousel.map(transformCarouselItem);
  res.status(200).json({ success: true, data: transformedData });
});

module.exports = { getCarousel };
