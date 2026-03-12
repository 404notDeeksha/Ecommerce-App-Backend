const mongoose = require("mongoose");

// update keys to camelCase in be & fe
const carouselSchema = new mongoose.Schema(
  {
    category_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    display_type: {
      type: String,
      required: true,
      trim: true,
    },
    category_image_address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Carousel = mongoose.model("Carousel", carouselSchema);
module.exports = Carousel;
