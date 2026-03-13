const Cart = require("../models/Cart.model");
const asyncHandler = require("../utils/asyncHandler");

// POST/api/cart
const addCartItems = asyncHandler(async (req, res) => {
  const { userId, items } = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items });
  } else {
    items.forEach((newItem) => {
      const index = cart.items.findIndex(
        (item) => item.productId === newItem.productId
      );

      if (index === -1) {
        cart.items.push(newItem);
      } else {
        cart.items[index].quantity =
          newItem.quantity || cart.items[index].quantity;
      }
    });
  }

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Items added to cart successfully",
    data: cart,
  });
});

//  PUT/api/cart
const updateCartQty = asyncHandler(async (req, res) => {
  const { userId, productId, quantity } = req.params;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(404).json({ error: "Cart not found for the user." });
  }

  const cartItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (!cartItem) {
    return res.status(404).json({ error: "Product not found in the cart." });
  }

  if (quantity !== 0) {
    cartItem.quantity = quantity;
  }

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cart,
  });
});

//   GET/api/cart/:userId
const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [],
      totalPrice: 0,
    });
  }

  res.status(200).json({ success: true, data: cart });
});

const getCartQty = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const cart = await Cart.findOne({ userId });

  const totalQuantity = cart
    ? cart.items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  res.status(200).json({ success: true, data: totalQuantity });
});

//   DELETE/api/cart/:userId/:productId
const deleteCartItem = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }

  cart.items = cart.items.filter((item) => item.productId !== productId);

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    data: cart,
  });
});

module.exports = {
  addCartItems,
  updateCartQty,
  getCart,
  getCartQty,
  deleteCartItem,
};
