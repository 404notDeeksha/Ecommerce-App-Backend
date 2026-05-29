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
    productDescription: { type: String, required: true, maxlength: 5000 },
    price: { type: Number, required: true },
    brand: { type: String },
    modelName: { type: String },
    colour: { type: String },
    itemDimensions: { type: String },
    images: [{ type: String }],
    weight: { type: String },
    material: { type: String },
    warranty: { type: String },
    stockAvailability: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    aboutThisItem: [{ type: String }],
    discount: { type: Number, default: 0 },
    category: { type: String, required: true },
    subCategory: { type: String },
    bestseller: { type: Boolean, default: false },
    items: [itemSchema],
    createdBy: { type: String },
    updatedBy: { type: String },
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
productSchema.index({ productName: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
