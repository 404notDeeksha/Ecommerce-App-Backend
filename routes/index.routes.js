const express = require("express");
const router = express.Router();

const authRouter = require("./auth.routes");
const userRouter = require("./User.routes");
const CarouselRouter = require("./Carousel.routes");
const ProductRouter = require("./Products.routes");
const CartRouter = require("./Cart.routes");

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/carousel", CarouselRouter);
router.use("/products", ProductRouter);
router.use("/cart", CartRouter);

module.exports = router;
