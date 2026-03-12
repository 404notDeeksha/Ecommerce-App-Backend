const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Define the schema for cart items
const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
    },
    colour: {
      type: String,
    },
    images: {
      type: [String],
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
