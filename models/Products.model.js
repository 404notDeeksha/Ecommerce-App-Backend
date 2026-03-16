const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  colour: { type: String, required: true },
  size: { type: String, default: null },
  price: { type: Number, required: true },
  stockAvailability: { type: Boolean, required: true },
});

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    productDescription: { type: String, required: true, maxlength: 100 },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    modelName: { type: String, required: true },
    colour: { type: String, required: true },
    itemDimensions: { type: String, required: true },
    images: [{ type: String, required: true }],
    weight: { type: String, required: true },
    material: { type: String, required: true },
    warranty: { type: String, required: true },
    stockAvailability: { type: Boolean, required: true },
    rating: { type: Number, required: true },
    aboutThisItem: [{ type: String, required: true }],
    discount: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    bestseller: { type: Boolean, required: true },
    items: [itemSchema],
  },
  { timestamps: true }
);

productSchema.index({
  productName: "text",
  productDescription: "text",
  brand: "text",
  category: "text",
  subCategory: "text",
});

// indexes for filtering & sorting performance
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ discount: -1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
