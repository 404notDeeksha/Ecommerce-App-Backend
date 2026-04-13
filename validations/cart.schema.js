const { z } = require("zod");

const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer").optional().default(1),
});

const addCartItemsSchema = z.object({
  body: z.object({
    items: z.array(cartItemSchema).min(1, "At least one item is required"),
  }),
});

const updateCartQtySchema = z.object({
  params: z.object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z.string().or(z.number()).transform((val) => Number(val)),
  }),
});

const deleteCartItemSchema = z.object({
  params: z.object({
    productId: z.string().min(1, "Product ID is required"),
  }),
});

module.exports = {
  addCartItemsSchema,
  updateCartQtySchema,
  deleteCartItemSchema,
};
