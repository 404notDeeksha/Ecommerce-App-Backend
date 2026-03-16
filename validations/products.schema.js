const { z } = require("zod");

const getAllProductsSchema = z.object({
  query: z.object({
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
  }).optional(),
});

const getSingleProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
});

module.exports = {
  getAllProductsSchema,
  getSingleProductSchema,
};