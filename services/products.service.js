const Products = require("../models/Products.model");

const buildProductQuery = (filters) => {
  const query = {};

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.subCategory) {
    query.subCategory = filters.subCategory;
  }

  if (filters.discount) {
    query.discount = {
      ...{ $gte: 0 },
      ...{ $lte: filters.discount },
    };
  }

  if (
    (filters.minPrice !== undefined && filters.minPrice !== "") ||
    (filters.maxPrice !== undefined && filters.maxPrice !== "")
  ) {
    query.price = {
      ...(filters.minPrice !== undefined &&
        filters.minPrice !== "" && { $gte: parseFloat(filters.minPrice) }),
      ...(filters.maxPrice !== undefined &&
        filters.maxPrice !== "" && { $lte: parseFloat(filters.maxPrice) }),
    };
  }

  if (filters.brand) {
    query.brand = { $in: filters.brand.split(",") };
  }

  return query;
};

const getAllProducts = async (filters) => {
  const query = buildProductQuery(filters);
  return await Products.find(query).lean();
};

const getProductById = async (productId) => {
  return await Products.findOne({ productId }).lean();
};

module.exports = {
  getAllProducts,
  getProductById,
};