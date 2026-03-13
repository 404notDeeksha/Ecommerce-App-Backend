const { Router } = require("express");
const Products = require("../controllers/Products.controller");
const validateRequest = require("../middlewares/validateRequest");
const {
  getAllProductsSchema,
  getSingleProductSchema,
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
module.exports = router;