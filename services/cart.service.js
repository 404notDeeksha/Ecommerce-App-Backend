const Cart = require("../models/Cart.model");

const getOrCreateCart = async (userId) => {
  return Cart.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId, items: [], totalPrice: 0 } },
    { new: true, upsert: true, lean: true }
  );
};

const addItemsToCart = async (userId, items) => {
  const existingCart = await Cart.findOne({ userId });

  if (!existingCart) {
    return Cart.create({ userId, items });
  }

  items.forEach((newItem) => {
    const existingIndex = existingCart.items.findIndex(
      (item) => item.productId === newItem.productId
    );

    if (existingIndex === -1) {
      existingCart.items.push(newItem);
    } else {
      existingCart.items[existingIndex].quantity =
        newItem.quantity || existingCart.items[existingIndex].quantity;
    }
  });

  return existingCart.save();
};

const updateCartItemQuantity = async (userId, productId, quantity) => {
  const cart = await Cart.findOneAndUpdate(
    {
      userId,
      "items.productId": productId,
    },
    {
      $set: { "items.$.quantity": quantity },
    },
    { new: true, lean: true }
  );

  if (!cart) {
    const cartExists = await Cart.exists({ userId });
    if (!cartExists) {
      return { error: "Cart not found for the user." };
    }
    return { error: "Product not found in the cart." };
  }

  return cart;
};

const removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $pull: { items: { productId } } },
    { new: true, lean: true }
  );

  if (!cart) {
    return { error: "Cart not found" };
  }

  return cart;
};

const calculateCartQuantity = async (userId) => {
  const result = await Cart.aggregate([
    { $match: { userId } },
    { $unwind: "$items" },
    {
      $group: {
        _id: null,
        totalQuantity: { $sum: "$items.quantity" },
      },
    },
  ]);

  return result[0]?.totalQuantity ?? 0;
};

module.exports = {
  getOrCreateCart,
  addItemsToCart,
  updateCartItemQuantity,
  removeCartItem,
  calculateCartQuantity,
};
