const express = require("express");
const { getCarousel } = require("../controllers/Carousel.controller");
const router = express.Router();

router.get("/featured", getCarousel);

module.exports = router;