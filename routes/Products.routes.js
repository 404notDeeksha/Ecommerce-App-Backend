const { Router } = require("express");
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
const router = Router();

router.get(
  "/",
  validateRequest(getAllProductsSchema),
  Products.getAllProducts
);
router.get(
  "/product/:id",
  validateRequest(getSingleProductSchema),
  Products.getSingleProduct
);

router.post(
  "/",
  authMiddleware,
  checkPermission("product:create"),
  validateRequest(createProductSchema),
  Products.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  checkPermission("product:update"),
  validateRequest(updateProductSchema),
  Products.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  checkPermission("product:delete"),
  validateRequest(deleteProductSchema),
  Products.deleteProduct
);

module.exports = router;