const Products = require("../models/Products.model");
const { v4: uuidv4 } = require("uuid");

const buildProductQuery = (filters) => {
  const query = {};

  if (filters.search) {
    query.$text = { $search: filters.search };
  }

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

  const minPrice = parseFloat(filters.minPrice);
  const maxPrice = parseFloat(filters.maxPrice);

  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
    query.price = {};

    if (!isNaN(minPrice)) {
      query.price.$gte = minPrice;
    }

    if (!isNaN(maxPrice)) {
      query.price.$lte = maxPrice;
    }
  }

  if (filters.brand) {
    query.brand = { $in: filters.brand.split(",") };
  }

  return query;
};

const buildSortOption = (sortBy, sortOrder) => {
  if (!sortBy) return { rating: -1 };

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

  // page cannot be < 1
  // limit cannot exceed 100
  const page = Math.max(parseInt(filters.page) || 1, 1);
  const limit = Math.min(parseInt(filters.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const sort = buildSortOption(filters.sortBy, filters.sortOrder);

  const [products, total] = await Promise.all([
    Products.find(query).sort(sort).skip(skip).limit(limit).lean(),
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

const createProduct = async (productData, userId) => {
  const product = new Products({
    ...productData,
    productId: uuidv4(),
    createdBy: userId,
    updatedBy: userId,
  });
  return await product.save();
};

const updateProduct = async (productId, productData, userId) => {
  const product = await Products.findOneAndUpdate(
    { productId },
    {
      ...productData,
      updatedBy: userId,
    },
    { new: true, runValidators: true }
  );
  return product;
};

const deleteProduct = async (productId) => {
  const product = await Products.findOneAndDelete({ productId });
  return product;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
