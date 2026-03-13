const express = require("express");
const cartController = require("../controllers/Cart.controller");
const validateRequest = require("../middlewares/validateRequest");
const {
  addCartItemsSchema,
  getCartSchema,
  getCartQtySchema,
  updateCartQtySchema,
  deleteCartItemSchema,
} = require("../validations/cart.schema");
const router = express.Router();

router.post("/", validateRequest(addCartItemsSchema), cartController.addCartItems);
router.get("/:userId", validateRequest(getCartSchema), cartController.getCart);
router.get("/quantity/:userId", validateRequest(getCartQtySchema), cartController.getCartQty);
router.put("/:userId/:productId/:quantity", validateRequest(updateCartQtySchema), cartController.updateCartQty);
router.delete("/:userId/:productId", validateRequest(deleteCartItemSchema), cartController.deleteCartItem);

module.exports = router;