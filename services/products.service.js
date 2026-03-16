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

const buildSortOption = (sortBy, sortOrder) => {
  if (!sortBy) return {};
  
  const sortDir = sortOrder === "desc" ? -1 : 1;
  
  switch (sortBy) {
    case "price":
      return { price: sortDir };
    case "name":
      return { productName: sortDir };
    case "rating":
      return { rating: sortDir };
    default:
      return {};
  }
};

const getAllProducts = async (filters) => {
  const query = buildProductQuery(filters);
  
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 20;
  const skip = (page - 1) * limit;
  
  const sort = buildSortOption(filters.sortBy, filters.sortOrder);
  
  const [products, total] = await Promise.all([
    Products.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Products.countDocuments(query),
  ]);

  return {
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getProductById = async (productId) => {
  return await Products.findOne({ productId }).lean();
};

module.exports = {
  getAllProducts,
  getProductById,
};