const Cart = require("../models/Cart.model");

const getCartByUserId = async (userId) => {
  return await Cart.findOne({ userId });
};

const createCart = async ({ userId, items = [] }) => {
  return await Cart.create({
    userId,
    items,
    totalPrice: 0,
  });
};

const addItemsToCart = async (userId, items) => {
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
  return cart;
};

const updateCartItemQuantity = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return { error: "Cart not found for the user." };
  }

  const cartItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (!cartItem) {
    return { error: "Product not found in the cart." };
  }

  if (quantity !== 0) {
    cartItem.quantity = quantity;
  }

  await cart.save();
  return cart;
};

const removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return { error: "Cart not found" };
  }

  cart.items = cart.items.filter((item) => item.productId !== productId);

  await cart.save();
  return cart;
};

const calculateCartQuantity = async (userId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return 0;
  }

  return cart.items.reduce((acc, item) => acc + item.quantity, 0);
};

module.exports = {
  getCartByUserId,
  createCart,
  addItemsToCart,
  updateCartItemQuantity,
  removeCartItem,
  calculateCartQuantity,
};
