const { z } = require("zod");

const getAllProductsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    subCategory: z.string().optional(),
    discount: z
      .string()
      .or(z.number())
      .transform((val) => (val === "" ? undefined : Number(val)))
      .optional(),
    minPrice: z
      .string()
      .or(z.number())
      .transform((val) => (val === "" ? undefined : Number(val)))
      .optional(),
    maxPrice: z
      .string()
      .or(z.number())
      .transform((val) => (val === "" ? undefined : Number(val)))
      .optional(),
    brand: z.string().optional(),
    page: z
      .string()
      .or(z.number())
      .transform((val) => (val === "" ? undefined : Number(val)))
      .optional(),
    limit: z
      .string()
      .or(z.number())
      .transform((val) => (val === "" ? undefined : Number(val)))
      .optional(),
    sortBy: z.enum(["price", "name", "rating"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }).optional(),
});

const getSingleProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
});

const createProductSchema = z.object({
  body: z.object({
    productName: z.string().min(1, "Product name is required").max(200),
    description: z.string().min(1, "Description is required"),
    price: z.number().positive("Price must be a positive number"),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().optional(),
    brand: z.string().optional(),
    images: z.array(z.string().url()).optional(),
    discount: z.number().min(0).max(100).optional(),
    stock: z.number().int().min(0).optional().default(0),
    rating: z.number().min(0).max(5).optional().default(0),
  }),
});

const updateProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
  body: z.object({
    productName: z.string().min(1).max(200).optional(),
    description: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    category: z.string().min(1).optional(),
    subCategory: z.string().optional(),
    brand: z.string().optional(),
    images: z.array(z.string().url()).optional(),
    discount: z.number().min(0).max(100).optional(),
    stock: z.number().int().min(0).optional(),
    rating: z.number().min(0).max(5).optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});

const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
});

module.exports = {
  getAllProductsSchema,
  getSingleProductSchema,
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
};