const productService = require("../services/products.service");
const asyncHandler = require("../utils/asyncHandler");

const getAllProducts = asyncHandler(async (req, res) => {
  const filters = req.query;

  const products = await productService.getAllProducts(filters);

  if (!products || products.length === 0) {
    return res.status(200).json({
      success: false,
      message: "No products found matching the filters.",
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    data: products,
  });
});

const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product Not Found!" });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

module.exports = {
  getAllProducts,
  getSingleProduct,
};