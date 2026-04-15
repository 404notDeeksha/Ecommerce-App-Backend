const express = require("express");
const { getCarousel } = require("../controllers/Carousel.controller");
const carouselRouter = express.Router();

carouselRouter.get("/featured", getCarousel);

module.exports = carouselRouter;
