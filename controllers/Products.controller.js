const productService = require("../services/products.service");
const asyncHandler = require("../utils/asyncHandler");

const getAllProducts = asyncHandler(async (req, res) => {
  const filters = req.query;

  const result = await productService.getAllProducts(filters);

  if (!result.data || result.data.length === 0) {
    return res.status(200).json({
      success: true,
      data: [],
      pagination: {
        total: 0,
        page: parseInt(filters.page) || 1,
        limit: parseInt(filters.limit) || 20,
        totalPages: 0,
      },
    });
  }

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
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

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user.userId);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.body,
    req.user.userId
  );

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product Not Found!" });
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product Not Found!" });
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};