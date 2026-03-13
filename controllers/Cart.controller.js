const cartService = require("../services/cart.service");
const asyncHandler = require("../utils/asyncHandler");

const addCartItems = asyncHandler(async (req, res) => {
  const { userId, items } = req.body;

  const cart = await cartService.addItemsToCart(userId, items);
  res.status(200).json({
    success: true,
    message: "Items added to cart successfully",
    data: cart,
  });
});

const updateCartQty = asyncHandler(async (req, res) => {
  const { userId, productId, quantity } = req.params;

  const result = await cartService.updateCartItemQuantity(
    userId,
    productId,
    quantity
  );

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: result,
  });
});

const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  let cart = await cartService.getCartByUserId(userId);

  if (!cart) {
    cart = await cartService.createCart({ userId, items: [] });
  }

  res.status(200).json({ success: true, data: cart });
});

const getCartQty = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const totalQuantity = await cartService.calculateCartQuantity(userId);

  res.status(200).json({ success: true, data: totalQuantity });
});

const deleteCartItem = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;

  const result = await cartService.removeCartItem(userId, productId);

  if (result.error) {
    return res.status(404).json({ success: false, message: result.error });
  }

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    data: result,
  });
});

module.exports = {
  addCartItems,
  updateCartQty,
  getCart,
  getCartQty,
  deleteCartItem,
};
