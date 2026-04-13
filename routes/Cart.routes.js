const express = require("express");
const cartController = require("../controllers/Cart.controller");
const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  addCartItemsSchema,
  getCartSchema,
  getCartQtySchema,
  updateCartQtySchema,
  deleteCartItemSchema,
} = require("../validations/cart.schema");
const router = express.Router();

// All cart routes require authentication
// userId is derived from JWT token (req.user.userId)

router.post("/", authMiddleware, validateRequest(addCartItemsSchema), cartController.addCartItems);
router.get("/", authMiddleware, cartController.getCart);
router.get("/quantity", authMiddleware, cartController.getCartQty);
router.put("/:productId/:quantity", authMiddleware, validateRequest(updateCartQtySchema), cartController.updateCartQty);
router.delete("/:productId", authMiddleware, validateRequest(deleteCartItemSchema), cartController.deleteCartItem);

module.exports = router;
