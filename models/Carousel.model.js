const mongoose = require("mongoose");

const carouselSchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    displayType: {
      type: String,
      required: true,
      trim: true,
    },
    categoryImageAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Carousel = mongoose.model("Carousel", carouselSchema);
module.exports = Carousel;
