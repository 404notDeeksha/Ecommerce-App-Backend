const express = require("express");
const CartRouter = express.Router();

const cartController = require("../controllers/Cart.controller");
const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  addCartItemsSchema,
  updateCartQtySchema,
  deleteCartItemSchema,
} = require("../validations/cart.schema");

// All cart routes require authentication
// userId is derived from JWT token (req.user.userId)

CartRouter.route("/")
  .post(authMiddleware, validateRequest(addCartItemsSchema), cartController.addCartItems)
  .get(authMiddleware, cartController.getCart);

CartRouter.route("/quantity").get(authMiddleware, cartController.getCartQty);

CartRouter.route("/:productId/:quantity")
  .put(authMiddleware, validateRequest(updateCartQtySchema), cartController.updateCartQty);

CartRouter.route("/:productId")
  .delete(authMiddleware, validateRequest(deleteCartItemSchema), cartController.deleteCartItem);

module.exports = CartRouter;
