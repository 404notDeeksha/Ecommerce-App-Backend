const express = require("express");
const router = express.Router();

const userRouter = require("./User.routes");
const ProductRouter = require("./Products.routes");
const CartRouter = require("./Cart.routes");
const CarouselRouter = require("./Carousel.routes");

router.use("/user", userRouter);
router.use("/carousel", CarouselRouter);
router.use("/products", ProductRouter);
router.use("/cart", CartRouter);

module.exports = router;
