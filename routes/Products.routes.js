const express = require("express");
const ProductRouter = express.Router();

const Products = require("../controllers/Products.controller");
const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/rbac.middleware");
const {
  getAllProductsSchema,
  getSingleProductSchema,
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
} = require("../validations/products.schema");

ProductRouter.route("/")
  .get(validateRequest(getAllProductsSchema), Products.getAllProducts);

ProductRouter.route("/product/:id")
  .get(validateRequest(getSingleProductSchema), Products.getSingleProduct);

ProductRouter.route("/")
  .post(
    authMiddleware,
    checkPermission("product:create"),
    validateRequest(createProductSchema),
    Products.createProduct
  );

ProductRouter.route("/:id")
  .put(
    authMiddleware,
    checkPermission("product:update"),
    validateRequest(updateProductSchema),
    Products.updateProduct
  );

ProductRouter.route("/:id")
  .delete(
    authMiddleware,
    checkPermission("product:delete"),
    validateRequest(deleteProductSchema),
    Products.deleteProduct
  );

module.exports = ProductRouter;
